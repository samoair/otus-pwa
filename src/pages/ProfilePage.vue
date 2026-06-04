<!--
  ProfilePage.vue — профиль пользователя (ДЗ 9).

  Страница доступна только аутентифицированным пользователям.
  Если JWT просрочен или отсутствует — router guard перенаправит на /login.

  Демонстрирует:
  - Данные из JWT — decoded claims (username, role, iat, exp)
  - Pinia store — чтение данных из auth-store
  - logout — очистка JWT, редирект на /login
-->
<template>
  <q-page padding>
    <div class="row justify-center">
      <q-card flat bordered style="min-width: 400px; max-width: 550px">
        <q-card-section class="text-center bg-primary text-white">
          <q-icon name="account_circle" size="64px" />
          <div class="text-h5 q-mt-sm">{{ authStore.username }}</div>
          <q-badge :color="authStore.role === 'admin' ? 'orange' : 'blue'" class="text-body2">
            {{ authStore.role }}
          </q-badge>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-md">Данные профиля</div>

          <q-list separator>
            <q-item>
              <q-item-section avatar>
                <q-icon name="badge" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Логин</q-item-label>
                <q-item-label>{{ authStore.username }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="admin_panel_settings" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Роль</q-item-label>
                <q-item-label>{{ authStore.role }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="authStore.claims">
              <q-item-section avatar>
                <q-icon name="schedule" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Токен выдан</q-item-label>
                <q-item-label>{{ formatDate(authStore.claims.iat * 1000) }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="authStore.claims">
              <q-item-section avatar>
                <q-icon name="timer" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Токен истекает</q-item-label>
                <q-item-label>{{ formatDate(authStore.claims.exp * 1000) }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="authStore.claims">
              <q-item-section avatar>
                <q-icon name="fingerprint" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>User ID (JWT sub)</q-item-label>
                <q-item-label>{{ authStore.claims.sub }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <!-- JWT Token — для демонстрации -->
        <q-expansion-item
          icon="vpn_key"
          label="JWT Token"
          caption="Декодированный payload (только для демонстрации)"
        >
          <q-card-section>
            <pre class="text-caption text-grey-8 bg-grey-2 q-pa-sm rounded-borders" style="overflow-x: auto">{{ tokenPreview }}</pre>
          </q-card-section>
        </q-expansion-item>

        <q-card-actions align="center" class="q-pa-md">
          <q-btn
            color="negative"
            label="Выйти из профиля"
            icon="logout"
            @click="handleLogout"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

const tokenPreview = computed(() =>
  JSON.stringify(authStore.claims, null, 2),
);

function formatDate(ts: number) {
  return new Date(ts).toLocaleString('ru-RU');
}

function handleLogout() {
  authStore.logout();
  $q.notify({ type: 'info', message: 'Вы вышли из системы' });
  router.push({ name: 'login' });
}
</script>
