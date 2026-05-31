<!--
  ProductDetailPage.vue — страница товара (ДЗ 5).

  Демонстрирует:
  - useRoute() — получение параметра :id из URL
  - onMounted() — загрузка данных по id
  - router params — динамический маршрут /products/:id
  - router.push() — программная навигация (назад, в корзину)
  - router-link — декларативная навигация (каталог, корзина)
-->
<template>
  <q-page padding>
    <!-- Загрузка -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots size="48px" color="primary" />
      <div class="text-grey q-mt-md">Загрузка товара...</div>
    </div>

    <!-- Ошибка -->
    <q-card v-else-if="error" flat bordered class="bg-red-1">
      <q-card-section class="text-center">
        <q-icon name="error_outline" size="48px" color="negative" />
        <div class="text-h6 text-negative q-mt-sm">{{ error }}</div>
        <q-btn color="primary" label="В каталог" :to="{ name: 'products' }" class="q-mt-md" />
      </q-card-section>
    </q-card>

    <!-- Данные товара -->
    <template v-else-if="product">
      <!-- Хлебные крошки — router-link для навигации -->
      <q-breadcrumbs class="q-mb-md">
        <q-breadcrumbs-el label="Каталог" :to="{ name: 'products' }" />
        <q-breadcrumbs-el :label="product.title" />
      </q-breadcrumbs>

      <div class="row q-col-gutter-lg">
        <!-- Изображение -->
        <div class="col-12 col-md-5">
          <q-img
            :src="product.image"
            :alt="product.title"
            fit="contain"
            style="max-height: 400px"
            class="q-pa-md bg-grey-2"
          />
        </div>

        <!-- Информация -->
        <div class="col-12 col-md-7">
          <q-badge outline class="q-mb-sm">{{ product.category }}</q-badge>
          <div class="text-h5 text-weight-bold q-mb-sm">{{ product.title }}</div>

          <div class="text-h4 text-primary q-mb-md">${{ product.price.toFixed(2) }}</div>

          <!-- Рейтинг -->
          <div class="row items-center q-mb-md">
            <q-rating
              :model-value="product.rating.rate"
              readonly
              size="sm"
              color="amber"
              icon="star"
              icon-half="star_half"
            />
            <span class="text-body2 text-grey q-ml-sm">
              {{ product.rating.rate }} ({{ product.rating.count }} отзывов)
            </span>
          </div>

          <!-- Описание — v-html для HTML-разметки -->
          <div class="text-body2 text-grey-8 q-mb-lg" v-html="product.description" />

          <!-- Кнопки — программная навигация через router -->
          <div class="q-gutter-sm">
            <q-btn
              color="primary"
              size="lg"
              :icon="inCart ? 'remove_shopping_cart' : 'add_shopping_cart'"
              :label="inCart ? 'Убрать из корзины' : 'Добавить в корзину'"
              @click="toggleCart"
            />
            <q-btn
              v-if="cartStore.totalItems > 0"
              flat
              color="positive"
              icon="shopping_cart"
              :label="`В корзине: ${cartStore.totalItems}`"
              :to="{ name: 'cart' }"
            />
          </div>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Product } from 'src/services/product/productModels';
import ProductService from 'src/services/product/productService';
import { useCartStore } from 'src/stores/cart-store';

// ============================================================
// useRoute() — доступ к параметрам текущего маршрута.
// route.params.id — это :id из маршрута /products/:id
// useRouter() — программная навигация (push, replace, back)
// ============================================================
const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const product = ref<Product | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

// Параметр из URL — route.params.id (строка, приводим к числу)
const productId = computed(() => Number(route.params.id));

const inCart = computed(() => cartStore.isInCart(productId.value));

// ============================================================
// onMounted — загрузка товара при появлении страницы.
// Используем route.params.id для запроса к API.
// ============================================================
onMounted(async () => {
  loading.value = true;
  try {
    const service = new ProductService();
    product.value = await service.getById(productId.value);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Товар не найден';
  } finally {
    loading.value = false;
  }
});

function toggleCart() {
  if (!product.value) return;
  if (inCart.value) {
    cartStore.removeFromCart(productId.value);
  } else {
    cartStore.addToCart(product.value);
  }
}
</script>
