import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useProductsStore } from '@/stores/products-store';

// Мокаем ProductService — в юнит-тестах не делаем реальные HTTP-запросы
const mockGetAll = vi.fn().mockResolvedValue([
  { id: 1, title: 'Товар 1', price: 100, description: 'Описание 1', category: 'электроника', image: 'img1.jpg', rating: { rate: 4, count: 10 } },
  { id: 2, title: 'Товар 2', price: 200, description: 'Описание 2', category: 'одежда', image: 'img2.jpg', rating: { rate: 3, count: 5 } },
  { id: 3, title: 'Товар 3', price: 150, description: 'Описание 3', category: 'электроника', image: 'img3.jpg', rating: { rate: 5, count: 20 } },
]);

vi.mock('@/services/product/productService', () => ({
  default: function () {
    return { getAll: mockGetAll };
  },
}));

describe('ProductsStore', () => {
  let store: ReturnType<typeof useProductsStore>;

  beforeEach(() => {
    store = useProductsStore();
    store.resetFilters();
  });

  it('инициализируется с пустым списком товаров', () => {
    expect(store.products).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('загружает товары через fetchProducts', async () => {
    await store.fetchProducts();

    expect(store.products).toHaveLength(3);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('вычисляет уникальные категории', async () => {
    await store.fetchProducts();

    expect(store.categories).toEqual(['одежда', 'электроника']);
  });

  it('фильтрует по категории', async () => {
    await store.fetchProducts();
    store.filters.category = 'электроника';

    expect(store.filteredProducts).toHaveLength(2);
    expect(store.filteredProducts.every((p) => p.category === 'электроника')).toBe(true);
  });

  it('фильтрует по поисковому запросу', async () => {
    await store.fetchProducts();
    store.filters.searchQuery = 'Товар 1';

    expect(store.filteredProducts).toHaveLength(1);
    expect(store.filteredProducts[0].title).toBe('Товар 1');
  });

  it('сортирует по цене (возрастание)', async () => {
    await store.fetchProducts();
    store.filters.sortBy = 'price-asc';

    const prices = store.filteredProducts.map((p) => p.price);
    expect(prices).toEqual([100, 150, 200]);
  });

  it('сортирует по цене (убывание)', async () => {
    await store.fetchProducts();
    store.filters.sortBy = 'price-desc';

    const prices = store.filteredProducts.map((p) => p.price);
    expect(prices).toEqual([200, 150, 100]);
  });

  it('вычисляет totalPrice отфильтрованных товаров', async () => {
    await store.fetchProducts();

    expect(store.totalPrice).toBe(450);
  });

  it('добавляет товар в начало списка через addProduct', async () => {
    await store.fetchProducts();

    store.addProduct({
      id: 99,
      title: 'Новый товар',
      price: 999,
      description: '',
      category: 'новая',
      image: '',
      rating: { rate: 0, count: 0 },
    });

    expect(store.products).toHaveLength(4);
    expect(store.products[0].id).toBe(99);
  });

  it('сбрасывает все фильтры', async () => {
    await store.fetchProducts();
    store.filters.category = 'электроника';
    store.filters.searchQuery = 'тест';
    store.filters.sortBy = 'price-asc';
    store.filters.priceMin = 50;
    store.filters.priceMax = 500;

    store.resetFilters();

    expect(store.filters.category).toBe('');
    expect(store.filters.searchQuery).toBe('');
    expect(store.filters.sortBy).toBe('default');
    expect(store.filters.priceMin).toBeNull();
    expect(store.filters.priceMax).toBeNull();
  });
});
