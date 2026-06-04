<!--
  AdminDashboardPage.vue — главная страница админки (ДЗ 5 + ДЗ 9).

  ДЗ 9: использует JWT auth-store вместо localStorage composable.
  Navigation guard проверяет JWT перед входом на эту страницу.
-->
<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Панель администратора</div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-3">
        <q-card flat bordered class="text-center">
          <q-card-section>
            <q-icon name="inventory_2" size="48px" color="primary" />
            <div class="text-h6 q-mt-sm">Управление товарами</div>
            <div class="text-caption text-grey">Создание и редактирование</div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn color="primary" label="Добавить товар" :to="{ name: 'admin-new' }" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="text-center">
          <q-card-section>
            <q-icon name="admin_panel_settings" size="48px" color="orange" />
            <div class="text-h6 q-mt-sm">Роли</div>
            <div class="text-caption text-grey">Управление доступом</div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn color="orange" label="Роли" :to="{ name: 'admin-roles' }" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="text-center">
          <q-card-section>
            <q-icon name="storefront" size="48px" color="positive" />
            <div class="text-h6 q-mt-sm">Каталог</div>
            <div class="text-caption text-grey">Перейти к списку товаров</div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn color="positive" label="Открыть каталог" :to="{ name: 'products' }" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="text-center">
          <q-card-section>
            <q-icon name="logout" size="48px" color="grey" />
            <div class="text-h6 q-mt-sm">Выход</div>
            <div class="text-caption text-grey">Завершить сеанс</div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn flat color="grey" label="Выйти" @click="handleLogout" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-banner rounded class="bg-teal-1 text-teal-9">
      <template v-slot:avatar><q-icon name="info" /></template>
      ДЗ 9: навигационный guard проверяет <strong>JWT</strong>
      (не localStorage) перед входом на эту страницу.
      <br />Токен: <code>{{ authStore.token ? 'есть' : 'нет' }}</code>
      · Роль: <code>{{ authStore.role }}</code>
      · Истекает: <code>{{ authStore.claims ? new Date(authStore.claims.exp * 1000).toLocaleTimeString('ru-RU') : '—' }}</code>
    </q-banner>
  </q-page>
</template>

<script setup lang="ts">
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
</script>
