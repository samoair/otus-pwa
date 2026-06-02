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

## ДЗ 3: Главная страница магазина

Страница `/products` — каталог товаров с fakestoreapi.com, демонстрирующий Composition API и composables:

- **useProducts** — composable (custom hook): `ref()` (products, loading, error), `reactive()` (фильтры), `computed()` (filteredProducts, categories, totalPrice), `onMounted()` (загрузка), `onUnmounted()` (cleanup)
- **ProductCard** — дочерний компонент: `defineProps`, `defineEmits`, `v-bind` (динамический стиль цены, класс категории), `v-show` (описание), `v-html` (HTML-описание товара)
- **ProductsPage** — `v-if` для состояний загрузка/ошибка/пусто, `v-for` список, `v-show` корзина, «props down, events up»
- **ProductService** — класс-сервис с fetch (по паттерну pms-pwa)

## ДЗ 4: Формы и работа с API

Страница `/order` — оформление заказа с валидацией, страница `/products` — расширенный поиск и создание товара:

- **OrderForm** — пошаговая форма (Stepper): ФИО, email, телефон, дата рождения, адрес (страна/город/улица/дом), данные карты. Валидация через **vee-validate + zod**, отправка на echo-сервер **httpbin.org/post**, уведомление и редирект на главную
- **ProductFormDialog** — диалог создания нового товара (POST на fakestoreapi), валидация через vee-validate + zod
- **ProductSearch** — расширенные фильтры: поиск по названию, диапазон цен, категория, сортировка
- **OrderService** — класс-сервис для POST-запросов к httpbin.org
- **ProductService.create()** — POST нового товара к fakestoreapi

## ДЗ 5: Vue Router

Роутинг, параметры, guards, children routes, общая корзина:

- **router params** — `/products/:id`, `useRoute().params.id`, загрузка товара из API
- **children routes** — `/admin` → `AdminLayout` с `<router-view>` → дочерние `/admin` и `/admin/new`
- **navigation guard** — `beforeEach` проверяет `localStorage` перед входом в `/admin`, неавторизованных перенаправляет на `/login`
- **LoginPage** — логин/пароль, валидация, установка флага auth, redirect обратно
- **CartStore** (Pinia) — общая корзина: addToCart с quantity, removeFromCart, clearCart, totalItems/totalPrice
- **CartPage** `/cart` — список с +/- quantity, удаление, очистка, ссылка на чекаут
- **ProductDetailPage** `/products/:id` — полная информация о товаре, хлебные крошки, добавить в корзину

## ДЗ 6: Pinia — стейт-менеджмент

Глобальное состояние через Pinia stores вместо локальных composables:

- **UserStore** (`stores/user-store.ts`) — данные покупателя: `ref()` (user), `computed()` (isAuthenticated, fullName), `actions` (login/logout/updateProfile), `localStorage`-персистентность. Header показывает chip с именем и кнопку logout
- **ProductsStore** (`stores/products-store.ts`) — каталог: `ref()` (products, loading, error), `reactive()` (фильтры), `computed()` (filteredProducts, categories, totalPrice), `actions` (fetchProducts, resetFilters, addProduct). Логика перенесена из composable
- **CartStore** (`stores/cart-store.ts`) — корзина (создана в ДЗ 5, подтверждена в ДЗ 6)
- **useProducts** (`composables/useProducts.ts`) — thin wrapper над ProductsStore для обратной совместимости, компоненты не переписывались
- **OrderForm** — предзаполнение ФИО/email/телефона/адреса из UserStore при авторизации
- **LoginPage** — собирает данные покупателя (ФИО, email, телефон), сохраняет в UserStore + localStorage

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
