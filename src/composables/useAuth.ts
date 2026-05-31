// useAuth — composable для эмуляции аутентификации.
// ДЗ 5: navigation guard проверяет localStorage перед входом в /admin.
// В реальном приложении — JWT-токены, refresh, httpOnly cookies.
// Для ДЗ — просто флаг в localStorage.

import { computed } from 'vue';

const AUTH_KEY = 'otus-pwa-auth';

export function useAuth() {
  /** Залогинен ли пользователь — computed из localStorage */
  const isAuthenticated = computed(() =>
    localStorage.getItem(AUTH_KEY) === 'true',
  );

  /**
   * «Логин» — проверяет что поля не пустые и ставит флаг.
   * В реальном приложении — POST /api/login → токен.
   */
  function login(username: string, password: string): boolean {
    if (!username.trim() || !password.trim()) {
      return false;
    }
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }

  /** «Логаут» — убирает флаг */
  function logout() {
    localStorage.removeItem(AUTH_KEY);
  }

  return { isAuthenticated, login, logout };
}
