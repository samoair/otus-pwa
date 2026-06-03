<!--
  ProductsPage.vue — ДЗ 3 + ДЗ 4 + ДЗ 6: главная страница магазина.

  ДЗ 6: composable useProducts теперь обёртка над Pinia products store.
  API composable не изменился — компоненты не потребовалось переписывать.

  Демонстрирует:
  - ref, reactive, computed — через composable useProducts → Pinia store
  - custom hooks — composable как thin wrapper над store
  - lifecycle methods — onMounted/onUnmounted внутри useProducts
  - v-for — список товаров
  - v-if — состояния загрузки, ошибки, пустого списка
  - v-bind — динамические атрибуты
  - v-show — видимость корзины
  - v-html — описание товара (в ProductCard)
  - v-on — обработка событий
  - ДЗ 4: поиск по цене, кнопка «Оформить заказ», создание товара

  Vapor Mode: совместим. <script setup vapor lang="ts">
-->
<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="text-h4">Каталог товаров</div>
      <q-space />
      <!-- ДЗ 4: кнопка создания нового товара -->
      <ProductFormDialog @created="onProductCreated" />
    </div>

    <!-- ============================================================
         ФИЛЬТРЫ — используют reactive() из composable
         ============================================================ -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-sm items-end">
          <!-- Поиск — v-model связан с reactive-свойством -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="filters.searchQuery"
              dense
              outlined
              label="Поиск по названию"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <!-- Категория — v-model на reactive -->
          <div class="col-12 col-md-2">
            <q-select
              v-model="filters.category"
              :options="['', ...categories]"
              dense
              outlined
              label="Категория"
              emit-value
            >
              <template v-slot:prepend>
                <q-icon name="category" />
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>
                      {{ scope.opt || 'Все категории' }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- ДЗ 4: Фильтр по цене — мин -->
          <div class="col-6 col-md-1">
            <q-input
              v-model.number="filters.priceMin"
              dense
              outlined
              type="number"
              label="Цена от"
              clearable
            />
          </div>

          <!-- ДЗ 4: Фильтр по цене — макс -->
          <div class="col-6 col-md-1">
            <q-input
              v-model.number="filters.priceMax"
              dense
              outlined
              type="number"
              label="Цена до"
              clearable
            />
          </div>

          <!-- Сортировка -->
          <div class="col-12 col-md-2">
            <q-select
              v-model="filters.sortBy"
              :options="sortOptions"
              dense
              outlined
              label="Сортировка"
              emit-value
              map-options
            />
          </div>

          <!-- Сброс -->
          <div class="col-12 col-md-3">
            <q-btn flat color="grey" label="Сбросить фильтры" @click="resetFilters" />
          </div>
        </div>

        <!-- Итого — computed -->
        <div class="text-caption text-grey q-mt-sm">
          Найдено: <strong>{{ filteredProducts.length }}</strong> из {{ products.length }}
          <span v-if="filteredProducts.length > 0">
            · Сумма: <strong>${{ totalPrice.toFixed(2) }}</strong>
          </span>
        </div>
      </q-card-section>
    </q-card>

    <!-- ============================================================
         v-if — условный рендеринг для трёх состояний:
         1. Загрузка (loading)
         2. Ошибка (error)
         3. Данные загружены (default)
         ============================================================ -->

    <!-- Состояние 1: Загрузка -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots size="48px" color="primary" />
      <div class="text-grey q-mt-md">Загрузка товаров...</div>
    </div>

    <!-- Состояние 2: Ошибка -->
    <q-card v-else-if="error" flat bordered class="bg-red-1">
      <q-card-section class="text-center">
        <q-icon name="error_outline" size="48px" color="negative" />
        <div class="text-h6 text-negative q-mt-sm">Ошибка загрузки</div>
        <div class="text-body2 text-grey-7">{{ error }}</div>
        <q-btn color="primary" label="Повторить" @click="fetchProducts" class="q-mt-md" />
      </q-card-section>
    </q-card>

    <!-- Состояние 3: Пустой результат -->
    <div
      v-else-if="filteredProducts.length === 0 && products.length > 0"
      class="text-center q-pa-xl text-grey"
    >
      <q-icon name="search_off" size="48px" />
      <div class="text-h6 q-mt-sm">Ничего не найдено</div>
      <div class="text-body2">Попробуйте изменить параметры поиска</div>
    </div>

    <!-- Состояние 4: Список товаров — v-for -->
    <template v-else>
      <!-- Корзина — v-show (всегда в DOM, переключается display) -->
      <div v-show="cartStore.totalItems > 0" class="q-mb-md">
        <q-card flat bordered class="bg-blue-1">
          <q-card-section class="row items-center">
            <q-icon name="shopping_cart" color="primary" size="sm" class="q-mr-sm" />
            <span class="text-body2">
              В корзине: <strong>{{ cartStore.totalItems }}</strong> товар(ов)
              · Сумма: <strong>${{ cartStore.totalPrice.toFixed(2) }}</strong>
            </span>
            <q-space />
            <q-btn flat dense color="positive" label="Корзина" icon="shopping_cart" :to="{ name: 'cart' }" class="q-mr-sm" />
            <q-btn flat dense color="negative" label="Очистить" @click="cartStore.clearCart()" />
          </q-card-section>
        </q-card>
      </div>

      <!-- v-for — рендеринг карточек товаров -->
      <div class="row q-col-gutter-md">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <!--
            ProductCard — дочерний компонент.
            Передаём данные через props (:product, :in-cart).
            Получаем события через @toggle-cart.
            Это «props down, events up» — основной паттерн Vue.
          -->
          <ProductCard
            :product="product"
            :in-cart="cartStore.isInCart(product.id)"
            @toggle-cart="handleToggleCart"
          />
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ProductCard from 'components/ProductCard.vue';
import ProductFormDialog from 'components/ProductFormDialog.vue';

import { useProducts } from 'src/composables/useProducts';
import { useCartStore } from 'src/stores/cart-store';
import type { Product } from 'src/services/product/productModels';

const {
  products,
  loading,
  error,
  filters,
  categories,
  filteredProducts,
  totalPrice,
  fetchProducts,
  resetFilters,
} = useProducts();

// ДЗ 5: корзина — общий Pinia store (а не локальный ref)
const cartStore = useCartStore();

// Обработчик события от ProductCard (v-on → emit)
function handleToggleCart(productId: number) {
  const product = products.value.find((p) => p.id === productId);
  if (!product) return;
  if (cartStore.isInCart(productId)) {
    cartStore.removeFromCart(productId);
  } else {
    cartStore.addToCart(product);
  }
}

// ДЗ 4: обработчик создания нового товара
// fakestoreapi возвращает товар с id — добавляем в список
function onProductCreated(product: { id?: number; title: string; price: number; description: string; category: string; image: string }) {
  const newProduct: Product = {
    id: product.id ?? Date.now(),
    title: product.title,
    price: product.price,
    description: product.description,
    category: product.category,
    image: product.image,
    rating: { rate: 0, count: 0 },
  };
  products.value.unshift(newProduct);
}

// Опции для сортировки — статический массив (не реактивный)
const sortOptions = [
  { label: 'По умолчанию', value: 'default' },
  { label: 'Цена ↑', value: 'price-asc' },
  { label: 'Цена ↓', value: 'price-desc' },
  { label: 'Рейтинг', value: 'rating' },
];
</script>
