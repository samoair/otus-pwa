// Cart Store — Pinia store в setup-стиле.
// Разделяемое состояние корзины между всеми страницами.
// В ДЗ 3-4 корзина была ref() внутри компонента — работало,
// но данные терялись при навигации. Pinia store решает это.

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Product } from 'src/services/product/productModels';

export interface CartItem {
  product: Product;
  quantity: number;
}

export const useCartStore = defineStore('cart', () => {
  // ============================================================
  // ref() — реактивное состояние хранилища
  // ============================================================
  const items = ref<CartItem[]>([]);

  // ============================================================
  // computed() — производные данные (кешируются)
  // ============================================================

  /** Общее количество товаров (с учётом quantity) */
  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  );

  /** Общая стоимость корзины */
  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );

  /** ID товаров в корзине — для быстрой проверки inCart */
  const productIds = computed(() =>
    items.value.map((item) => item.product.id),
  );

  // ============================================================
  // Действия (methods)
  // ============================================================

  /**
   * Добавить товар в корзину. Если уже есть — увеличить quantity.
   * ДЗ 5: возможность добавлять несколько копий одного товара.
   */
  function addToCart(product: Product) {
    const existing = items.value.find((item) => item.product.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      items.value.push({ product, quantity: 1 });
    }
  }

  /** Уменьшить quantity на 1. Если стало 0 — удалить */
  function decreaseQuantity(productId: number) {
    const item = items.value.find((i) => i.product.id === productId);
    if (!item) return;
    item.quantity--;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    }
  }

  /** Удалить товар из корзины полностью */
  function removeFromCart(productId: number) {
    items.value = items.value.filter((i) => i.product.id !== productId);
  }

  /** Очистить корзину */
  function clearCart() {
    items.value = [];
  }

  /** Проверить, есть ли товар в корзине */
  function isInCart(productId: number): boolean {
    return productIds.value.includes(productId);
  }

  return {
    items,
    totalItems,
    totalPrice,
    productIds,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    isInCart,
  };
});
