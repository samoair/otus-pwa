<!--
  AdminLayout.vue — лейаут для админ-раздела (ДЗ 5).

  Демонстрирует:
  - children routes — <router-view> для вложенных маршрутов
  - nested navigation — ссылки на дочерние страницы
  - navigation guard — только для авторизованных (проверяется в routes.ts)

  Структура маршрутов:
  /admin          → AdminLayout → AdminDashboardPage
  /admin/new      → AdminLayout → AdminNewProductPage
-->
<template>
  <div>
    <!-- Админ-навигация — дочерние маршруты (children routes) -->
    <q-tabs dense class="text-grey q-mb-md" active-color="primary" indicator-color="primary">
      <q-route-tab :to="{ name: 'admin' }" label="Панель" icon="dashboard" />
      <q-route-tab :to="{ name: 'admin-new' }" label="Новый товар" icon="add_circle" />
      <q-route-tab :to="{ name: 'products' }" label="В каталог" icon="storefront" />
    </q-tabs>

    <!--
      router-view — место, куда Vue Router рендерит дочерний компонент.
      Для children routes это обязательный элемент — без него
      дочерние маршруты не будут отображаться.
    -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from 'src/composables/useAuth';
import { useRouter } from 'vue-router';

const { logout } = useAuth();
const router = useRouter();
</script>
