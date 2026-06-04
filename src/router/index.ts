import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/auth-store';

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
  // Navigation Guards — JWT авторизация (ДЗ 9).
  //
  // beforeEach — выполняется перед КАЖДЫМ переходом.
  // Порядок проверок:
  // 1. JWT просрочен? → logout + redirect на /login
  // 2. Маршрут требует auth? → проверяем isAuthenticated
  // 3. Маршрут требует admin? → проверяем role из JWT
  // 4. /login при авторизации? → redirect на /
  // 5. Всё ок → next()
  //
  // record.meta проверяется на всём пути (matched),
  // поэтому guard сработает и для дочерних /admin/* маршрутов.
  // ============================================================
  Router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore();

    // 1. JWT есть, но просрочен — разлогиниваем
    if (authStore.token && authStore.isTokenExpired) {
      authStore.logout();
      next({ name: 'login', query: { redirect: to.fullPath } });
      return;
    }

    // 2. Маршрут требует аутентификации (meta.requiresAuth)
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!authStore.isAuthenticated) {
        // Сохраняем целевую страницу — вернём после логина
        next({ name: 'login', query: { redirect: to.fullPath } });
        return;
      }
    }

    // 3. Маршрут требует роль admin (meta.requiresAdmin)
    if (to.matched.some((record) => record.meta.requiresAdmin)) {
      if (authStore.role !== 'admin') {
        // Не админ — на главную
        next({ name: 'home' });
        return;
      }
    }

    // 4. Страница логина, но пользователь уже аутентифицирован
    if (to.name === 'login' && authStore.isAuthenticated) {
      next({ name: 'home' });
      return;
    }

    // 5. Всё в порядке — продолжаем навигацию
    next();
  });

  return Router;
});
