// useProducts — composable-обёртка над ProductsStore (ДЗ 6 + ДЗ 10).
//
// ДЗ 10: явный возвращаемый тип UseProductsReturn
//
// ВАЖНО: storeToRefs() обязателен для сохранения реактивности.
// Без него store.products возвращает обычный массив (captured at setup time),
// и изменения в store не отображаются в DOM.

import { onMounted, onUnmounted } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { storeToRefs } from 'pinia';
import { useProductsStore } from 'src/stores/products-store';
import type { Product } from 'src/services/product/productModels';

/** Возвращаемый тип composable — явно описывает все поля */
export interface UseProductsReturn {
  products: Ref<Product[]>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  filters: Ref<{
    category: string;
    searchQuery: string;
    sortBy: string;
    priceMin: number | null;
    priceMax: number | null;
  }>;
  categories: ComputedRef<string[]>;
  filteredProducts: ComputedRef<Product[]>;
  totalPrice: ComputedRef<number>;
  fetchProducts: () => Promise<void>;
  resetFilters: () => void;
}

export function useProducts(): UseProductsReturn {
  const store = useProductsStore();

  const { products, loading, error, filters, categories, filteredProducts, totalPrice } =
    storeToRefs(store);

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
