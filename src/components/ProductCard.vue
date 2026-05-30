<!--
  ProductCard.vue — карточка товара.

  Демонстрирует:
  - props / defineProps — передача данных от родителя
  - emit / defineEmits — отправка событий родителю
  - v-bind — динамические стили и атрибуты
  - v-show — переключение видимости описания
  - v-html — описание с HTML-разметкой
  - v-on — обработка кликов

  Vapor Mode: компонент совместим.
  Замените <script setup lang="ts"> на <script setup vapor lang="ts">.
-->
<template>
  <q-card
    flat
    bordered
    class="product-card"
    :class="{ 'product-card--in-cart': inCart }"
  >
    <!-- Изображение — v-bind:src для динамического URL -->
    <q-img
      :src="product.image"
      :alt="product.title"
      fit="contain"
      height="180px"
      class="q-pa-sm"
    >
      <!-- v-if — бейдж рейтинга показывается только если рейтинг высокий -->
      <div v-if="product.rating.rate >= 4" class="absolute-top-right q-pa-xs">
        <q-badge color="positive">
          ★ {{ product.rating.rate }}
        </q-badge>
      </div>
    </q-img>

    <q-card-section>
      <!-- v-bind:style — динамический цвет цены -->
      <div
        class="text-h6 text-weight-bold q-mb-xs"
        :style="{ color: priceColor }"
      >
        ${{ product.price.toFixed(2) }}
      </div>

      <!-- Название — router-link на страницу товара (ДЗ 5) -->
      <router-link
        :to="{ name: 'product-detail', params: { id: product.id } }"
        class="text-subtitle2 text-grey-9"
        style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-decoration: none"
      >
        {{ product.title }}
      </router-link>

      <!-- v-bind:class — категория с цветовой кодировкой -->
      <q-badge
        outline
        :class="categoryClass"
        class="q-mt-sm"
      >
        {{ product.category }}
      </q-badge>

      <!-- v-show — описание всегда в DOM, переключается через display -->
      <!--
        Используем v-show а не v-if, потому что пользователь
        может часто открывать/закрывать описание — пересоздавать
        DOM-элемент каждый раз дорого.
      -->
      <div v-show="showDetails" class="text-caption text-grey-7 q-mt-sm">
        <!--
          v-html — описание товара содержит HTML-разметку.
          Данные из fakestoreapi — доверенные, но в реальном приложении
          нужно санитизировать HTML перед вставкой.
        -->
        <div v-html="product.description"></div>
      </div>

      <!-- Рейтинг — звёзды -->
      <div class="row items-center q-mt-sm">
        <q-rating
          :model-value="product.rating.rate"
          readonly
          size="xs"
          color="amber"
          icon="star"
          icon-half="star_half"
        />
        <span class="text-caption text-grey q-ml-xs">
          ({{ product.rating.count }})
        </span>
      </div>
    </q-card-section>

    <q-separator />

    <!-- Действия — v-on для обработки кликов -->
    <q-card-actions align="between">
      <!-- @click — добавление/удаление из корзины -->
      <q-btn
        flat
        dense
        :color="inCart ? 'negative' : 'primary'"
        :icon="inCart ? 'remove_shopping_cart' : 'add_shopping_cart'"
        :label="inCart ? 'Убрать' : 'В корзину'"
        @click="toggleCart"
      />

      <!-- @click — переключение описания -->
      <q-btn
        flat
        dense
        color="grey"
        :icon="showDetails ? 'expand_less' : 'expand_more'"
        :label="showDetails ? 'Скрыть' : 'Описание'"
        @click="showDetails = !showDetails"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Product } from 'src/services/product/productModels';

// ============================================================
// defineProps — объявление входных данных компонента.
// Родитель передаёт: <ProductCard :product="item" :in-cart="..." />
//
// В Vapor Mode: defineProps работает одинаково.
// ============================================================
const props = defineProps<{
  product: Product;
  inCart: boolean;
}>();

// ============================================================
// defineEmits — объявление событий, которые компонент отправляет.
// Родитель слушает: <ProductCard @toggle-cart="handler" />
// ============================================================
const emit = defineEmits<{
  toggleCart: [productId: number];
}>();

// Локальное состояние — показ описания (v-show)
const showDetails = ref(false);

// ============================================================
// computed() — динамический цвет цены
// Дешёвые товары — зелёный, дорогие — синий
// ============================================================
const priceColor = computed(() => {
  if (props.product.price < 20) return '#4caf50';
  if (props.product.price < 100) return '#1976d2';
  return '#9c27b0';
});

// computed — цвет бейджа категории
const categoryClass = computed(() => {
  const catMap: Record<string, string> = {
    "men's clothing": 'text-blue',
    "women's clothing": 'text-pink',
    'jewelery': 'text-amber',
    'electronics': 'text-teal',
  };
  return catMap[props.product.category] || 'text-grey';
});

// v-on handler — отправка события родителю
function toggleCart() {
  emit('toggleCart', props.product.id);
}
</script>

<style scoped>
.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.product-card--in-cart {
  border-color: #1976d2;
  background-color: #e3f2fd;
}
</style>
