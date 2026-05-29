<!--
  OrderPage.vue — ДЗ 4: страница оформления заказа.

  Демонстрирует:
  - props → events — передача данных между компонентами
  - composable — useProducts для данных корзины
  - Quasar layout — страница с заголовком и формой
  - v-if — состояние пустой корзины / форма заказа
-->
<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">Оформление заказа</div>

    <!-- Пустая корзина — v-if -->
    <div v-if="cartItems.length === 0" class="text-center q-pa-xl">
      <q-icon name="shopping_cart" size="64px" color="grey-5" />
      <div class="text-h6 text-grey q-mt-md">Корзина пуста</div>
      <div class="text-body2 text-grey-7 q-mb-md">Добавьте товары в каталоге</div>
      <q-btn color="primary" label="Перейти в каталог" to="/products" />
    </div>

    <!-- Форма заказа — показывает данные корзины -->
    <div v-else>
      <!-- Информация о корзине -->
      <q-card flat bordered class="q-mb-md bg-blue-1">
        <q-card-section class="row items-center">
          <q-icon name="shopping_cart" color="primary" class="q-mr-sm" />
          <span class="text-body2">
            В корзине: <strong>{{ cartItems.length }}</strong> товар(ов)
            · Сумма: <strong class="text-primary">${{ cartTotal.toFixed(2) }}</strong>
          </span>
          <q-space />
          <q-btn flat dense color="primary" label="Изменить" to="/products" />
        </q-card-section>
      </q-card>

      <!--
        OrderForm — дочерний компонент.
        Передаём cartItems через props (:cart-items).
        Компонент сам управляет валидацией и отправкой.
        Это «props down, events up» — основной паттерн Vue.
      -->
      <OrderForm :cart-items="cartItems" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import OrderForm from 'components/OrderForm.vue';
import { useProducts } from 'src/composables/useProducts';

// Используем composable для доступа к списку товаров
const { products } = useProducts();

// Корзина — те товары, которые пользователь добавил
// В реальном приложении это был бы Pinia store
import { ref } from 'vue';

// Для демо: корзина содержит первые 2 товара
// В реальном приложении данные приходят из store
const cartItems = computed(() => products.value.slice(0, 2));

const cartTotal = computed(() =>
  cartItems.value.reduce((sum, p) => sum + p.price, 0),
);
</script>
