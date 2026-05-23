<!--
  VaporModePage.vue — страница с бенчмарком производительности.

  Vue Vapor Mode — режим компиляции, вдохновлённый SolidJS.
  Шаблон компилируется напрямую в операции с реальным DOM,
  минуя Virtual DOM целиком.

  Вошёл в состав Vue 3.6 (beta — декабрь 2025, stable — первая половина 2026).
  Включается атрибутом `vapor` на теге <script setup>.

  Эта страница показывает, как текущий Vue (с VDOM) справляется с обновлениями,
  и объясняет, почему Vapor Mode быстрее.
-->
<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">Vue Vapor Mode: производительность</div>
    <p class="text-body2 text-grey-7">
      Интерактивный бенчмарк, который показывает, как Virtual DOM обрабатывает
      обновления, и почему Vapor Mode обещает быть быстрее.
    </p>

    <!-- ==========================================================
         СЕКЦИЯ 1: Теория — VDOM vs Vapor Mode
         ========================================================== -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Как работает рендеринг в Vue</div>

        <div class="row q-col-gutter-md">
          <!-- Текущий подход: Virtual DOM -->
          <div class="col-12 col-md-6">
            <q-card flat bordered class="bg-orange-1">
              <q-card-section>
                <div class="text-subtitle1 text-weight-bold">Текущий: Virtual DOM</div>
                <div class="text-caption text-grey-7 q-mb-sm">
                  Шаги при обновлении данных:
                </div>
                <ol class="text-body2 q-pl-md" style="line-height: 2">
                  <li>Реактивные данные изменились</li>
                  <li>Vue запускает <strong>render-функцию</strong> компонента</li>
                  <li>Создаётся новое <strong>VNode-дерево</strong> (JS-объекты)</li>
                  <li>Старое и новое дерево <strong>сравниваются</strong> (diff)</li>
                  <li>Минимальный набор <strong>DOM-патчей</strong> применяется</li>
                </ol>
                <q-badge color="orange" class="q-mt-sm">
                  N элементов → O(N) VNode + O(N) diff
                </q-badge>
              </q-card-section>
            </q-card>
          </div>

          <!-- Vapor Mode -->
          <div class="col-12 col-md-6">
            <q-card flat bordered class="bg-green-1">
              <q-card-section>
                <div class="text-subtitle1 text-weight-bold">Vapor Mode: прямой DOM</div>
                <div class="text-caption text-grey-7 q-mb-sm">
                  Шаги при обновлении данных:
                </div>
                <ol class="text-body2 q-pl-md" style="line-height: 2">
                  <li>Реактивные данные изменились</li>
                  <li>Vue <strong>сразу обновляет</strong> нужный DOM-узел</li>
                </ol>
                <q-badge color="positive" class="q-mt-sm">
                  1 элемент → O(1) — точечное обновление
                </q-badge>
                <div class="text-caption text-grey-7 q-mt-md">
                  Нет VNode-дерева, нет diff-алгоритма, нет промежуточного слоя.
                  Каждый реактивный «эффект» связан напрямую с конкретным DOM-узлом.
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="text-body2 text-grey-7 q-mt-md">
          <strong>Аналогия:</strong> VDOM — как пересмотреть весь шкаф, чтобы найти одну рубашку.
          Vapor Mode — рубашка лежит на виду, вы берёте её сразу.
          Разница незаметна в маленьком шкафу (10 элементов), но критична
          в большом (10 000 элементов).
        </div>
      </q-card-section>
    </q-card>

    <!-- ==========================================================
         СЕКЦИЯ 2: Синтаксис — как включить Vapor Mode
         ========================================================== -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Как включить Vapor Mode (Vue 3.6)</div>
        <div class="text-body2 text-grey-7 q-mb-md">
          Vapor Mode включается <strong>на уровне отдельного компонента</strong> —
          добавьте атрибут <code>vapor</code> на тег
          <code>&lt;script setup&gt;</code>. Код компонента не меняется,
          меняется только то, во что его компилирует Vue.
        </div>

        <div class="row q-col-gutter-md">
          <!-- VDOM-компонент -->
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 q-mb-sm">Обычный (Virtual DOM)</div>
            <q-card flat bordered class="bg-grey-2">
              <q-card-section v-pre class="text-body2" style="font-family: monospace; white-space: pre; font-size: 13px">
&lt;script setup&gt;
import { ref } from 'vue'

const count = ref(0)
function increment() {
  count.value++
}
&lt;/script&gt;

&lt;template&gt;
  &lt;button @click="increment"&gt;
    Count: {{ count }}
  &lt;/button&gt;
&lt;/template&gt;
              </q-card-section>
            </q-card>
          </div>

          <!-- Vapor-компонент -->
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 q-mb-sm">
              Vapor Mode
              <q-badge color="positive" class="q-ml-sm">Vue 3.6+</q-badge>
            </div>
            <q-card flat bordered class="bg-green-1">
              <q-card-section v-pre class="text-body2" style="font-family: monospace; white-space: pre; font-size: 13px">
<span class="text-weight-bold text-positive">&lt;script setup vapor&gt;</span>
import { ref } from 'vue'

const count = ref(0)
function increment() {
  count.value++
}
&lt;/script&gt;

&lt;template&gt;
  &lt;button @click="increment"&gt;
    Count: {{ count }}
  &lt;/button&gt;
&lt;/template&gt;
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="text-body2 text-grey-7 q-mt-md">
          Разница — <strong>одно слово</strong> <code>vapor</code>.
          Шаблон, скрипт и стиль остаются прежними.
          Компилятор Vue генерирует другой выходной код:
          вместо render-функции, создающей VNode-дерево,
          он создаёт функции прямого DOM-обновления.
        </div>

        <q-separator class="q-my-md" />

        <div class="text-subtitle2 q-mb-sm">Официальные бенчмарки (из RFC Vue)</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-card flat bordered class="bg-blue-1 text-center q-pa-md">
              <div class="text-h5 text-primary">-65%</div>
              <div class="text-caption">Размер бандла (Hello World)</div>
              <div class="text-caption text-grey">22.8 КБ → 7.9 КБ</div>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card flat bordered class="bg-green-1 text-center q-pa-md">
              <div class="text-h5 text-positive">×1.66</div>
              <div class="text-caption">Скорость сложного списка</div>
              <div class="text-caption text-grey">на 40% быстрее diff</div>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card flat bordered class="bg-purple-1 text-center q-pa-md">
              <div class="text-h5 text-purple">-42%</div>
              <div class="text-caption">Пиковое потребление памяти</div>
              <div class="text-caption text-grey">за счёт отсутствия VNode</div>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- ==========================================================
         СЕКЦИЯ 3: Ограничения
         ========================================================== -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Ограничения и совместимость</div>

        <q-list dense>
          <q-item>
            <q-item-section avatar>
              <q-icon color="negative" name="block" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Options API не поддерживается</q-item-label>
              <q-item-label caption>
                Vapor Mode работает только с <code>&lt;script setup&gt;</code>
                и Composition API. Если в проекте есть компоненты на Options API —
                они продолжат работать через VDOM, но не получат преимуществ Vapor.
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="warning" name="warning" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Не все встроенные компоненты готовы</q-item-label>
              <q-item-label caption>
                <code>&lt;Transition&gt;</code> и <code>&lt;KeepAlive&gt;</code>
                пока не поддерживаются в Vapor-компонентах.
                Полная поддержка ожидается в стабильном релизе.
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="positive" name="check_circle" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Vapor и VDOM компоненты можно смешивать</q-item-label>
              <q-item-label caption>
                Vapor-компонент может импортировать VDOM-компонент и наоборот.
                Vue автоматически создаёт interop-слой между ними.
                Плагин <code>vaporInteropPlugin</code> обеспечивает работу
                с UI-библиотеками (Element Plus, Ant Design Vue, Quasar).
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="positive" name="check_circle" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Кастомные директивы — новый синтаксис</q-item-label>
              <q-item-label caption>
                В Vapor Mode директива принимает реактивный getter
                и может возвращать функцию очистки. Есть официальный codemod
                для миграции существующих директив.
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="info" name="terminal" />
            </q-item-section>
            <q-item-section>
              <q-item-label>createVaporApp — для новых проектов</q-item-label>
              <q-item-label caption>
                Если весь проект на Vapor, можно создать приложение через
                <code>createVaporApp()</code> — нулевой VDOM-рантайм в бандле.
                Или через CLI: <code>npm init vue@latest --template vapor</code>.
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- ==========================================================
         СЕКЦИЯ 5: Бенчмарк
         ========================================================== -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Бенчмарк: обновление списка</div>
        <div class="text-body2 text-grey-7 q-mb-md">
          Создаём список из N элементов. Каждый элемент отображает число.
          Замеряем время операций. Для честного замера используем
          <code>performance.now()</code> + <code>nextTick()</code>
          (чтобы дождаться реального обновления DOM).
        </div>

        <!-- Настройки -->
        <div class="row items-center q-gutter-md q-mb-md">
          <div class="text-body2">Количество элементов:</div>
          <!--
            q-slider — ползунок. v-model связан с itemCount (ref).
            @update:model-value вызывается при отпускании ползунка.
          -->
          <q-slider
            v-model="itemCount"
            :min="100"
            :max="10000"
            :step="100"
            label
            label-always
            style="max-width: 300px"
            color="primary"
          />
          <q-btn
            color="primary"
            label="Создать"
            @click="generateItems"
            :disable="isRunning"
          />
        </div>

        <!-- Кнопки операций (доступны после создания списка) -->
        <div class="row q-gutter-sm q-mb-md" v-if="items.length > 0">
          <q-btn
            outline
            color="primary"
            label="Обновить ОДИН элемент"
            @click="updateOne"
            :loading="isRunning"
          />
          <q-btn
            outline
            color="orange"
            label="Обновить ВСЕ элементы"
            @click="updateAll"
            :loading="isRunning"
          />
          <q-btn
            outline
            color="purple"
            label="Перемешать (shuffle)"
            @click="shuffleItems"
            :loading="isRunning"
          />
          <q-btn
            outline
            color="teal"
            label="Добавить 100 элементов"
            @click="appendItems"
            :loading="isRunning"
          />
          <q-btn
            flat
            color="grey"
            label="Очистить результаты"
            @click="results = []"
          />
        </div>
      </q-card-section>

      <!-- Таблица результатов -->
      <q-card-section v-if="results.length > 0">
        <q-markup-table flat bordered dense>
          <thead>
            <tr>
              <th>Операция</th>
              <th>Элементов</th>
              <th>Время (мс)</th>
              <th>Что происходит в VDOM</th>
              <th>Что было бы в Vapor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in results" :key="i">
              <td>
                <q-badge :color="r.color">{{ r.label }}</q-badge>
              </td>
              <td>{{ r.count }}</td>
              <td>
                <strong>{{ r.time }}</strong>
              </td>
              <td class="text-caption">{{ r.vdomExplain }}</td>
              <td class="text-caption">{{ r.vaporExplain }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>

    <!-- ==========================================================
         СЕКЦИЯ 6: Визуализация элементов
         ========================================================== -->
    <q-card flat bordered class="q-mb-md" v-if="items.length > 0">
      <q-card-section>
        <div class="text-h6 q-mb-sm">
          Визуализация (первые {{ visibleCount }} из {{ items.length }})
        </div>
        <div class="text-caption text-grey q-mb-md">
          Каждый квадрат — один элемент списка. Число — его значение.
          При обновлении элемента его квадрат подсвечивается.
        </div>
        <div class="row q-gutter-xs" style="flex-wrap: wrap">
          <!--
            Рендерим только видимую часть элементов.
            Если рендерить 10000 — сам бенчмарк будет тормозить
            из-за огромного DOM. Поэтому показываем первые N.
          -->
          <transition-group name="list">
            <q-chip
              v-for="item in visibleItems"
              :key="item.id"
              :color="item.recentlyUpdated ? 'positive' : 'grey-4'"
              :text-color="item.recentlyUpdated ? 'white' : 'dark'"
              dense
              square
              size="sm"
            >
              {{ item.value.toFixed(1) }}
            </q-chip>
          </transition-group>
        </div>
      </q-card-section>
    </q-card>

    <!-- ==========================================================
         СЕКЦИЯ 7: Почему Vapor Mode быстрее
         ========================================================== -->
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6 q-mb-md">Почему Vapor Mode быстрее</div>

        <q-list dense>
          <q-item>
            <q-item-section avatar>
              <q-icon color="primary" name="looks_one" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Нет создания VNode-объектов</q-item-label>
              <q-item-label caption>
                В текущем Vue каждое обновление создаёт JS-объекты (VNodes) для
                ВСЕХ элементов списка — даже если изменился один. Vapor Mode не
                создаёт промежуточные объекты вообще. Меньше аллокаций = меньше
                работы для garbage collector.
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="primary" name="looks_two" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Нет diff-алгоритма</q-item-label>
              <q-item-label caption>
                Diff — это O(N) операция: нужно сравнить каждое свойство каждого
                VNode со старым. Vapor Mode пропускает этот шаг целиком.
                Реактивный эффект напрямую привязан к DOM-узлу.
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="primary" name="looks_3" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Меньший размер бандла</q-item-label>
              <q-item-label caption>
                Рантайм Virtual DOM (~40 КБ) не нужен в Vapor Mode.
                Компилятор генерирует только конкретные DOM-операции
                (createElement, setTextContent, setAttribute...).
                Для простых компонентов экономия значительная.
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="primary" name="looks_4" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Совместимость</q-item-label>
              <q-item-label caption>
                Vapor Mode — опциональный режим. Можно смешивать VDOM-компоненты
                и Vapor-компоненты в одном приложении. Migration происходит
                постепенно, без переписывания всего проекта.
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-separator class="q-my-md" />

        <div class="text-body2 text-grey-7">
          <strong>Хронология:</strong>
        </div>
        <q-timeline dense color="primary" class="q-mt-sm">
          <q-timeline-entry title="Vapor Mode анонсирован" subtitle="2023" :icon="'campaign'" />
          <q-timeline-entry
            title="vue-vapor влит в vuejs/core"
            subtitle="Июль 2025"
            :icon="'merge_type'"
          >
            <div class="text-caption text-grey">
              Отдельный репозиторий <code>vuejs/vue-vapor</code> архивирован.
              Разработка продолжается в ветке <code>vapor</code> репозитория
              <code>vuejs/core</code>.
            </div>
          </q-timeline-entry>
          <q-timeline-entry
            title="Vue 3.6 beta — Vapor feature-complete"
            subtitle="Декабрь 2025"
            :icon="'science'"
          >
            <div class="text-caption text-grey">
              Vue 3.6 beta выпущен перед Новым годом. Vapor Mode функционально завершён,
              можно тестировать на реальных проектах.
            </div>
          </q-timeline-entry>
          <q-timeline-entry
            title="Vue 3.6 stable"
            subtitle="Первая половина 2026 (ожидается)"
            :icon="'rocket_launch'"
            color="positive"
          >
            <div class="text-caption text-grey">
              Стабильный релиз Vue 3.6 с Vapor Mode на борту.
              Beta уже production-testable для non-Vapor фич.
              Сам Vapor Mode в beta — функционально готов, но API может
              незначительно измениться до stable.
            </div>
          </q-timeline-entry>
        </q-timeline>

        <div class="text-body2 text-grey-7 q-mt-md">
          <strong>Рекомендация:</strong> начинайте с Vapor Mode на отдельных
          performance-критичных компонентах (главная, лендинг, таблицы с частым
          обновлением). Не мигрируйте весь проект сразу — подождите stable-релиза.
          Следите за
          <a href="https://github.com/vuejs/core/issues/13687" target="_blank">
            дорожной картой (#13687)
          </a> и
          <a href="https://github.com/vuejs/rfcs/discussions/464" target="_blank">
            RFC #464
          </a>.
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';

// ============================================================
// ТИПЫ
// ============================================================

/** Элемент списка для бенчмарка */
interface BenchmarkItem {
  id: number;
  value: number;
  recentlyUpdated: boolean; // флаг для визуальной подсветки
}

/** Результат замера производительности */
interface BenchmarkResult {
  label: string;
  count: number;
  time: string;
  color: string;
  vdomExplain: string;
  vaporExplain: string;
}

// ============================================================
// СОСТОЯНИЕ
// ============================================================

// ref() — реактивные переменные.
// .value — чтение/запись в скрипте, в шаблоне автоматически без .value.
const items = ref<BenchmarkItem[]>([]);
const itemCount = ref(1000);
const isRunning = ref(false);
const results = ref<BenchmarkResult[]>([]);

// Сколько элементов показывать визуально.
// 10000 DOM-элементов тормозят рендер, поэтому ограничиваем.
const visibleCount = 80;

// computed() — первые N элементов для визуализации.
// Пересчитывается только при изменении items.
const visibleItems = computed(() => items.value.slice(0, visibleCount));

// Счётчик уникальных id. Не в ref — используется только внутри скрипта.
let nextId = 0;

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

/**
 * Замеряет время операции с учётом обновления DOM.
 *
 * Как работает:
 *   1. nextTick() — ждём завершения предыдущих обновлений DOM
 *   2. performance.now() — записываем стартовое время
 *   3. Вызываем updateFn() — функция меняет реактивные данные
 *   4. nextTick() — ждём, пока Vue обновит DOM
 *   5. performance.now() — записываем конечное время
 *
 * nextTick() критически важен — без него мы бы замеряли только
 * время создания VNode, а не время реального обновления DOM.
 * Vue обновляет DOM асинхронно, батчит изменения и применяет
 * их в следующем тике микроочереди.
 */
async function measure(label: string, updateFn: () => void): Promise<void> {
  isRunning.value = true;

  // Сбрасываем подсветку перед замером
  items.value.forEach((item) => (item.recentlyUpdated = false));

  // Ждём, пока все предыдущие обновления DOM завершатся
  await nextTick();

  const start = performance.now();
  updateFn();

  // Ждём, пока Vue обработает изменения и обновит DOM
  await nextTick();

  const end = performance.now();
  const time = +(end - start).toFixed(2);

  isRunning.value = false;
  return void results.value.push({
    label,
    count: items.value.length,
    time: String(time),
    color: 'primary',
    vdomExplain: '',
    vaporExplain: '',
  });
}

// ============================================================
// ОПЕРАЦИИ БЕНЧМАРКА
// ============================================================

/** Создаёт N элементов с случайными значениями */
async function generateItems() {
  results.value = [];
  isRunning.value = true;
  nextId = 0;

  await nextTick();
  const start = performance.now();

  items.value = Array.from({ length: itemCount.value }, () => ({
    id: nextId++,
    value: +(Math.random() * 100).toFixed(1),
    recentlyUpdated: true,
  }));

  await nextTick();
  const end = performance.now();

  isRunning.value = false;
  results.value.push({
    label: 'Создание',
    count: items.value.length,
    time: String(+(end - start).toFixed(2)),
    color: 'primary',
    vdomExplain:
      'Создаётся VNode-дерево для всех N элементов, затем diff с пустым деревом → N DOM-созданий.',
    vaporExplain:
      'Прямые вызовы createElement + setTextContent для каждого элемента. Нет VNode-объектов.',
  });
}

/** Обновляет значение ОДНОГО случайного элемента */
async function updateOne() {
  const index = Math.floor(Math.random() * items.value.length);

  await measure('Обновление 1 элемента', () => {
    items.value[index] = {
      ...items.value[index],
      value: +(Math.random() * 100).toFixed(1),
      recentlyUpdated: true,
    };
  });

  // Дописываем объяснения к последнему результату
  const last = results.value[results.value.length - 1];
  last.color = 'teal';
  last.vdomExplain =
    'Render-функция компонента выполняется полностью → создаёт VNodes для ВСЕХ N элементов → diff находит 1 изменение → 1 DOM-патч. VDOM-накладные расходы: O(N), хотя изменился 1 элемент.';
  last.vaporExplain =
    'Только 1 реактивный эффект срабатывает → 1 вызов setTextContent. Остальные N-1 элементов не затронуты. O(1).';
}

/** Обновляет значения ВСЕХ элементов */
async function updateAll() {
  await measure('Обновление всех элементов', () => {
    items.value = items.value.map((item) => ({
      ...item,
      value: +(Math.random() * 100).toFixed(1),
      recentlyUpdated: true,
    }));
  });

  const last = results.value[results.value.length - 1];
  last.color = 'orange';
  last.vdomExplain =
    'Render-функция создаёт N VNode-объектов → diff сравнивает N пар → N DOM-патчей. VDOM добавляет overhead на создание и сравнение объектов.';
  last.vaporExplain =
    'N реактивных эффектов срабатывают → N прямых setTextContent. Нет промежуточных VNode-объектов и diff. Меньше memory allocation.';
}

/** Перемешивает элементы (Fisher-Yates shuffle) */
async function shuffleItems() {
  await measure('Перемешивание', () => {
    // Fisher-Yates shuffle — мутирует массив на месте.
    // Vue отслеживает мутации reactive-массивов через Proxy.
    const arr = [...items.value];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    items.value = arr;
  });

  const last = results.value[results.value.length - 1];
  last.color = 'purple';
  last.vdomExplain =
    'Создаёт N VNode-объектов → diff с :key находит N перемещений → N DOM-операций перемещения. Diff с ключами эффективен, но VNode-создание — лишняя работа.';
  last.vaporExplain =
    'Каждый элемент уже привязан к своему DOM-узлу. Перемешивание данных обновляет только порядок отображения. В идеальном случае — меньше DOM-операций.';
}

/** Добавляет 100 элементов в конец списка */
async function appendItems() {
  await measure('Добавление 100 элементов', () => {
    const newItems: BenchmarkItem[] = [];
    for (let i = 0; i < 100; i++) {
      newItems.push({
        id: nextId++,
        value: +(Math.random() * 100).toFixed(1),
        recentlyUpdated: true,
      });
    }
    items.value = [...items.value, ...newItems];
  });

  const last = results.value[results.value.length - 1];
  last.color = 'teal';
  last.vdomExplain =
    'Создаёт VNodes для N+100 элементов → diff находит 100 новых в конце → 100 DOM-созданий. Но VNode-создание для N старых — лишняя работа.';
  last.vaporExplain =
    'Только 100 новых реактивных эффектов → 100 createElement. Существующие элементы не затронуты вообще.';
}
</script>

<style scoped>
/* transition-group для анимации перемещения элементов */
.list-move {
  transition: transform 0.3s ease;
}
</style>
