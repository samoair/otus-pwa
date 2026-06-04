<!--
  AdminRolesPage.vue — страница только для админов (ДЗ 9).

  Демонстрирует:
  - Роли в JWT — meta.requiresAdmin проверяется в router guard
  - Роль берётся из decoded JWT claims
  - Если роль !== 'admin' → redirect на главную
-->
<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">
      <q-icon name="admin_panel_settings" class="q-mr-sm" />
      Управление ролями
    </div>

    <q-banner rounded class="bg-orange-1 text-orange-9 q-mb-md">
      <template v-slot:avatar><q-icon name="shield" /></template>
      Эта страница доступна только пользователям с ролью <strong>admin</strong>.
      Роль проверяется из JWT в navigation guard (meta.requiresAdmin).
    </q-banner>

    <!-- Информация о текущем админе -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle1 text-weight-bold">Текущий администратор</div>
        <q-chip icon="person" color="orange-2" text-color="orange-10">
          {{ authStore.username }}
        </q-chip>
        <q-badge color="orange">role: {{ authStore.role }}</q-badge>
      </q-card-section>
    </q-card>

    <!-- Таблица пользователей — моковые данные -->
    <q-card flat bordered>
      <q-card-section>
        <div class="text-subtitle1 text-weight-bold q-mb-md">Пользователи системы</div>
        <q-markup-table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Логин</th>
              <th>Роль</th>
              <th>JWT Claims</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>admin</td>
              <td><q-badge color="orange">admin</q-badge></td>
              <td class="text-caption text-grey">sub: 1, role: admin, exp: 1h</td>
            </tr>
            <tr>
              <td>2</td>
              <td>user</td>
              <td><q-badge color="blue">user</q-badge></td>
              <td class="text-caption text-grey">sub: 2, role: user, exp: 1h</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth-store';

const authStore = useAuthStore();
</script>
