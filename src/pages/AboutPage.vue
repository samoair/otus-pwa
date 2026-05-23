<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">О проекте</div>

    <!-- ==========================================================
         Карточка 1: Преимущества Vite
         ========================================================== -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Преимущества Vite</div>
        <div class="text-body2 text-grey-7 q-mb-sm">
          Vite («быстрый» с фр.) — инструмент сборки нового поколения.
          Решает главную проблему webpack — медленный старт дев-сервера.
        </div>
        <q-list dense>
          <q-item v-for="advantage in viteAdvantages" :key="advantage.title">
            <q-item-section avatar>
              <q-icon color="primary" :name="advantage.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ advantage.title }}</q-item-label>
              <q-item-label caption>{{ advantage.desc }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- ==========================================================
         Карточка 2: Конфигурация приложения
         ========================================================== -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Конфигурация приложения</div>
        <p class="text-body2 text-grey-7">
          В проекте на Quasar + Vite главный конфиг —
          <code>quasar.config.ts</code>. Он заменяет <code>vite.config.js</code>:
          Quasar генерирует итоговый Vite-конфиг «под капотом»
          на основе настроек в этом файле. Для прямого доступа к Vite-конфигу
          используется <code>build.extendViteConf</code>.
        </p>
        <q-list dense>
          <q-item v-for="item in configItems" :key="item.title">
            <q-item-section>
              <q-item-label>{{ item.title }}</q-item-label>
              <q-item-label caption>{{ item.desc }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- ==========================================================
         Карточка 3: Composition API
         ========================================================== -->
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">Composition API: ref() и setup()</div>
        <p class="text-body2 text-grey-7">
          В этом проекте используется Vue 3 Composition API:
        </p>
        <ul>
          <li>
            <strong>ref()</strong> — оборачивает значение в реактивную обёртку.
            Любое изменение <code>.value</code> запускает перерисовку
            зависимых участков шаблона.
          </li>
          <li>
            <strong>computed()</strong> — производное значение с кешированием.
            Пересчитывается только когда меняется зависимый ref().
          </li>
          <li>
            <strong>&lt;script setup&gt;</strong> — compile-time сахар для setup().
            Компилятор автоматически определяет, какие переменные нужны шаблону,
            и добавляет их в return. Писать return вручную не нужно.
          </li>
        </ul>
        <p class="text-body2 text-grey-7">
          Установите расширение <strong>Vue DevTools</strong> для браузера —
          оно позволяет в реальном времениinspect'ить состояние компонентов,
          Pinia stores, маршруты и timeline событий.
        </p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
// Статические данные — не обёрнуты в ref() или reactive().
// Это обычные константы, которые никогда не меняются.
// Vue не тратит ресурсы на отслеживание их изменений.

const viteAdvantages = [
  {
    icon: 'flash_on',
    title: 'Мгновенный старт дев-сервера',
    desc: 'Vite не бандлит приложение при старте — он отдаёт файлы как ES-модули. Сервер запускается за миллисекунды, независимо от размера проекта.',
  },
  {
    icon: 'autorenew',
    title: 'Молниеносный HMR',
    desc: 'Hot Module Replacement обновляет только изменённый модуль, не перезагружая страницу. Состояние приложения сохраняется.',
  },
  {
    icon: 'build',
    title: 'Оптимизированная сборка (Rollup)',
    desc: 'Продакшн-сборка использует Rollup: tree-shaking, lazy-loading, разделение на чанки.',
  },
  {
    icon: 'code',
    title: 'TypeScript из коробки',
    desc: 'Vite обрабатывает .ts файлы через esbuild — быстрый компилятор на Go. Дополнительная настройка не нужна.',
  },
  {
    icon: 'extension',
    title: 'Плагины',
    desc: 'Совместим с плагинами Rollup и имеет собственную растущую экосистему Vite-плагинов.',
  },
];

const configItems = [
  {
    title: 'build.target',
    desc: 'Целевые версии браузеров и Node.js для транспиляции (через esbuild)',
  },
  {
    title: 'build.vueRouterMode',
    desc: 'Режим маршрутизации: hash (#/путь) или history (/путь)',
  },
  {
    title: 'build.extendViteConf',
    desc: 'Прямой доступ к Vite-конфигу — алиасы, плагины, настройки сервера',
  },
  {
    title: 'build.env',
    desc: 'Переменные окружения времени сборки, доступны через process.env',
  },
  {
    title: 'framework.plugins',
    desc: 'Quasar-плагины (Notify, Loading) — расширяют API объекта $q',
  },
  {
    title: 'framework.config',
    desc: 'Глобальные настройки Quasar — таймауты Notify, задержки Loading и т.д.',
  },
];
</script>
