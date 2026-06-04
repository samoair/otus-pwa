<!--
  LoginPage.vue — форма логина с JWT авторизацией (ДЗ 9).

  Демонстрирует:
  - JWT-авторизация — запрос к серверу, получение токена
  - Navigation guard redirect — возврат на целевую страницу после входа
  - Pinia store — сохранение JWT в auth-store + localStorage
  - vee-validate + zod — валидация формы (логин и пароль обязательны)
  - Защита от повторного входа — аутентифицированный пользователь
    перенаправляется на главную (в router guard)

  Тестовые аккаунты:
  - admin / admin123 (роль: admin)
  - user / user123   (роль: user)
-->
<template>
  <q-page padding class="flex flex-center">
    <q-card flat bordered style="min-width: 350px; max-width: 450px">
      <q-card-section class="text-center">
        <q-icon name="lock" size="48px" color="primary" />
        <div class="text-h6 q-mt-sm">Вход в систему</div>
        <div class="text-caption text-grey">
          JWT-авторизация · токен хранится в localStorage
        </div>
      </q-card-section>

      <q-card-section>
        <Form :validation-schema="loginSchema" @submit="onSubmit">
          <div class="q-gutter-md">
            <!-- Логин -->
            <Field name="username" v-slot="{ errorMessage, value, handleChange, handleBlur }">
              <q-input
                :model-value="value"
                @update:model-value="handleChange"
                @blur="handleBlur"
                label="Логин *"
                outlined
                dense
                :error="!!errorMessage"
                :error-message="errorMessage"
                autocomplete="username"
              >
                <template v-slot:prepend><q-icon name="person" /></template>
              </q-input>
            </Field>

            <!-- Пароль -->
            <Field name="password" v-slot="{ errorMessage, value, handleChange, handleBlur }">
              <q-input
                :model-value="value"
                @update:model-value="handleChange"
                @blur="handleBlur"
                type="password"
                label="Пароль *"
                outlined
                dense
                :error="!!errorMessage"
                :error-message="errorMessage"
                autocomplete="current-password"
              >
                <template v-slot:prepend><q-icon name="vpn_key" /></template>
              </q-input>
            </Field>
          </div>

          <!-- Ошибка от сервера -->
          <q-banner v-if="authStore.error" rounded class="bg-red-1 text-red-9 q-mt-md">
            <template v-slot:avatar><q-icon name="error" /></template>
            {{ authStore.error }}
          </q-banner>

          <q-btn
            type="submit"
            color="primary"
            label="Войти"
            class="full-width q-mt-md"
            icon="login"
            :loading="authStore.loading"
          />
        </Form>
      </q-card-section>

      <q-card-section class="text-center text-caption text-grey">
        Тестовые аккаунты:
        <br /><strong>admin</strong> / admin123 (админ)
        <br /><strong>user</strong> / user123 (пользователь)
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { Form, Field } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';

// Тип выводится из Zod-схемы — единый источник истины
const loginZodSchema = z.object({
  username: z.string().min(1, 'Введите логин'),
  password: z.string().min(1, 'Введите пароль'),
});
type LoginForm = z.infer<typeof loginZodSchema>;

const loginSchema = toTypedSchema(loginZodSchema);

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

async function onSubmit(values: LoginForm) {
  authStore.clearError();
  try {
    await authStore.login(values.username, values.password);

    const redirect = route.query.redirect as string | undefined;
    router.push(redirect ?? '/');
  } catch {
    // Ошибка уже в authStore.error
  }
}
</script>
