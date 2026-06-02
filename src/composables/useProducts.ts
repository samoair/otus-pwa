// useProducts — composable-обёртка над ProductsStore (ДЗ 6).
//
// ДЗ 3-4: вся логика была здесь (ref, reactive, computed, lifecycle).
// ДЗ 6: логика перенесена в Pinia store, а composable сохраняет
// обратную совместимость — компоненты не нужно переписывать.
//
// Это демонстрирует эволюцию архитектуры:
// composable → Pinia store → composable как thin wrapper.

import { onMounted, onUnmounted } from 'vue';
import { useProductsStore } from 'src/stores/products-store';

export function useProducts() {
  const store = useProductsStore();

  // lifecycle — вызываем загрузку при монтировании компонента
  onMounted(() => {
    if (store.products.length === 0) {
      store.fetchProducts();
    }
  });

  onUnmounted(() => {
    store.abort();
  });

  return {
    products: store.products,
    loading: store.loading,
    error: store.error,
    filters: store.filters,
    categories: store.categories,
    filteredProducts: store.filteredProducts,
    totalPrice: store.totalPrice,
    fetchProducts: store.fetchProducts,
    resetFilters: store.resetFilters,
  };
}
