# otus-pwa
ДЗ для курса OTUS Vue.js

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

Каждая директива выделена в отдельный блок с объяснением на русском. Внизу страницы — справочная таблица и описание цикла VirtualDOM.

## Vapor Mode (живое сравнение)

Страница `/vapor` — реальный бенчмарк VDOM vs Vapor на **Vue 3.6.0-beta.12**:

- **BenchVdom.vue** — `<script setup>` — обычный режим (VNode + diff)
- **BenchVapor.vue** — `<script setup vapor>` — прямые DOM-операции
- Один и тот же composable `useBenchmark` — разница только в компиляции
- Таблица сравнения: создание, обновление 1, обновление всех, перемешивание
- Код компонентов показан рядом — разница в одном слове `vapor`

## Запуск

```bash
npm install
npm run dev        # дев-сервер с HMR
npm run build      # продакшн-сборка
```

## Стек

Vue 3.6.0-beta.12 · Quasar 2 · Vite · TypeScript · Pinia
