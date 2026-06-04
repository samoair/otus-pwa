// Auth Store — Pinia store для JWT авторизации (ДЗ 9).
//
// Демонстрирует:
// - JWT-токен в ref() — хранится в памяти + localStorage
// - jwtDecode — декодирование payload без проверки подписи
//   (проверка подписи делается на сервере, клиент только читает claims)
// - computed() — isAuthenticated, role, isTokenExpired
// - Actions — login/logout
// - Проверка expiration при каждой навигации (через router guard)
//
// Поток JWT авторизации:
// 1. Пользователь вводит логин/пароль → LoginPage
// 2. AuthService.login() → POST на сервер → JWT
// 3. AuthStore.login() → сохраняем token в state + localStorage
// 4. Router guard → проверяем isTokenExpired перед каждым переходом
// 5. Если exp < now → logout + redirect на /login

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { login as apiLogin } from 'src/services/auth/authService';
import type { JwtPayload } from 'src/services/auth/authModels';

const TOKEN_KEY = 'otus-pwa-jwt';

export const useAuthStore = defineStore('auth', () => {
  // ============================================================
  // State
  // ============================================================
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // ============================================================
  // Computed — декодируем JWT payload
  // ============================================================

  /** Декодированные claims из JWT */
  const claims = computed<JwtPayload | null>(() => {
    if (!token.value) return null;
    try {
      return jwtDecode<JwtPayload>(token.value);
    } catch {
      return null;
    }
  });

  /** Пользователь аутентифицирован — токен есть и не просрочен */
  const isAuthenticated = computed(() => {
    if (!token.value || !claims.value) return false;
    return claims.value.exp * 1000 > Date.now();
  });

  /** Логин пользователя из JWT */
  const username = computed(() => claims.value?.username ?? '');

  /** Роль пользователя из JWT */
  const role = computed(() => claims.value?.role ?? null);

  /** Токен просрочен? */
  const isTokenExpired = computed(() => {
    if (!claims.value) return true;
    return claims.value.exp * 1000 <= Date.now();
  });

  // ============================================================
  // Actions
  // ============================================================

  /** Восстановить токен из localStorage при старте */
  function restore() {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved) {
      token.value = saved;
      // Если восстановленный токен уже просрочен — удаляем
      if (isTokenExpired.value) {
        logout();
      }
    }
  }

  /** Логин — запрос к серверу, сохранение JWT */
  async function login(username: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiLogin({ username, password });
      token.value = response.accessToken;
      localStorage.setItem(TOKEN_KEY, response.accessToken);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка входа';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /** Логут — очистка токена */
  function logout() {
    token.value = null;
    localStorage.removeItem(TOKEN_KEY);
  }

  /** Очистка ошибки */
  function clearError() {
    error.value = null;
  }

  // Восстанавливаем при создании store
  restore();

  return {
    token,
    loading,
    error,
    claims,
    isAuthenticated,
    username,
    role,
    isTokenExpired,
    login,
    logout,
    clearError,
  };
});
