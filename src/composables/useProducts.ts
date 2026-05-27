// ============================================================
// useProducts — composable (custom hook) для работы со списком товаров.
//
// Composable — это функция, которая инкапсулирует реактивное состояние
// и логику, повторно используемую в разных компонентах.
// Аналог custom hooks в React, но на основе Vue reactivity.
//
// Этот composable демонстрирует:
// - ref()        — для простых реактивных значений (products, loading, error)
// - reactive()   — для объекта с фильтрами (все свойства реактивны)
// - computed()   — для производных данных (фильтрованный список, категории)
// - onMounted()  — lifecycle hook для загрузки данных при появлении компонента
// - onUnmounted() — cleanup при уничтожении компонента
// ============================================================

import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import type { Product } from 'src/services/product/productModels';
import ProductService from 'src/services/product/productService';

export function useProducts() {
  // ============================================================
  // ref() — для одиночных реактивных значений
  // Каждое изменение .value вызывает перерисовку зависимых участков.
  // ============================================================
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Счётчик активных запросов — для отписки при размонтировании
  let aborted = false;

  // ============================================================
  // reactive() — для объектов с несколькими свойствами
  // Все свойства объекта автоматически реактивны.
  // Не нужен .value — обращаемся напрямую: filters.category
  //
  // Когда использовать reactive vs ref:
  // - reactive() — удобно для форм, фильтров, конфигураций
  //   (много свойств, обращение без .value)
  // - ref() — универсальный вариант, работает с примитивами
  //   и при переназначении (x.value = newY)
  // ============================================================
  const filters = reactive({
    category: '',      // '' = все категории
    searchQuery: '',   // поиск по названию
    sortBy: 'default', // default | price-asc | price-desc | rating
    showDetails: false, // показывать ли описание (v-show)
  });

  // ============================================================
  // computed() — производные данные с кешированием
  // Пересчитывается только когда меняются зависимости.
  // ============================================================

  /** Список уникальных категорий из загруженных товаров */
  const categories = computed(() => {
    const cats = new Set(products.value.map((p) => p.category));
    return Array.from(cats).sort();
  });

  /** Товары после фильтрации и сортировки */
  const filteredProducts = computed(() => {
    let result = [...products.value];

    // Фильтр по категории
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    // Фильтр по поиску (название или описание)
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    // Сортировка
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
  // Асинхронная загрузка данных
  // ============================================================
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
  }

  // ============================================================
  // Lifecycle methods — методы жизненного цикла компонента
  //
  // onMounted() — вызывается после вставки компонента в DOM.
  //   Идеальное место для загрузки данных с сервера:
  //   - DOM готов (можно измерять размеры элементов)
  //   - Пользователь видит загрузку → не ждёт в пустоте
  //
  // onUnmounted() — вызывается перед удалением компонента.
  //   Здесь отменяем запросы, очищаем таймеры и т.д.
  //   Без cleanup: если компонент удалён до завершения fetch,
  //   попытка записать в ref вызовет warning (или утечку памяти).
  // ============================================================
  onMounted(() => {
    fetchProducts();
  });

  onUnmounted(() => {
    aborted = true;
  });

  return {
    // Состояние
    products,
    loading,
    error,
    filters,

    // Computed
    categories,
    filteredProducts,
    totalPrice,

    // Методы
    fetchProducts,
    resetFilters,
  };
}
