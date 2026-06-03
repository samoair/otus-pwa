// useProducts — composable-обёртка над ProductsStore (ДЗ 6).
//
// ДЗ 3-4: вся логика была здесь (ref, reactive, computed, lifecycle).
// ДЗ 6: логика перенесена в Pinia store, а composable сохраняет
// обратную совместимость — компоненты не нужно переписывать.
//
// Это демонстрирует эволюцию архитектуры:
// composable → Pinia store → composable как thin wrapper.
//
// ВАЖНО: storeToRefs() обязателен для сохранения реактивности.
// Без него store.products возвращает обычный массив (captured at setup time),
// и изменения в store не отображаются в DOM.

import { onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useProductsStore } from 'src/stores/products-store';

export function useProducts() {
  const store = useProductsStore();

  // storeToRefs сохраняет реактивность Pinia state/getters при деструктуризации.
  // Без него return { products: store.products } захватит текущее значение ([])
  // и компонент не обновится при загрузке данных.
  const { products, loading, error, filters, categories, filteredProducts, totalPrice } =
    storeToRefs(store);

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
    products,
    loading,
    error,
    filters,
    categories,
    filteredProducts,
    totalPrice,
    fetchProducts: store.fetchProducts,
    resetFilters: store.resetFilters,
  };
}
