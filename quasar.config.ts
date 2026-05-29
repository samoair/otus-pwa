/*
 * quasar.config.ts — главный конфигурационный файл проекта Quasar + Vite
 *
 * В проекте на Quasar этот файл ЗАМЕНЯЕТ vite.config.js.
 * Quasar генерирует итоговый vite.config «под капотом» на основе настроек ниже.
 * Для прямого доступа к конфигу Vite используется build.extendViteConf.
 *
 * Документация: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js
 */

import { configure } from 'quasar/wrappers';

export default configure((/* ctx */) => {
  return {
    // ============================================================
    // BOOT FILES — файлы начальной загрузки (аналог плагинов Vue 2)
    // Выполняются до монтирования приложения, в порядке массива.
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    // ============================================================
    boot: ['pinia', 'vapor-interop'],

    // ============================================================
    // CSS — глобальные стили, подключаемые к сборке
    // ============================================================
    css: ['app.scss'],

    // ============================================================
    // EXTRAS — сторонние библиотеки (шрифты, иконки)
    // Подключаются через CDN или бандлятся локально
    // https://github.com/quasarframework/quasar/tree/dev/extras
    // ============================================================
    extras: [
      'roboto-font',
      'material-icons',
    ],

    // ============================================================
    // BUILD — настройки сборки (маппятся на Vite / Rollup конфиг)
    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    // ============================================================
    build: {
      // Целевые платформы браузеров и Node для транспиляции
      // Vite использует esbuild для быстрой трансформации
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node16',
      },

      // Режим маршрутизации: 'hash' (#/path) или 'history' (/path)
      // hash — работает без настройки сервера, history — нужен fallback на сервере
      vueRouterMode: 'hash',

      // Базовый путь для статических файлов (аналог base в vite.config)
      // publicPath: '/',

      // Папка с результатами сборки
      distDir: 'dist',

      // ============================================================
      // ПРОСТЫЕ ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ (определяются на этапе сборки)
      // Аналог define в vite.config, но с автоматическим префиксом
      // process.env.<KEY> — доступно в коде приложения
      // ============================================================
      env: {
        APP_VERSION: '0.0.1',
      },

      // ============================================================
      // ПРЯМОЕ РАСШИРЕНИЕ VITE КОНФИГА
      // Здесь можно добавить любые настройки из vite.config.js
      // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
      // ============================================================
      extendViteConf(viteConf) {
        // Отключаем Vue perf-метрики — в Vapor Mode (beta)
        // performance.measure() падает на несуществующих mark'ах.
        // В продакшн-сборке __VUE_PERF__ уже false.
        viteConf.define = {
          ...viteConf.define,
          __VUE_PERF__: false,
        };
      },

      // ============================================================
      // VITE ПЛАГИНЫ — подключаются к Vite напрямую
      // vite-plugin-checker — TypeScript проверка типов в фоне
      // ============================================================
      vitePlugins: [
        [
          'vite-plugin-checker',
          {
            vueTsc: {
              tsconfigPath: 'tsconfig.vue-tsc.json',
            },
          },
          { server: false },
        ],
      ],

      // Отключить минификацию для отладки (по умолчанию true)
      // minify: false,
    },

    // ============================================================
    // DEV SERVER — настройки dev-сервера Vite
    // Vite использует нативные ES-модули — мгновенный старт без бандлинга
    // HMR (Hot Module Replacement) — обновление модулей без перезагрузки
    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devserver
    // ============================================================
    devServer: {
      open: true,
    },

    // ============================================================
    // FRAMEWORK — настройка Quasar Framework
    // Автоимпорт компонентов, плагины, языковые пакеты
    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    // ============================================================
    framework: {
      // Глобальная конфигурация Quasar (доступна через $q в компонентах)
      config: {
        loading: { delay: 400 },
        notify: { timeout: 5000 },
      },

      // Языковой пакет (влияет на встроенные компоненты Quasar)
      lang: 'en-US',

      // Quasar плагины — расширяют функциональность $q
      plugins: ['Notify', 'Loading'],

      // Стратегия автоимпорта компонентов:
      // 'kebab' → <q-btn>, 'pascal' → <QBtn>, 'combined' → оба варианта
      // autoImportComponentCase: 'kebab',
    },

    // Анимации — подключение CSS-анимаций из Quasar
    // 'all' — все анимации, или массив конкретных
    animations: [],
  };
});
