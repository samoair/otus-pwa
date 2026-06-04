<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Меню" @click="toggleLeftDrawer" />
        <q-toolbar-title> OTUS PWA </q-toolbar-title>

        <!-- ДЗ 9: данные из JWT — auth store -->
        <template v-if="authStore.isAuthenticated">
          <q-btn flat dense :to="{ name: 'profile' }">
            <q-chip
              :icon="authStore.role === 'admin' ? 'admin_panel_settings' : 'person'"
              :color="authStore.role === 'admin' ? 'orange-2' : 'blue-2'"
              :text-color="authStore.role === 'admin' ? 'orange-10' : 'blue-10'"
              dense
            >
              {{ authStore.username }}
              <q-badge floating color="grey-7" transparent>{{ authStore.role }}</q-badge>
            </q-chip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            icon="logout"
            color="grey-7"
            @click="handleLogout"
          >
            <q-tooltip>Выйти</q-tooltip>
          </q-btn>
        </template>
        <template v-else>
          <q-btn flat dense label="Войти" icon="login" :to="{ name: 'login' }" />
        </template>

        <q-badge color="white" text-color="primary" class="text-body2 q-ml-sm"> v{{ version }} </q-badge>
      </q-toolbar>
    </q-header>

    <!--
      q-drawer — боковая панель навигации.
      v-model управляет видимостью через ref().
      show-if-above — показывать на широких экранах (десктоп) автоматически.
    -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header class="text-weight-bold text-grey-8"> Навигация </q-item-label>

        <!--
          v-for пробегает по массиву navLinks.
          :to используется вместо @click + $router.push —
          это декларативный способ навигации через vue-router.
          v-ripple — материальный эффект нажатия (Quasar директива).
        -->
        <q-item v-for="link in navLinks" :key="link.to" :to="link.to" clickable v-ripple>
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ link.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
  $q.notify({ type: 'info', message: 'Вы вышли из системы' });
  router.push({ name: 'login' });
}

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

// Навигация — показываем ссылки в зависимости от роли
const navLinks = computed(() => {
  const links = [
    { to: '/', label: 'Главная', icon: 'home' },
    { to: '/products', label: 'Каталог', icon: 'storefront' },
    { to: '/cart', label: 'Корзина', icon: 'shopping_cart' },
    { to: '/order', label: 'Заказ', icon: 'shopping_bag' },
    { to: '/users', label: 'Пользователи', icon: 'people' },
    { to: '/graphql', label: 'GraphQL', icon: 'api' },
    { to: '/about', label: 'О проекте', icon: 'info' },
    { to: '/vapor', label: 'Vapor Mode', icon: 'speed' },
  ];

  // Авторизованные — профиль
  if (authStore.isAuthenticated) {
    links.push({ to: '/profile', label: 'Профиль', icon: 'account_circle' });
    links.push({ to: '/admin', label: 'Админ', icon: 'admin_panel_settings' });
  } else {
    links.push({ to: '/login', label: 'Войти', icon: 'login' });
  }

  return links;
});

const version = process.env.APP_VERSION;
</script>
