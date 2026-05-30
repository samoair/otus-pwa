<!--
  LoginPage.vue — форма логина (ДЗ 5).

  Демонстрирует:
  - vee-validate + zod — валидация формы
  - useRouter().push() — программная навигация после логина
  - localStorage — флаг аутентификации
  - v-on:keyup.enter — отправка формы по Enter
-->
<template>
  <q-page padding class="flex flex-center">
    <q-card flat bordered style="min-width: 350px; max-width: 400px">
      <q-card-section class="text-center">
        <q-icon name="lock" size="48px" color="primary" />
        <div class="text-h6 q-mt-sm">Вход в панель администратора</div>
        <div class="text-caption text-grey">
          Введите логин и пароль для доступа к управлению товарами
        </div>
      </q-card-section>

      <q-card-section>
        <Form :validation-schema="loginSchema" @submit="onSubmit">
          <div class="q-gutter-md">
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
                @keyup.enter="onSubmit"
              >
                <template v-slot:prepend><q-icon name="person" /></template>
              </q-input>
            </Field>

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
                @keyup.enter="onSubmit"
              >
                <template v-slot:prepend><q-icon name="vpn_key" /></template>
              </q-input>
            </Field>
          </div>

          <q-btn
            type="submit"
            color="primary"
            label="Войти"
            class="full-width q-mt-md"
            icon="login"
          />
        </Form>
      </q-card-section>

      <q-card-section class="text-center text-caption text-grey">
        Любой логин и пароль подойдут — это эмуляция.
        <br />Флаг ставится в localStorage, guard проверяет его.
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { Form, Field } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuth } from 'src/composables/useAuth';

// Zod-схема: оба поля обязательны, непустые
const loginSchema = toTypedSchema(
  z.object({
    username: z.string().min(1, 'Введите логин'),
    password: z.string().min(1, 'Введите пароль'),
  }),
);

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const { login } = useAuth();

function onSubmit(values: Record<string, unknown>) {
  const success = login(
    values.username as string,
    values.password as string,
  );

  if (success) {
    $q.notify({ type: 'positive', message: 'Вы вошли в систему' });
    // После логина — возвращаем на запрошенную страницу или в админку
    const redirect = (route.query.redirect as string) || { name: 'admin' };
    router.push(redirect);
  } else {
    $q.notify({ type: 'negative', message: 'Заполните все поля' });
  }
}
</script>
