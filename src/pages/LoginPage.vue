<!--
  LoginPage.vue — форма логина (ДЗ 5-6).

  ДЗ 6: собирает данные покупателя (ФИО, email, телефон)
  и сохраняет их в Pinia user store + localStorage.

  Демонстрирует:
  - vee-validate + zod — валидация формы
  - Pinia store — сохранение данных пользователя
  - useRouter().push() — навигация после логина
  - @keyup.enter — отправка формы по Enter
-->
<template>
  <q-page padding class="flex flex-center">
    <q-card flat bordered style="min-width: 350px; max-width: 450px">
      <q-card-section class="text-center">
        <q-icon name="lock" size="48px" color="primary" />
        <div class="text-h6 q-mt-sm">Вход в систему</div>
        <div class="text-caption text-grey">
          Данные сохраняются в Pinia store и localStorage
        </div>
      </q-card-section>

      <q-card-section>
        <Form :validation-schema="loginSchema" @submit="onSubmit">
          <div class="q-gutter-md">
            <!-- ФИО -->
            <Field name="name" v-slot="{ errorMessage, value, handleChange, handleBlur }">
              <q-input
                :model-value="value"
                @update:model-value="handleChange"
                @blur="handleBlur"
                label="ФИО *"
                outlined
                dense
                :error="!!errorMessage"
                :error-message="errorMessage"
              >
                <template v-slot:prepend><q-icon name="badge" /></template>
              </q-input>
            </Field>

            <!-- Email -->
            <Field name="email" v-slot="{ errorMessage, value, handleChange, handleBlur }">
              <q-input
                :model-value="value"
                @update:model-value="handleChange"
                @blur="handleBlur"
                type="email"
                label="Email *"
                outlined
                dense
                :error="!!errorMessage"
                :error-message="errorMessage"
              >
                <template v-slot:prepend><q-icon name="email" /></template>
              </q-input>
            </Field>

            <!-- Телефон -->
            <Field name="phone" v-slot="{ errorMessage, value, handleChange, handleBlur }">
              <q-input
                :model-value="value"
                @update:model-value="handleChange"
                @blur="handleBlur"
                type="tel"
                label="Телефон"
                outlined
                dense
                mask="+7 (###) ###-##-##"
                :error="!!errorMessage"
                :error-message="errorMessage"
              >
                <template v-slot:prepend><q-icon name="phone" /></template>
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
        Любые данные подойдут — это эмуляция.
        <br />Данные сохраняются в глобальный стейт (Pinia)
        <br />и отображаются в шапке приложения.
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
import { useUserStore } from 'src/stores/user-store';

const loginSchema = toTypedSchema(
  z.object({
    name: z.string().min(2, 'Введите ФИО'),
    email: z.string().email('Введите корректный email'),
    phone: z.string().optional(),
  }),
);

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const userStore = useUserStore();

function onSubmit(values: Record<string, unknown>) {
  // ДЗ 6: сохраняем данные покупателя в Pinia store
  userStore.login({
    name: values.name as string,
    email: values.email as string,
    phone: (values.phone as string) || '',
    address: { city: '', street: '', house: '' },
  });

  $q.notify({ type: 'positive', message: `Добро пожаловать, ${userStore.fullName}!` });

  // Если guard перенаправил с /admin — вернём обратно
  const redirect = (route.query.redirect as string) || { name: 'home' };
  router.push(redirect);
}
</script>
