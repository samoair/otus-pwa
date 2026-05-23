# otus-pwa

ДЗ №1 для курса OTUS PWA. Разворачиваем проект с нуля через Vite.

## Что внутри

Quasar-приложение на Vite с TypeScript. Без лишних наворотов — ровно столько, чтобы показать, что я разбираюсь в настройках сборки и умею пользоваться Composition API, а не прятаться за Options API.

В `quasar.config.ts` каждая настройка прокомментирована — что она делает и как соотносится с обычным `vite.config`. Это основная часть домашки.

## Запуск

```bash
npm install
npm run dev        # дев-сервер с HMR
npm run build      # продакшн-сборка
```

## Где смотреть

- **quasar.config.ts** — каждая настройка с комментарием на русском. Здесь живёт Vite внутри Quasar-проекта.
- **src/components/CounterComponent.vue** — `ref()` и `computed()` на локальном счётчике, подробно закомментировано.
- **src/components/TaskList.vue** — реактивные массивы, фильтрация через `computed()`, v-for с :key.
- **src/stores/counter-store.ts** — Pinia-стор в setup-стиле (не options). Под капотом `ref` и `computed`.
- **src/pages/AboutPage.vue** — преимущества Vite, структура конфига, Composition API.
- **src/pages/VaporModePage.vue** — интерактивный бенчмарк производительности. Сравнение VDOM vs Vapor Mode с замерами времени, официальными метриками из RFC Vue (-65% бандл, ×1.66 скорость, -42% память), примерами синтаксиса `<script setup vapor>` и ограничениями.

## Стек

Vue 3 · Quasar 2 · Vite · TypeScript · Pinia
