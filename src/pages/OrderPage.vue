<!--
  OrderPage.vue — ДЗ 4-5: страница оформления заказа.

  Демонстрирует:
  - Pinia store — общие данные корзины
  - props → events — передача данных между компонентами
  - v-if — состояние пустой корзины / форма заказа
-->
<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">Оформление заказа</div>

    <!-- Пустая корзина — v-if -->
    <div v-if="cartStore.items.length === 0" class="text-center q-pa-xl">
      <q-icon name="shopping_cart" size="64px" color="grey-5" />
      <div class="text-h6 text-grey q-mt-md">Корзина пуста</div>
      <div class="text-body2 text-grey-7 q-mb-md">Добавьте товары в каталоге</div>
      <q-btn color="primary" label="Перейти в каталог" :to="{ name: 'products' }" />
    </div>

    <!-- Форма заказа — показывает данные корзины -->
    <div v-else>
      <!-- Баннер: черновик восстановлен -->
      <q-banner v-if="hasDraft" rounded class="bg-teal-1 text-teal-9 q-mb-md">
        <template v-slot:avatar>
          <q-icon name="restore" />
        </template>
        Ваши данные восстановлены из предыдущего сеанса.
        <template v-slot:action>
          <q-btn flat color="teal" label="Начать заново" @click="clearDraft" />
        </template>
      </q-banner>

      <!-- Информация о корзине -->
      <q-card flat bordered class="q-mb-md bg-blue-1">
        <q-card-section class="row items-center">
          <q-icon name="shopping_cart" color="primary" class="q-mr-sm" />
          <span class="text-body2">
            В корзине: <strong>{{ cartStore.totalItems }}</strong> товар(ов)
            · Сумма: <strong class="text-primary">${{ cartStore.totalPrice.toFixed(2) }}</strong>
          </span>
          <q-space />
          <q-btn flat dense color="primary" label="Изменить" :to="{ name: 'cart' }" />
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
import { computed, ref } from 'vue';
import OrderForm from 'components/OrderForm.vue';
import { useCartStore } from 'src/stores/cart-store';

const cartStore = useCartStore();

// Извлекаем товары из cart store для передачи в OrderForm как props
const cartItems = computed(() => cartStore.items.map((i) => i.product));

// ============================================================
// ЧЕРНОВИК — проверяем, есть ли сохранённые данные формы.
// Показываем баннер с кнопкой «Начать заново».
// ============================================================
const hasDraft = ref(!!localStorage.getItem('otus-pwa-order-form'));

function clearDraft() {
  localStorage.removeItem('otus-pwa-order-form');
  localStorage.removeItem('otus-pwa-order-step');
  hasDraft.value = false;
  window.location.reload();
}
</script>
