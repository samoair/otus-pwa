<!--
  AdminLayout.vue — лейаут для админ-раздела (ДЗ 5 + ДЗ 9).

  ДЗ 9: навигация включает ссылку на роли (только admin).
  Auth проверяется через JWT в router guard.
-->
<template>
  <div>
    <!-- Админ-навигация — дочерние маршруты (children routes) -->
    <q-tabs dense class="text-grey q-mb-md" active-color="primary" indicator-color="primary">
      <q-route-tab :to="{ name: 'admin' }" label="Панель" icon="dashboard" />
      <q-route-tab :to="{ name: 'admin-new' }" label="Новый товар" icon="add_circle" />
      <q-route-tab
        v-if="authStore.role === 'admin'"
        :to="{ name: 'admin-roles' }"
        label="Роли"
        icon="admin_panel_settings"
      />
      <q-route-tab :to="{ name: 'products' }" label="В каталог" icon="storefront" />
    </q-tabs>

    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth-store';

const authStore = useAuthStore();
</script>
