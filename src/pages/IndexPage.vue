<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">Vite + Quasar + Vue 3 + TypeScript</div>
    <p class="text-body1 text-grey-7">
      ДЗ 1: разворачивание проекта через Vite, основы Composition API
    </p>

    <div class="row q-col-gutter-md q-mt-lg">
      <!-- Локальный счётчик — ref() и computed() внутри одного компонента -->
      <div class="col-12 col-md-6">
        <CounterComponent />
      </div>

      <!--
        Глобальный store — тот же ref()/computed(), но данные живут
        в Pinia store и доступны из любого компонента приложения.
        Оба счётчика (локальный и глобальный) независимы друг от друга.
      -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="q-pa-md">
          <q-card-section>
            <div class="text-h6">Счётчик из Store (Pinia + ref)</div>
            <div class="text-caption text-grey">
              Общее состояние через Pinia store — значение сохраняется при навигации между страницами
            </div>
          </q-card-section>

          <q-card-section class="text-center">
            <!--
              store.count — реактивное значение из Pinia.
              Pinia оборачивает ref'ы из store так, что в шаблоне
              к ним можно обращаться без .value:
              store.count (а не store.count.value).
            -->
            <div class="text-h3 text-primary">{{ store.count }}</div>
            <div class="text-caption">Удвоенное: {{ store.doubleCount }}</div>
          </q-card-section>

          <q-card-section class="row justify-center q-gutter-sm">
            <q-btn color="negative" icon="remove" @click="store.decrement()" />
            <q-btn color="grey" icon="restart_alt" @click="store.reset()" />
            <q-btn color="primary" icon="add" @click="store.increment()" />
          </q-card-section>

          <q-card-section>
            <q-input
              v-model.number="storeStep"
              type="number"
              label="Шаг"
              dense
              outlined
              :min="1"
              style="max-width: 120px"
              @update:model-value="store.setStep(Number($event) || 1)"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Список задач — реактивные массивы + computed для фильтрации -->
      <div class="col-12">
        <TaskList />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CounterComponent from 'components/CounterComponent.vue';
import TaskList from 'components/TaskList.vue';
import { useCounterStore } from 'stores/counter-store';

// Вызов useCounterStore() внутри setup() компонента.
// Pinia находит store по имени 'counter' и возвращает реактивный объект.
// Все ref'ы из return в store становятся свойствами этого объекта.
const store = useCounterStore();

// Локальная копия шага для q-input.
// Нужна, потому что q-input с v-model записывает строку при каждом нажатии,
// а store.step — число. Промежуточный ref решает проблему.
const storeStep = ref(store.step);
</script>
