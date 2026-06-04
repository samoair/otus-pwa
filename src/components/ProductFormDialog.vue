<!--
  ProductFormDialog.vue — диалог создания нового товара (ДЗ 4).

  Демонстрирует:
  - vee-validate + zod — валидация формы через schema
  - v-model на каждом поле — двусторонняя привязка
  - Quasar Dialog — программное открытие/закрытие
  - emit — отправка результата родителю
  - ref — локальное состояние (loading, dialog)
-->
<template>
  <!-- Кнопка открытия диалога -->
  <q-btn
    color="positive"
    icon="add"
    label="Новый товар"
    @click="dialogOpen = true"
  />

  <!-- q-dialog — модальное окно (v-model управляет видимостью) -->
  <q-dialog v-model="dialogOpen" persistent maximized>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Создать новый товар</div>
        <q-space />
        <q-btn flat round dense icon="close" @click="closeDialog" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <!--
          vee-validate: Form — обёртка, отслеживающая все поля.
          @submit вызывается ТОЛЬКО если валидация прошла.
        -->
        <Form :validation-schema="productSchema" @submit="onSubmit">
          <div class="row q-col-gutter-md q-pa-md">
            <!-- Название — text input -->
            <div class="col-12 col-md-6">
              <Field name="title" v-slot="{ errorMessage, value, handleChange, handleBlur }">
                <q-input
                  :model-value="value"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                  label="Название *"
                  outlined
                  dense
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                />
              </Field>
            </div>

            <!-- Цена — number input -->
            <div class="col-12 col-md-3">
              <Field name="price" v-slot="{ errorMessage, value, handleChange, handleBlur }">
                <q-input
                  :model-value="value"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                  type="number"
                  step="0.01"
                  label="Цена ($) *"
                  outlined
                  dense
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                />
              </Field>
            </div>

            <!-- Категория — select -->
            <div class="col-12 col-md-3">
              <Field name="category" v-slot="{ errorMessage, value, handleChange, handleBlur }">
                <q-select
                  :model-value="value"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                  :options="categoryOptions"
                  label="Категория *"
                  outlined
                  dense
                  emit-value
                  map-options
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                />
              </Field>
            </div>

            <!-- Описание — textarea -->
            <div class="col-12">
              <Field name="description" v-slot="{ errorMessage, value, handleChange, handleBlur }">
                <q-input
                  :model-value="value"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                  type="textarea"
                  rows="3"
                  label="Описание *"
                  outlined
                  dense
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                />
              </Field>
            </div>

            <!-- URL изображения -->
            <div class="col-12">
              <Field name="image" v-slot="{ errorMessage, value, handleChange, handleBlur }">
                <q-input
                  :model-value="value"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                  label="URL изображения"
                  outlined
                  dense
                  hint="Можно оставить пустым — подставится заглушка"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                />
              </Field>
            </div>
          </div>

          <!-- Кнопки формы -->
          <div class="q-pa-md q-gutter-sm">
            <q-btn
              type="submit"
              color="positive"
              label="Создать"
              :loading="submitting"
              icon="save"
            />
            <q-btn flat color="grey" label="Отмена" @click="closeDialog" />
          </div>
        </Form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Form, Field } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import ProductService from 'src/services/product/productService';

// emit — событие «товар создан», родитель добавит его в список
const emit = defineEmits<{
  created: [product: { title: string; price: number; description: string; category: string; image: string }];
}>();

// ============================================================
// Zod-схема валидации формы нового товара.
// toTypedSchema() конвертирует Zod-схему в формат vee-validate.
// ============================================================
const productZodSchema = z.object({
  title: z.string().min(3, 'Минимум 3 символа'),
  price: z.coerce.number().positive('Цена должна быть > 0'),
  description: z.string().min(10, 'Минимум 10 символов'),
  category: z.string().min(1, 'Выберите категорию'),
  image: z.string().url('Введите корректный URL').or(z.literal('')).optional(),
});

type ProductFormValues = z.infer<typeof productZodSchema>;

const productSchema = toTypedSchema(productZodSchema);

// Категории для select — из fakestoreapi
const categoryOptions = [
  { label: "Мужская одежда", value: "men's clothing" },
  { label: "Женская одежда", value: "women's clothing" },
  { label: "Ювелирные изделия", value: 'jewelery' },
  { label: "Электроника", value: 'electronics' },
];

// Локальное состояние
const dialogOpen = ref(false);
const submitting = ref(false);

// Обработчик сабмита — вызывается только после валидации
async function onSubmit(values: ProductFormValues) {
  submitting.value = true;
  try {
    const service = new ProductService();
    const product = await service.create({
      title: values.title,
      price: values.price,
      description: values.description,
      category: values.category,
      image: values.image || 'https://via.placeholder.com/150',
    });
    emit('created', product);
    closeDialog();
  } catch (err) {
    console.error('Ошибка создания товара:', err);
  } finally {
    submitting.value = false;
  }
}

function closeDialog() {
  dialogOpen.value = false;
}
</script>
