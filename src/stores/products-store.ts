// Products Store — Pinia store для каталога товаров (ДЗ 6).
//
// Переносим логику из composable useProducts в Pinia store.
// Теперь данные каталога — глобальное состояние приложения,
// доступное из любого компонента без prop-drilling.
//
// Демонстрирует:
// - ref() — products, loading, error
// - reactive() — filters (объект с несколькими свойствами)
// - computed() — filteredProducts, categories, totalPrice
// - onMounted/onUnmounted через lifecycle в компонентах
// - actions — fetchProducts, resetFilters, addProduct

import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import type { Product } from 'src/services/product/productModels';
import ProductService from 'src/services/product/productService';

export const useProductsStore = defineStore('products', () => {
  // ============================================================
  // ref() — простые реактивные значения
  // ============================================================
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Счётчик для отмены запросов при размонтировании
  let aborted = false;

  // ============================================================
  // reactive() — объект фильтров, все свойства реактивны
  // ============================================================
  const filters = reactive({
    category: '',
    searchQuery: '',
    sortBy: 'default',
    priceMin: null as number | null,
    priceMax: null as number | null,
  });

  // ============================================================
  // computed() — производные данные с кешированием
  // ============================================================

  /** Уникальные категории из загруженных товаров */
  const categories = computed(() => {
    const cats = new Set(products.value.map((p) => p.category));
    return Array.from(cats).sort();
  });

  /** Товары после фильтрации и сортировки */
  const filteredProducts = computed(() => {
    let result = [...products.value];

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    if (filters.priceMin !== null) {
      result = result.filter((p) => p.price >= (filters.priceMin ?? 0));
    }
    if (filters.priceMax !== null) {
      result = result.filter((p) => p.price <= (filters.priceMax ?? Infinity));
    }

    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
    }

    return result;
  });

  /** Общая стоимость отфильтрованных товаров */
  const totalPrice = computed(() =>
    filteredProducts.value.reduce((sum, p) => sum + p.price, 0),
  );

  // ============================================================
  // Actions
  // ============================================================

  /** Загрузить товары из API */
  async function fetchProducts() {
    loading.value = true;
    error.value = null;
    try {
      const service = new ProductService();
      products.value = await service.getAll();
    } catch (err) {
      if (!aborted) {
        error.value = err instanceof Error ? err.message : 'Неизвестная ошибка';
      }
    } finally {
      if (!aborted) {
        loading.value = false;
      }
    }
  }

  /** Сбросить все фильтры */
  function resetFilters() {
    filters.category = '';
    filters.searchQuery = '';
    filters.sortBy = 'default';
    filters.priceMin = null;
    filters.priceMax = null;
  }

  /** Добавить товар (от создания через форму) */
  function addProduct(product: Product) {
    products.value.unshift(product);
  }

  /** Отмена при размонтировании */
  function abort() {
    aborted = true;
  }

  return {
    products,
    loading,
    error,
    filters,
    categories,
    filteredProducts,
    totalPrice,
    fetchProducts,
    resetFilters,
    addProduct,
    abort,
  };
});
