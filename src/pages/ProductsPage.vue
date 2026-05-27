<!--
  ProductsPage.vue — ДЗ 3: главная страница магазина.

  Демонстрирует:
  - ref, reactive, computed — через composable useProducts
  - custom hooks — composable для загрузки и фильтрации
  - lifecycle methods — onMounted/onUnmounted внутри useProducts
  - v-for — список товаров
  - v-if — состояния загрузки, ошибки, пустого списка
  - v-bind — динамические атрибуты
  - v-show — видимость корзины
  - v-html — описание товара (в ProductCard)
  - v-on — обработка событий

  Vapor Mode: совместим. <script setup vapor lang="ts">
-->
<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">Каталог товаров</div>

    <!-- ============================================================
         ФИЛЬТРЫ — используют reactive() из composable
         ============================================================ -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-sm items-end">
          <!-- Поиск — v-model связан с reactive-свойством -->
          <div class="col-12 col-md-4">
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
          <div class="col-12 col-md-3">
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
      <div v-show="cartItems.length > 0" class="q-mb-md">
        <q-card flat bordered class="bg-blue-1">
          <q-card-section class="row items-center">
            <q-icon name="shopping_cart" color="primary" size="sm" class="q-mr-sm" />
            <span class="text-body2">
              В корзине: <strong>{{ cartItems.length }}</strong> товар(ов) · Сумма:
              <strong>${{ cartTotal.toFixed(2) }}</strong>
            </span>
            <q-space />
            <q-btn flat dense color="negative" label="Очистить" @click="cartItems = []" />
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
            :in-cart="cartItems.includes(product.id)"
            @toggle-cart="handleToggleCart"
          />
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ProductCard from 'components/ProductCard.vue';

// ============================================================
// CUSTOM HOOK (composable) — основа переиспользуемой логики
//
// useProducts() возвращает реактивное состояние и методы.
// Мы деструктурируем только нужное — остальное не используется.
// Composable инкапсулирует:
// - загрузку данных (fetch)
// - состояние (loading, error, products)
// - фильтры (reactive)
// - производные данные (computed)
// - lifecycle (onMounted/onUnmounted внутри composable)
// ============================================================
import { useProducts } from 'src/composables/useProducts';

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

// ============================================================
// Корзина — локальное состояние страницы (ref)
// В реальном приложении корзина была бы в Pinia store
// (как user-store в pms-pwa)
// ============================================================
const cartItems = ref<number[]>([]);

// computed — общая стоимость товаров в корзине
const cartTotal = computed(() =>
  products.value.filter((p) => cartItems.value.includes(p.id)).reduce((sum, p) => sum + p.price, 0),
);

// Обработчик события от ProductCard (v-on → emit)
function handleToggleCart(productId: number) {
  const index = cartItems.value.indexOf(productId);
  if (index === -1) {
    cartItems.value.push(productId);
  } else {
    cartItems.value.splice(index, 1);
  }
}

// Опции для сортировки — статический массив (не реактивный)
const sortOptions = [
  { label: 'По умолчанию', value: 'default' },
  { label: 'Цена ↑', value: 'price-asc' },
  { label: 'Цена ↓', value: 'price-desc' },
  { label: 'Рейтинг', value: 'rating' },
];
</script>
