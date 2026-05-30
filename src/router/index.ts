import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';

export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // ============================================================
  // Navigation guard (ДЗ 5) — beforeEach hook.
  //
  // Проверяет meta.requiresAuth на целевом маршруте.
  // Если флаг установлен — проверяем localStorage.
  // Если пользователь не авторизован → redirect на /login.
  //
  // record.meta проверяется на всём пути (включая parents),
  // поэтому guard сработает и для дочерних маршрутов /admin/*.
  // ============================================================
  Router.beforeEach((to, _from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      const isAuthenticated = localStorage.getItem('otus-pwa-auth') === 'true';
      if (!isAuthenticated) {
        // redirect с query-параметром — после логина вернём обратно
        next({ name: 'login', query: { redirect: to.fullPath } });
      } else {
        next();
      }
    } else {
      next();
    }
  });

  return Router;
});
