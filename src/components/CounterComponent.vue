<!--
  CounterComponent.vue — учебный компонент.
  Демонстрирует базовые примитивы реактивности Vue 3:
  - ref()      — реактивная обёртка для любого значения
  - computed() — вычисляемое свойство с кешированием
  - v-model    — двустороннее связывание (данные ↔ интерфейс)
-->
<template>
  <q-card flat bordered class="q-pa-md">
    <q-card-section>
      <div class="text-h6">Счётчик (локальное состояние через ref)</div>
      <div class="text-caption text-grey">
        Каждый экземпляр компонента хранит собственное состояние.
        Изменения в одном счётчике не влияют на другой.
      </div>
    </q-card-section>

    <q-card-section class="q-gutter-sm">
      <!--
        v-model.number — двустороннее связывание с модификатором .number.
        Что происходит под капотом:
          1. :model-value="step" — передаёт значение ref'а в input
          2. @update:model-value="val => step = val" — записывает введённое значение обратно
        Модификатор .number автоматически преобразует строку в число
        (аналог parseFloat).
      -->
      <q-input
        v-model.number="step"
        type="number"
        label="Шаг"
        dense
        outlined
        :min="1"
        style="max-width: 150px"
      />

      <!--
        :class="countColor" — динамический CSS-класс.
        Значение countColor — результат computed(), который зависит от count.
        Когда count меняется → countColor пересчитывается → класс обновляется →
        Vue обновляет только атрибут class у этого div, не перерисовывая весь DOM.
      -->
      <div class="text-center q-ma-md">
        <div class="text-h2" :class="countColor">{{ count }}</div>
        <div class="text-caption">
          Удвоенное: {{ doubled }}
        </div>
      </div>

      <!--
        @click="increment" — обработчик события клика.
        В <script setup> функции автоматически доступны в шаблоне,
        их не нужно экспортировать или возвращать.
        :disable="!canDecrement" — условное отключение кнопки.
      -->
      <div class="row justify-center q-gutter-sm">
        <q-btn color="negative" icon="remove" @click="decrement" :disable="!canDecrement">
          Минус
        </q-btn>
        <q-btn color="primary" icon="add" @click="increment">
          Плюс
        </q-btn>
        <q-btn color="grey" icon="restart_alt" @click="reset">
          Сброс
        </q-btn>
      </div>

      <!--
        Условный рендеринг: v-if / v-else-if / velse.
        Vue рендерит только одну ветку — ту, условие которой истинно.
        Остальные ветки не создаются в DOM вообще (в отличие от v-show,
        который просто прячет элемент через display:none).
      -->
      <q-badge v-if="isPositive" color="positive">Положительное</q-badge>
      <q-badge v-else-if="isNegative" color="negative">Отрицательное</q-badge>
      <q-badge v-else color="grey">Ноль</q-badge>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// ============================================================
// ref() — основной примитив реактивности в Composition API.
//
// Как это работает (упрощённо):
//   ref(0) создаёт объект { __v_isRef: true, _value: 0 }
//   и обёртывает его в Proxy, который отслеживает чтение (.value)
//   и запись. При записи Vue запускает все эффекты (computed, watch,
//   перерисовка шаблона), которые зависят от этого ref'а.
//
// Важный нюанс: в <script> доступ через .value,
// в шаблоне — Vue автоматически «разворачивает» ref,
// поэтому пишем {{ count }}, а не {{ count.value }}.
// ============================================================
const count = ref(0);       // реактивное число, начальное значение 0
const step = ref(1);        // шаг изменения счётчика
const canDecrement = ref(true); // флаг: можно ли уменьшать

// ============================================================
// computed() — вычисляемое свойство с кешированием.
//
// Отличие от обычной функции:
//   const doubled = computed(() => count.value * 2)
//   — вычисляется ОДИН РАЗ при создании
//   — результат кешируется
//   — пересчитывается ТОЛЬКО когда count меняется
//   — если count не менялся, возвращается кешированное значение
//
//   const doubled = () => count.value * 2
//   — вычисляется при КАЖДОМ обращении
//   — нет кеширования
//   — в шаблоне пересчитывается при каждой перерисовке
// ============================================================
const doubled = computed(() => count.value * 2);

const isPositive = computed(() => count.value > 0);
const isNegative = computed(() => count.value < 0);

// computed может возвращать любой тип, включая строки для CSS-классов
const countColor = computed(() => {
  if (count.value > 0) return 'text-positive';
  if (count.value < 0) return 'text-negative';
  return 'text-grey';
});

// Обработчики событий — обычные функции.
// В <script setup> они автоматически доступны в шаблоне,
// потому что компилятор добавляет их в возвращаемый объект.
function increment() {
  count.value += step.value;
  canDecrement.value = true;
}

function decrement() {
  count.value -= step.value;
}

function reset() {
  count.value = 0;
  step.value = 1;
  canDecrement.value = true;
}
</script>
