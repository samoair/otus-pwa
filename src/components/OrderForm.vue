<!--
  OrderForm.vue — форма заказа (ДЗ 4).

  Демонстрирует:
  - vee-validate + zod — полноценная валидация формы
  - Form / Field — компоненты vee-validate для отслеживания полей
  - v-model через :model-value + @update:model-value — совместимость с Quasar
  - reactive — составной объект с вложенными данными
  - computed — итоговая стоимость, состояние формы
  - async/await — отправка на httpbin.org/post
  - Quasar Notify — уведомление об успешном заказе
  - Quasar Stepper — пошаговое заполнение формы

  Типы полей:
  - text (ФИО, город, улица, дом)
  - email
  - tel (телефон)
  - date (дата рождения)
  - select (страна)
  - checkbox (согласие с правилами)
  - number (карта, CVV)

  Vapor Mode: совместим. <script setup vapor lang="ts">
-->
<template>
  <q-card flat bordered>
    <!--
      Stepper — пошаговая форма. Каждое действие — отдельный шаг.
      v-model="step" управляет текущим шагом через ref().
    -->
    <q-stepper v-model="step" vertical color="primary" animated>

      <!-- ============================================================
           Шаг 1: Личные данные
           ============================================================ -->
      <q-step :name="1" title="Личные данные" icon="person" :done="step > 1">
        <div class="q-gutter-md">
          <!-- ФИО — text input с валидацией -->
          <Field name="fio" v-slot="{ errorMessage, value, handleChange, handleBlur }">
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
              label="Телефон *"
              outlined
              dense
              mask="+7 (###) ###-##-##"
              unmasked-value
              :error="!!errorMessage"
              :error-message="errorMessage"
            >
              <template v-slot:prepend><q-icon name="phone" /></template>
            </q-input>
          </Field>

          <!-- Дата рождения — date input с popup -->
          <Field name="birthDate" v-slot="{ errorMessage, value, handleChange }">
            <q-input
              :model-value="value"
              @update:model-value="handleChange"
              label="Дата рождения *"
              outlined
              dense
              :error="!!errorMessage"
              :error-message="errorMessage"
            >
              <template v-slot:prepend><q-icon name="cake" /></template>
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date :model-value="value" @update:model-value="(val: string) => handleChange(val)" mask="DD.MM.YYYY">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Выбрать" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-input>
          </Field>
        </div>

        <q-stepper-navigation>
          <q-btn @click="validateAndNext(1)" color="primary" label="Далее" />
        </q-stepper-navigation>
      </q-step>

      <!-- ============================================================
           Шаг 2: Адрес доставки
           ============================================================ -->
      <q-step :name="2" title="Адрес доставки" icon="local_shipping" :done="step > 2">
        <div class="q-gutter-md">
          <!-- Страна — select -->
          <Field name="country" v-slot="{ errorMessage, value, handleChange, handleBlur }">
            <q-select
              :model-value="value"
              @update:model-value="handleChange"
              @blur="handleBlur"
              :options="countries"
              label="Страна *"
              outlined
              dense
              emit-value
              map-options
              :error="!!errorMessage"
              :error-message="errorMessage"
            >
              <template v-slot:prepend><q-icon name="public" /></template>
            </q-select>
          </Field>

          <!-- Город -->
          <Field name="address.city" v-slot="{ errorMessage, value, handleChange, handleBlur }">
            <q-input
              :model-value="value"
              @update:model-value="handleChange"
              @blur="handleBlur"
              label="Город *"
              outlined
              dense
              :error="!!errorMessage"
              :error-message="errorMessage"
            >
              <template v-slot:prepend><q-icon name="location_city" /></template>
            </q-input>
          </Field>

          <div class="row q-col-gutter-sm">
            <!-- Улица -->
            <div class="col-12 col-md-6">
              <Field name="address.street" v-slot="{ errorMessage, value, handleChange, handleBlur }">
                <q-input
                  :model-value="value"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                  label="Улица *"
                  outlined
                  dense
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                />
              </Field>
            </div>

            <!-- Дом -->
            <div class="col-6 col-md-3">
              <Field name="address.house" v-slot="{ errorMessage, value, handleChange, handleBlur }">
                <q-input
                  :model-value="value"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                  label="Дом *"
                  outlined
                  dense
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                />
              </Field>
            </div>

            <!-- Квартира — необязательное -->
            <div class="col-6 col-md-3">
              <Field name="address.apartment" v-slot="{ errorMessage, value, handleChange, handleBlur }">
                <q-input
                  :model-value="value"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                  label="Квартира"
                  outlined
                  dense
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                />
              </Field>
            </div>
          </div>
        </div>

        <q-stepper-navigation>
          <q-btn @click="validateAndNext(2)" color="primary" label="Далее" />
          <q-btn flat @click="step = 1" color="primary" label="Назад" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>

      <!-- ============================================================
           Шаг 3: Данные оплаты
           ============================================================ -->
      <q-step :name="3" title="Данные оплаты" icon="credit_card" :done="step > 3">
        <div class="q-gutter-md">
          <!-- Имя на карте -->
          <Field name="payment.cardHolder" v-slot="{ errorMessage, value, handleChange, handleBlur }">
            <q-input
              :model-value="value"
              @update:model-value="handleChange"
              @blur="handleBlur"
              label="Имя на карте *"
              outlined
              dense
              :error="!!errorMessage"
              :error-message="errorMessage"
            >
              <template v-slot:prepend><q-icon name="person" /></template>
            </q-input>
          </Field>

          <!-- Номер карты — с маской -->
          <Field name="payment.cardNumber" v-slot="{ errorMessage, value, handleChange, handleBlur }">
            <q-input
              :model-value="value"
              @update:model-value="handleChange"
              @blur="handleBlur"
              label="Номер карты *"
              outlined
              dense
              mask="#### #### #### ####"
              unmasked-value
              :error="!!errorMessage"
              :error-message="errorMessage"
            >
              <template v-slot:prepend><q-icon name="credit_card" /></template>
            </q-input>
          </Field>

          <div class="row q-col-gutter-sm">
            <!-- Срок действия -->
            <div class="col-6">
              <Field name="payment.expiry" v-slot="{ errorMessage, value, handleChange, handleBlur }">
                <q-input
                  :model-value="value"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                  label="Срок (MM/YY) *"
                  outlined
                  dense
                  mask="##/##"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                />
              </Field>
            </div>

            <!-- CVV -->
            <div class="col-6">
              <Field name="payment.cvv" v-slot="{ errorMessage, value, handleChange, handleBlur }">
                <q-input
                  :model-value="value"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                  label="CVV *"
                  outlined
                  dense
                  mask="###"
                  type="password"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                />
              </Field>
            </div>
          </div>
        </div>

        <q-stepper-navigation>
          <q-btn @click="validateAndNext(3)" color="primary" label="Далее" />
          <q-btn flat @click="step = 2" color="primary" label="Назад" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>

      <!-- ============================================================
           Шаг 4: Подтверждение
           ============================================================ -->
      <q-step :name="4" title="Подтверждение" icon="check_circle">
        <!-- Предпросмотр данных перед отправкой -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Ваш заказ</div>

            <!-- Товары в корзине -->
            <div v-for="item in cartItems" :key="item.id" class="row items-center q-mb-xs">
              <q-icon name="shopping_bag" size="xs" class="q-mr-sm" />
              <span class="text-body2">{{ item.title }} — <strong>${{ item.price.toFixed(2) }}</strong></span>
            </div>

            <q-separator class="q-my-sm" />
            <div class="text-right text-subtitle2">
              Итого: <strong class="text-primary">${{ cartTotal.toFixed(2) }}</strong>
            </div>
          </q-card-section>
        </q-card>

        <!-- Согласие с правилами — checkbox -->
        <Field name="agreeTerms" v-slot="{ errorMessage, value, handleChange }">
          <q-checkbox
            :model-value="value"
            @update:model-value="(val: boolean) => handleChange(val)"
            label="Я согласен(-на) с правилами обработки заказа *"
            color="primary"
          />
          <div v-if="errorMessage" class="text-negative text-caption q-ml-sm">
            {{ errorMessage }}
          </div>
        </Field>

        <q-stepper-navigation>
          <q-btn
            color="positive"
            label="Оформить заказ"
            icon="send"
            :loading="submitting"
            @click="submitOrder"
          />
          <q-btn flat @click="step = 3" color="primary" label="Назад" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Form, Field, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import type { OrderFormData, Product } from 'src/services/product/productModels';
import OrderService from 'src/services/order/orderService';

// ============================================================
// PERSISTENCE — сохранение формы в localStorage.
// Форма из 4 шагов — обидно потерять данные при уходе со страницы.
// Сохраняем при каждом изменении, восстанавливаем при возврате.
// ============================================================
const STORAGE_KEY = 'otus-pwa-order-form';
const STORAGE_STEP_KEY = 'otus-pwa-order-step';

interface SavedForm {
  fio: string;
  email: string;
  phone: string;
  birthDate: string;
  country: string;
  address: { city: string; street: string; house: string; apartment: string };
  payment: { cardHolder: string; cardNumber: string; expiry: string; cvv: string };
  agreeTerms: boolean;
}

function saveForm(values: SavedForm) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
}

function loadForm(): SavedForm | null {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try { return JSON.parse(saved); } catch { return null; }
}

function clearForm() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_STEP_KEY);
}

function saveStep(s: number) {
  localStorage.setItem(STORAGE_STEP_KEY, String(s));
}

function loadStep(): number {
  const s = localStorage.getItem(STORAGE_STEP_KEY);
  return s ? Math.min(Math.max(Number(s), 1), 4) : 1;
}

// ============================================================
// Props — товары в корзине (передаются от родителя)
// ============================================================
const props = defineProps<{
  cartItems: Product[];
}>();

// ============================================================
// Zod-схема валидации — описывает правила для каждого поля.
// toTypedSchema() конвертирует Zod-схему в формат vee-validate.
//
// Zod vs Vuelidate:
// - Zod: декларативная schema, переиспользуемая на клиенте/сервере
// - Vuelidate: rules-объект рядом с данными, больше boilerplate
// Оба подхода валидны — выбор зависит от предпочтений команды.
// ============================================================
const orderSchema = z.object({
  fio: z.string().min(2, 'Введите ФИО (минимум 2 символа)'),
  email: z.string().email('Введите корректный email'),
  phone: z.string().min(10, 'Введите номер телефона'),
  birthDate: z.string().min(1, 'Укажите дату рождения'),
  country: z.string().min(1, 'Выберите страну'),
  address: z.object({
    city: z.string().min(2, 'Введите город'),
    street: z.string().min(2, 'Введите улицу'),
    house: z.string().min(1, 'Введите номер дома'),
    apartment: z.string().optional(),
  }),
  payment: z.object({
    cardHolder: z.string().min(2, 'Введите имя на карте'),
    cardNumber: z.string().min(16, 'Введите 16 цифр карты'),
    expiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Формат: MM/YY'),
    cvv: z.string().min(3, 'Введите 3 цифры CVV'),
  }),
  agreeTerms: z.literal(true, 'Необходимо согласие'),
});

// Тип выводится из Zod-схемы — единый источник истины
type OrderSchemaType = z.infer<typeof orderSchema>;

// Начальные значения: из localStorage если есть, иначе пустые
const savedForm = loadForm();
const orderInitialValues = savedForm
  ? { ...savedForm, agreeTerms: (savedForm.agreeTerms || false) as unknown as true }
  : {
      fio: '',
      email: '',
      phone: '',
      birthDate: '',
      country: '',
      address: { city: '', street: '', house: '', apartment: '' },
      payment: { cardHolder: '', cardNumber: '', expiry: '', cvv: '' },
      agreeTerms: false as unknown as true,
    };

// ============================================================
// useForm — хук vee-validate для управления формой.
// Доступ к validate(), values, errors и т.д.
// ============================================================
const { validate, values, errors } = useForm<OrderSchemaType>({
  validationSchema: toTypedSchema(orderSchema),
  initialValues: orderInitialValues,
});

// Список стран для select
const countries = [
  { label: 'Россия', value: 'RU' },
  { label: 'Беларусь', value: 'BY' },
  { label: 'Казахстан', value: 'KZ' },
  { label: 'Украина', value: 'UA' },
  { label: 'Другая', value: 'OTHER' },
];

// Локальное состояние — шаг восстанавливается из localStorage
const step = ref(loadStep());
const submitting = ref(false);

// ============================================================
// watch — автосохранение формы при каждом изменении.
// deep: true — отслеживает вложенные изменения (address.city и т.д.).
// Даже если пользователь заполнил только шаг 1 и ушёл — данные сохранятся.
// ============================================================
watch(values, (v) => {
  saveForm(v as unknown as SavedForm);
}, { deep: true });

watch(step, (s) => {
  saveStep(s);
});

// Итоговая стоимость корзины — computed (производное от props)
const cartTotal = computed(() =>
  props.cartItems.reduce((sum, p) => sum + p.price, 0),
);

// Router и Quasar plugins
const router = useRouter();
const $q = useQuasar();

// ============================================================
// Пошаговая валидация — проверяем только поля текущего шага.
// validate() запускает ВСЕ правила, но valid будет false,
// если пусты поля на следующих шагах (которые ещё не заполнены).
// Поэтому проверяем только errors по полям текущего шага.
// ============================================================
async function validateAndNext(currentStep: number) {
  await validate();

  const stepFields: Record<number, string[]> = {
    1: ['fio', 'email', 'phone', 'birthDate'],
    2: ['country', 'address.city', 'address.street', 'address.house'],
    3: ['payment.cardHolder', 'payment.cardNumber', 'payment.expiry', 'payment.cvv'],
  };

  const fields = stepFields[currentStep] ?? [];
  const hasStepErrors = fields.some((f) => errors.value[f]);

  if (!hasStepErrors) {
    step.value = currentStep + 1;
  }
}

// ============================================================
// Отправка заказа на echo-сервер httpbin.org.
// После успеха — уведомление и редирект на главную.
// ============================================================
async function submitOrder() {
  // Финальная валидация
  const { valid } = await validate();
  if (!valid) {
    $q.notify({ type: 'negative', message: 'Заполните все обязательные поля' });
    return;
  }

  submitting.value = true;
  try {
    const service = new OrderService();
    const orderData: OrderFormData = {
      fio: values.fio,
      email: values.email,
      phone: values.phone,
      birthDate: values.birthDate,
      country: values.country,
      address: { ...values.address },
      payment: { ...values.payment },
      agreeTerms: true,
    };

    // POST на httpbin.org — echo-сервер вернёт отправленные данные
    const response = await service.submitOrder(orderData);
    console.log('Ответ httpbin.org:', response);

    // Заказ отправлен — очищаем сохранённую форму
    clearForm();

    // Уведомление об успехе — Quasar Notify plugin
    $q.notify({
      type: 'positive',
      message: 'Заказ успешно оформлен!',
      caption: 'Переход на главную страницу...',
      position: 'top',
      timeout: 3000,
    });

    // Редирект на главную через 1.5 секунды
    setTimeout(() => {
      router.push('/');
    }, 1500);
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'Ошибка отправки заказа',
      caption: err instanceof Error ? err.message : 'Попробуйте позже',
    });
  } finally {
    submitting.value = false;
  }
}
</script>
