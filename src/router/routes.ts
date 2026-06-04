// ============================================================
// routes.ts — маршруты приложения (ДЗ 5 + ДЗ 9: JWT guards).
//
// ДЗ 9 добавляет:
// - meta.requiresAuth — проверка JWT в navigation guard
// - meta.requiresAdmin — проверка role === 'admin' из JWT
// - /profile — страница профиля (только авторизованные)
// - /admin/roles — страница только для админов
// ============================================================

import type { RouteRecordRaw } from 'vue-router';

// Расширяем тип meta для TypeScript
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresAdmin?: boolean;
  }
}

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
      // Каталог товаров
      {
        path: 'products',
        name: 'products',
        component: () => import('pages/ProductsPage.vue'),
      },
      // Страница товара — :id param
      {
        path: 'products/:id',
        name: 'product-detail',
        component: () => import('pages/ProductDetailPage.vue'),
        props: true,
      },
      // Корзина
      {
        path: 'cart',
        name: 'cart',
        component: () => import('pages/CartPage.vue'),
      },
      // Оформление заказа
      {
        path: 'order',
        name: 'order',
        component: () => import('pages/OrderPage.vue'),
      },
      // ============================================================
      // Логин — ДЗ 9: доступен только НЕ аутентифицированным.
      // Если JWT есть → guard перенаправит на главную.
      // ============================================================
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
      },
      // GraphQL + WebSocket
      {
        path: 'graphql',
        name: 'graphql',
        component: () => import('pages/GraphqlPage.vue'),
      },
      // ============================================================
      // Профиль — ДЗ 9: только аутентифицированные.
      // Guard проверяет JWT → если нет/просрочен → /login
      // ============================================================
      {
        path: 'profile',
        name: 'profile',
        component: () => import('pages/ProfilePage.vue'),
        meta: { requiresAuth: true },
      },
      // ============================================================
      // Админ-раздел — meta.requiresAuth + meta.requiresAdmin
      //
      // requiresAuth: проверяет наличие валидного JWT
      // requiresAdmin: проверяет role === 'admin' из JWT claims
      // Guard в router/index.ts обрабатывает оба флага.
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
          // ============================================================
          // Управление ролями — ДЗ 9: только admin
          // meta.requiresAdmin проверяется в router guard
          // ============================================================
          {
            path: 'roles',
            name: 'admin-roles',
            component: () => import('pages/admin/AdminRolesPage.vue'),
            meta: { requiresAdmin: true },
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
