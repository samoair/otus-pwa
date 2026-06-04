// ============================================================
// routes.ts — маршруты приложения (ДЗ 5: Vue Router).
//
// Демонстрирует:
// - router params — :id для страницы товара
// - children routes — admin с дочерними маршрутами
// - navigation guards — beforeEach для проверки auth
// - lazy loading — () => import() для code splitting
// - meta — информация для guards и компонентов
// ============================================================

import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('pages/AboutPage.vue'),
      },
      {
        path: 'vapor',
        name: 'vapor',
        component: () => import('pages/VaporModePage.vue'),
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('pages/UsersPage.vue'),
      },
      // ============================================================
      // Каталог товаров
      // ============================================================
      {
        path: 'products',
        name: 'products',
        component: () => import('pages/ProductsPage.vue'),
      },
      // ============================================================
      // Страница товара — router params
      // :id — динамический параметр, доступен как route.params.id
      // Например: /products/1, /products/42
      // ============================================================
      {
        path: 'products/:id',
        name: 'product-detail',
        component: () => import('pages/ProductDetailPage.vue'),
        props: true,
      },
      // ============================================================
      // Корзина
      // ============================================================
      {
        path: 'cart',
        name: 'cart',
        component: () => import('pages/CartPage.vue'),
      },
      // ============================================================
      // Оформление заказа
      // ============================================================
      {
        path: 'order',
        name: 'order',
        component: () => import('pages/OrderPage.vue'),
      },
      // ============================================================
      // Логин — доступен всем
      // ============================================================
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
      },
      // ============================================================
      // GraphQL + WebSocket — ДЗ 8
      // ============================================================
      {
        path: 'graphql',
        name: 'graphql',
        component: () => import('pages/GraphqlPage.vue'),
      },
      // ============================================================
      // Админ-раздел — children routes + navigation guard
      //
      // children routes: AdminLayout содержит <router-view>,
      // в который рендерятся дочерние маршруты.
      //
      // meta.requiresAuth: флаг для navigation guard (см. ниже).
      // Guard проверяет localStorage перед входом — если флага
      // аутентификации нет, перенаправляет на /login.
      // ============================================================
      {
        path: 'admin',
        component: () => import('layouts/AdminLayout.vue'),
        meta: { requiresAuth: true },
        children: [
          {
            path: '',
            name: 'admin',
            component: () => import('pages/admin/AdminDashboardPage.vue'),
          },
          {
            path: 'new',
            name: 'admin-new',
            component: () => import('pages/admin/AdminNewProductPage.vue'),
          },
        ],
      },
    ],
  },
  // 404 — catch-all
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
