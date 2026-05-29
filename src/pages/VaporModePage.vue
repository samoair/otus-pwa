<!--
  VaporModePage.vue — реальное сравнение VDOM vs Vapor Mode.

  Проект использует Vue 3.6.0-beta.12 с поддержкой Vapor Mode.
  На этой странице запускаются два одинаковых бенчмарка:
  - BenchVdom.vue — обычный <script setup> (Virtual DOM)
  - BenchVapor.vue — <script setup vapor> (прямые DOM-операции)

  Оба используют один и тот же composable (useBenchmark),
  разница — только в режиме компиляции шаблона.
-->
<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">Vapor Mode: живое сравнение</div>
    <p class="text-body2 text-grey-7">
      Vue 3.6.0-beta.12 установлен. BenchVapor использует
      <code>&lt;script setup vapor&gt;</code> — компилятор генерирует
      прямые DOM-операции вместо VNode-дерева. BenchVdom — обычный режим.
    </p>

    <!-- ==========================================================
         СЕКЦИЯ 1: Управление бенчмарком
         ========================================================== -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Параметры</div>

        <div class="row items-center q-gutter-md q-mb-md">
          <div class="text-body2">Элементов:</div>
          <q-slider
            v-model="itemCount"
            :min="100"
            :max="5000"
            :step="100"
            label
            label-always
            style="max-width: 300px"
            color="primary"
          />
          <span class="text-body2 text-weight-bold">{{ itemCount }}</span>

          <!--
            Запускаем оба бенчмарка одновременно.
            Каждый компонент сам замеряет время через performance.now() + nextTick().
          -->
          <q-btn
            color="primary"
            label="Запустить все тесты"
            @click="runAllBenchmarks"
            :loading="isRunning"
            :disable="isRunning"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- ==========================================================
         СЕКЦИЯ 2: Параллельное сравнение
         ========================================================== -->
    <div class="row q-col-gutter-md q-mb-md">
      <!-- VDOM -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="bg-orange-1">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-sm">
              Virtual DOM
              <q-badge color="orange" class="q-ml-sm">&lt;script setup&gt;</q-badge>
            </div>
            <div class="text-caption text-grey q-mb-sm">
              Render-функция → VNode-дерево → diff → DOM-патчи
            </div>
            <BenchVdom ref="vdomRef" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Vapor -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="bg-green-1">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-sm">
              Vapor Mode
              <q-badge color="positive" class="q-ml-sm">&lt;script setup vapor&gt;</q-badge>
            </div>
            <div class="text-caption text-grey q-mb-sm">
              Прямые DOM-операции, без VNode, без diff
            </div>
            <BenchVapor ref="vaporRef" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- ==========================================================
         СЕКЦИЯ 3: Результаты — таблица сравнения
         ========================================================== -->
    <q-card flat bordered class="q-mb-md" v-if="vdomResults.length > 0">
      <q-card-section>
        <div class="text-h6 q-mb-md">
          Результаты ({{ itemCount }} элементов)
        </div>

        <q-markup-table flat bordered dense>
          <thead>
            <tr>
              <th>Операция</th>
              <th class="text-right">VDOM (мс)</th>
              <th class="text-right">Vapor (мс)</th>
              <th class="text-right">Разница</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(vdom, i) in vdomResults" :key="i">
              <td>
                <q-badge color="grey-7">{{ vdom.label }}</q-badge>
              </td>
              <td class="text-right">{{ vdom.time }}</td>
              <td class="text-right">{{ vaporResults[i]?.time ?? '—' }}</td>
              <td class="text-right">
                <q-badge
                  v-if="vaporResults[i]"
                  :color="getDiffColor(vdom.time, vaporResults[i].time)"
                >
                  {{ getDiffLabel(vdom.time, vaporResults[i].time) }}
                </q-badge>
              </td>
            </tr>
          </tbody>
        </q-markup-table>

        <div class="text-caption text-grey q-mt-md">
          Замер через <code>performance.now()</code> + <code>nextTick()</code>
          — учитывается полное время от изменения данных до обновления DOM.
          Результаты зависят от устройства и нагрузки браузера.
          Запустите несколько раз для усреднения.
        </div>
      </q-card-section>
    </q-card>

    <!-- ==========================================================
         СЕКЦИЯ 4: Исходный код компонентов
         ========================================================== -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Разница в коде</div>
        <div class="text-body2 text-grey-7 q-mb-md">
          Оба компонента идентичны — один и тот же шаблон, один и тот же composable.
          Единственная разница — атрибут <code>vapor</code> на теге <code>&lt;script setup&gt;</code>.
          Компилятор Vue генерирует совершенно разный выходной код.
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 q-mb-sm">BenchVdom.vue</div>
            <q-card flat bordered class="bg-orange-1">
              <q-card-section v-pre class="text-body2" style="font-family: monospace; white-space: pre; font-size: 12px">
&lt;script setup lang="ts"&gt;
import { useBenchmark } from './useBenchmark'

const { items, generate, updateOne,
        updateAll, shuffle } = useBenchmark()

defineExpose({ items, generate, updateOne,
              updateAll, shuffle })
&lt;/script&gt;

&lt;template&gt;
  &lt;div class="bench-list"&gt;
    &lt;div v-for="item in items"
         :key="item.id"
         class="bench-item"&gt;
      {{ item.value }}
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-6">
            <div class="text-subtitle2 q-mb-sm">BenchVapor.vue</div>
            <q-card flat bordered class="bg-green-1">
              <q-card-section v-pre class="text-body2" style="font-family: monospace; white-space: pre; font-size: 12px">
<span class="text-weight-bold text-positive">&lt;script setup vapor lang="ts"&gt;</span>
import { useBenchmark } from './useBenchmark'

const { items, generate, updateOne,
        updateAll, shuffle } = useBenchmark()

defineExpose({ items, generate, updateOne,
              updateAll, shuffle })
&lt;/script&gt;

&lt;template&gt;
  &lt;div class="bench-list"&gt;
    &lt;div v-for="item in items"
         :key="item.id"
         class="bench-item"&gt;
      {{ item.value }}
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;
              </q-card-section>
            </q-card>
          </div>
        </div>

        <q-separator class="q-my-md" />

        <div class="text-body2 text-grey-7">
          <strong>Одно слово <code>vapor</code></strong> — и компилятор Vue генерирует
          совершенно другой код. При <code>&lt;script setup&gt;</code> шаблон компилируется
          в render-функцию, возвращающую VNode-дерево. При <code>&lt;script setup vapor&gt;</code> —
          в функции прямого DOM-обновления (createElement, setTextContent, insertBefore).
        </div>
      </q-card-section>
    </q-card>

    <!-- ==========================================================
         СЕКЦИЯ 5: Почему разница есть (или нет)
         ========================================================== -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Как интерпретировать результаты</div>

        <q-list dense>
          <q-item>
            <q-item-section avatar>
              <q-icon color="primary" name="looks_one" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Обновление 1 элемента — где Vapor побеждает</q-item-label>
              <q-item-label caption>
                VDOM: render-функция выполняется для ВСЕГО компонента → создаёт VNodes
                для всех N элементов → diff находит 1 изменение → 1 патч.
                Vapor: срабатывает только 1 реактивный эффект → 1 setTextContent.
                Разница растёт с N — VDOM делает O(N) работы для 1 изменения.
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="primary" name="looks_two" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Обновление всех — разница меньше</q-item-label>
              <q-item-label caption>
                Оба режима обновляют N элементов. Vapor быстрее за счёт отсутствия
                VNode-создания и diff, но выигрыш не такой dramatic — работа
                с DOM в обоих случаях O(N).
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="warning" name="speed" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Почему результаты могут быть похожи</q-item-label>
              <q-item-label caption>
                На 100–500 элементов разница может быть в пределах погрешности
                (менее 1 мс). Увеличьте количество до 3000–5000 чтобы увидеть
                стабильную разницу. Также влияет: теплый кэш браузера,
                другие вкладки, энергосбережение.
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="negative" name="science" />
            </q-item-section>
            <q-item-section>
              <q-item-label>VDOM может быть быстрее на бенчмарках — это нормально для beta</q-item-label>
              <q-item-label caption>
                На реальных замерах (1000 элементов) VDOM часто быстрее при
                <strong>создании</strong> и <strong>массовом обновлении</strong>.
                Причина: Vapor Mode (3.6 beta) пока не оптимизирован для
                начального рендеринга — создание DOM-узлов через
                <code>createElement</code> + <code>setTextContent</code>
                может быть медленнее batch-VNode→DOM в VDOM-режиме,
                где Vue использует <code>innerHTML</code> и фрагменты.
                Зато Vapor показывает <strong>сопоставимые или лучшие</strong>
                результаты при точечных обновлениях (updateOne) —
                именно для этого он и спроектирован.
                Stable-релиз оптимизирует и создание тоже.
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="info" name="bug_report" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Известные проблемы Vue 3.6 beta</q-item-label>
              <q-item-label caption>
                В dev-режиме Vapor renderEffect вызывает
                <code>performance.measure()</code> с mark'ами,
                которые не всегда существуют — приводило к SyntaxError
                и падению рендера. В этом проекте исправлено через
                <code>vaporInteropPlugin</code> (boot/vapor-interop.ts)
                и патч <code>performance.measure</code>.
                Это демонстрирует, что beta-ПО требует
                дополнительных усилий по интеграции.
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- ==========================================================
         СЕКЦИЯ 6: Хронология и статус
         ========================================================== -->
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6 q-mb-md">Хронология Vapor Mode</div>

        <q-timeline dense color="primary">
          <q-timeline-entry title="Vapor Mode анонсирован" subtitle="2023" :icon="'campaign'" />
          <q-timeline-entry
            title="vue-vapor влит в vuejs/core"
            subtitle="Июль 2025"
            :icon="'merge_type'"
          >
            <div class="text-caption text-grey">
              <code>vuejs/vue-vapor</code> архивирован, разработка в ветке <code>vapor</code>
              репозитория <code>vuejs/core</code>.
            </div>
          </q-timeline-entry>
          <q-timeline-entry
            title="Vue 3.6 beta — Vapor feature-complete"
            subtitle="Декабрь 2025"
            :icon="'science'"
          >
            <div class="text-caption text-grey">
              Vue 3.6 beta выпущен. Vapor Mode функционально завершён.
            </div>
          </q-timeline-entry>
          <q-timeline-entry
            title="Vue 3.6 stable"
            subtitle="Первая половина 2026 (ожидается)"
            :icon="'rocket_launch'"
            color="positive"
          >
            <div class="text-caption text-grey">
              Стабильный релиз. Этот проект уже использует <code>3.6.0-beta.12</code>
              с реальным Vapor Mode.
            </div>
          </q-timeline-entry>
        </q-timeline>

        <div class="text-body2 text-grey-7 q-mt-md">
          <strong>Рекомендация:</strong> используйте Vapor Mode на performance-критичных
          компонентах. Не мигрируйте весь проект до stable.
          Дорожная карта:
          <a href="https://github.com/vuejs/core/issues/13687" target="_blank">#13687</a>,
          RFC:
          <a href="https://github.com/vuejs/rfcs/discussions/464" target="_blank">#464</a>.
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BenchVdom from 'components/bench/BenchVdom.vue';
import BenchVapor from 'components/bench/BenchVapor.vue';
import type { BenchResult } from 'components/bench/useBenchmark';

// ============================================================
// ССЫЛКИ НА КОМПОНЕНТЫ-БЕНЧМАРКИ
// ============================================================
const vdomRef = ref<InstanceType<typeof BenchVdom> | null>(null);
const vaporRef = ref<InstanceType<typeof BenchVapor> | null>(null);

const itemCount = ref(1000);
const isRunning = ref(false);
const vdomResults = ref<BenchResult[]>([]);
const vaporResults = ref<BenchResult[]>([]);

// ============================================================
// ЗАПУСК ВСЕХ ТЕСТОВ
// Запускаем VDOM и Vapor последовательно, чтобы они
// не влияли друг на друга при замерах.
// ============================================================
async function runAllBenchmarks() {
  isRunning.value = true;
  vdomResults.value = [];
  vaporResults.value = [];

  const count = itemCount.value;
  const vdom = vdomRef.value;
  const vapor = vaporRef.value;

  if (!vdom || !vapor) {
    isRunning.value = false;
    return;
  }

  // Даём браузеру время «успокоиться» перед замерами
  await new Promise((r) => setTimeout(r, 100));

  // 1. Создание
  vdomResults.value.push(await vdom.generate(count));
  vaporResults.value.push(await vapor.generate(count));

  // Небольшая пауза между тестами
  await new Promise((r) => setTimeout(r, 50));

  // 2. Обновление одного элемента
  vdomResults.value.push(await vdom.updateOne());
  vaporResults.value.push(await vapor.updateOne());

  await new Promise((r) => setTimeout(r, 50));

  // 3. Обновление всех элементов
  vdomResults.value.push(await vdom.updateAll());
  vaporResults.value.push(await vapor.updateAll());

  await new Promise((r) => setTimeout(r, 50));

  // 4. Перемешивание
  vdomResults.value.push(await vdom.shuffle());
  vaporResults.value.push(await vapor.shuffle());

  isRunning.value = false;
}

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ ТАБЛИЦЫ
// ============================================================
function getDiffColor(vdomTime: string, vaporTime: string): string {
  const diff = parseFloat(vdomTime) - parseFloat(vaporTime);
  if (diff > 1) return 'positive'; // Vapor быстрее
  if (diff < -1) return 'negative'; // VDOM быстрее
  return 'grey'; // примерно одинаково
}

function getDiffLabel(vdomTime: string, vaporTime: string): string {
  const diff = parseFloat(vdomTime) - parseFloat(vaporTime);
  const pct = parseFloat(vdomTime) > 0 ? ((diff / parseFloat(vdomTime)) * 100).toFixed(0) : '0';
  if (diff > 1) return `Vapor быстрее на ${pct}%`;
  if (diff < -1) return `VDOM быстрее на ${Math.abs(+pct)}%`;
  return '≈ одинаково';
}
</script>
