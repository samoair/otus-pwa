<!--
  CartPage.vue — страница корзины (ДЗ 5).

  Демонстрирует:
  - Pinia store — общее состояние корзины
  - v-for — список товаров
  - computed — итоги
  - router-link — навигация к товару и чекауту
  - программная навигация — router.push
-->
<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">Корзина</div>

    <!-- Пустая корзина -->
    <div v-if="cartStore.items.length === 0" class="text-center q-pa-xl">
      <q-icon name="shopping_cart" size="64px" color="grey-5" />
      <div class="text-h6 text-grey q-mt-md">Корзина пуста</div>
      <div class="text-body2 text-grey-7 q-mb-md">Добавьте товары в каталоге</div>
      <q-btn color="primary" label="Перейти в каталог" :to="{ name: 'products' }" />
    </div>

    <!-- Список товаров -->
    <template v-else>
      <q-list bordered separator class="q-mb-md">
        <q-item v-for="item in cartStore.items" :key="item.product.id" class="q-py-md">
          <q-item-section avatar>
            <q-img
              :src="item.product.image"
              fit="contain"
              style="width: 60px; height: 60px"
              class="bg-grey-2 rounded-borders"
            />
          </q-item-section>

          <q-item-section>
            <!-- router-link — декларативная навигация к странице товара -->
            <router-link
              :to="{ name: 'product-detail', params: { id: item.product.id } }"
              class="text-subtitle2 text-grey-9"
              style="text-decoration: none"
            >
              {{ item.product.title }}
            </router-link>
            <div class="text-caption text-grey">${{ item.product.price.toFixed(2) }} за шт.</div>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center q-gutter-sm">
              <!-- Управление количеством -->
              <q-btn
                round
                dense
                flat
                icon="remove"
                size="sm"
                color="grey"
                @click="cartStore.decreaseQuantity(item.product.id)"
              />
              <q-badge color="primary" class="text-body2 q-pa-sm">
                {{ item.quantity }}
              </q-badge>
              <q-btn
                round
                dense
                flat
                icon="add"
                size="sm"
                color="primary"
                @click="cartStore.addToCart(item.product)"
              />
            </div>
          </q-item-section>

          <q-item-section side>
            <div class="text-subtitle2 text-weight-bold">
              ${{ (item.product.price * item.quantity).toFixed(2) }}
            </div>
          </q-item-section>

          <q-item-section side>
            <q-btn
              flat
              round
              dense
              icon="delete"
              color="negative"
              @click="cartStore.removeFromCart(item.product.id)"
            />
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Итого -->
      <q-card flat bordered class="bg-blue-1">
        <q-card-section class="row items-center">
          <div>
            <div class="text-body2">
              Товаров: <strong>{{ cartStore.totalItems }}</strong>
              · Сумма: <strong class="text-primary">${{ cartStore.totalPrice.toFixed(2) }}</strong>
            </div>
          </div>
          <q-space />
          <q-btn flat color="negative" label="Очистить корзину" @click="cartStore.clearCart()" class="q-mr-sm" />
          <!-- router-link — навигация к чекауту -->
          <q-btn color="positive" label="Оформить заказ" icon="shopping_bag" :to="{ name: 'order' }" />
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { useCartStore } from 'src/stores/cart-store';

const cartStore = useCartStore();
</script>
