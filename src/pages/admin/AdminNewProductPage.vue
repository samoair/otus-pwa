<!--
  AdminNewProductPage.vue — форма добавления товара (ДЗ 5).

  Демонстрирует:
  - child route — рендерится внутри AdminLayout (вложенный маршрут)
  - vee-validate + zod — валидация
  - POST запрос к API — ProductService.create()
  - router.back() — возврат на предыдущую страницу
-->
<template>
  <q-page padding>
    <q-breadcrumbs class="q-mb-md">
      <q-breadcrumbs-el label="Админ" :to="{ name: 'admin' }" />
      <q-breadcrumbs-el label="Новый товар" />
    </q-breadcrumbs>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6 q-mb-md">Создать новый товар</div>

        <Form :validation-schema="productSchema" @submit="onSubmit">
          <div class="row q-col-gutter-md">
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

            <div class="col-12">
              <Field name="description" v-slot="{ errorMessage, value, handleChange, handleBlur }">
                <q-input
                  :model-value="value"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                  type="textarea"
                  rows="4"
                  label="Описание *"
                  outlined
                  dense
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                />
              </Field>
            </div>

            <div class="col-12">
              <Field name="image" v-slot="{ errorMessage, value, handleChange, handleBlur }">
                <q-input
                  :model-value="value"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                  label="URL изображения"
                  outlined
                  dense
                  hint="Необязательно — подставится заглушка"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                />
              </Field>
            </div>
          </div>

          <div class="q-pa-sm q-gutter-sm">
            <q-btn type="submit" color="positive" label="Создать" icon="save" :loading="submitting" />
            <q-btn flat label="Назад" icon="arrow_back" @click="router.back()" />
          </div>
        </Form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Form, Field } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import ProductService from 'src/services/product/productService';

const router = useRouter();
const $q = useQuasar();
const submitting = ref(false);

const productZodSchema = z.object({
  title: z.string().min(3, 'Минимум 3 символа'),
  price: z.coerce.number().positive('Цена > 0'),
  description: z.string().min(10, 'Минимум 10 символов'),
  category: z.string().min(1, 'Выберите категорию'),
  image: z.string().url('Введите URL').or(z.literal('')).optional(),
});

type ProductFormValues = z.infer<typeof productZodSchema>;

const productSchema = toTypedSchema(productZodSchema);

const categoryOptions = [
  { label: "Мужская одежда", value: "men's clothing" },
  { label: "Женская одежда", value: "women's clothing" },
  { label: "Ювелирные изделия", value: 'jewelery' },
  { label: "Электроника", value: 'electronics' },
];

async function onSubmit(values: ProductFormValues) {
  submitting.value = true;
  try {
    const service = new ProductService();
    await service.create({
      title: values.title,
      price: values.price,
      description: values.description,
      category: values.category,
      image: values.image || 'https://via.placeholder.com/150',
    });
    $q.notify({ type: 'positive', message: 'Товар создан!' });
    router.push({ name: 'products' });
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Ошибка создания товара' });
  } finally {
    submitting.value = false;
  }
}
</script>
