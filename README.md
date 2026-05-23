# otus-pwa
ДЗ №2 для курса OTUS Vue.js.

## ДЗ 1: Настройка проекта с Vite

Quasar-приложение на Vite с TypeScript. В `quasar.config.ts` каждая настройка прокомментирована — что она делает и как соотносится с обычным `vite.config`.

- **quasar.config.ts** — каждая настройка с комментарием на русском.
- **src/components/CounterComponent.vue** — `ref()` и `computed()` на локальном счётчике.
- **src/components/TaskList.vue** — реактивные массивы, фильтрация через `computed()`.
- **src/stores/counter-store.ts** — Pinia-стор в setup-стиле.
- **src/pages/AboutPage.vue** — преимущества Vite, конфиг приложения.

## ДЗ 2: Директивы Vue

Страница `/users` — список сотрудников, демонстрирующий все основные директивы:

- **v-for** — карточки пользователей
- **v-if / v-else-if / v-else** — возраст, категория по возрасту
- **v-show** — email (для сравнения с v-if)
- **v-bind** (`:class`, `:style`, `:color`) — подсветка при наведении, статус, аватар
- **v-on** (`@click`, `@mouseenter`, `@mouseleave`, `@keyup.enter`) — скрытие списка, hover, поиск
- **v-html** — биография сотрудника с разметкой

Каждая директива выделена в отдельный блок с объяснением на русском. Внизу страницы — справочная таблица по всем директивам и описание цикла VirtualDOM.

## Vapor Mode

Страница `/vapor` — интерактивный бенчмарк:

- Теория: VDOM vs Vapor Mode (пошаговое сравнение)
- Синтаксис: `<script setup vapor>` — пример включения
- Метрики из RFC: -65% бандл, ×1.66 скорость, -42% память
- Интерактивный замер: 100–10000 элементов, 4 операции с таймингом
- Ограничения: нет Options API, нет `<Transition>`, interop с UI-библиотеками
- Хронология: анонс 2023 → merge в core июль 2025 → beta декабрь 2025 → stable 2026

Компоненты написаны в стиле, совместимом с Vapor Mode (только Composition API).

## Запуск

```bash
npm install
npm run dev        # дев-сервер с HMR
npm run build      # продакшн-сборка
```

## Стек

Vue 3 · Quasar 2 · Vite · TypeScript · Pinia
