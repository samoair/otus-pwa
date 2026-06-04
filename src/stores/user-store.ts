// User Store — Pinia store для данных покупателя (ДЗ 6).
//
// Демонстрирует:
// - ref() — реактивные данные пользователя
// - computed() — isAuthenticated, fullName
// - actions — login/logout/updateProfile
// - localStorage — персистентность между сессиями
//
// В реальном приложении:
// - JWT-токены вместо localStorage флага
// - Refresh token rotation
// - API endpoint для профиля
// Здесь — упрощённая эмуляция для демонстрации Pinia.

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface UserAddress {
  city: string;
  street: string;
  house: string;
  apartment?: string;
}

export interface UserData {
  name: string;
  email: string;
  phone: string;
  address: UserAddress;
}

const USER_STORAGE_KEY = 'otus-pwa-user';

export const useUserStore = defineStore('user', () => {
  // ============================================================
  // ref() — реактивное состояние
  // ============================================================
  const user = ref<UserData | null>(null);

  // ============================================================
  // computed() — производные данные
  // ============================================================
  const isAuthenticated = computed(() => user.value !== null);

  const fullName = computed(() => user.value?.name ?? '');

  // ============================================================
  // Restore — восстановление из localStorage при инициализации.
  // Вызывается один раз при создании store.
  // ============================================================
  function restore() {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) {
      try {
        user.value = JSON.parse(saved) as UserData;
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
  }

  // ============================================================
  // Actions — методы для изменения состояния
  // ============================================================

  /**
   * login — «вход» пользователя.
   * Сохраняет данные в state и localStorage.
   * В реальном приложении — POST /api/login → JWT.
   */
  function login(data: UserData) {
    user.value = data;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem('otus-pwa-auth', 'true');
  }

  /** logout — очистка state и localStorage */
  function logout() {
    user.value = null;
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem('otus-pwa-auth');
  }

  /** updateProfile — обновление данных пользователя */
  function updateProfile(data: Partial<UserData>) {
    if (!user.value) return;
    user.value = { ...user.value, ...data };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user.value));
  }

  // Восстанавливаем при создании store
  restore();

  return {
    user,
    isAuthenticated,
    fullName,
    login,
    logout,
    updateProfile,
  };
});
