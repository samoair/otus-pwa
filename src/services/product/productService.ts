// Сервис для работы с API товаров.
// Паттерн как в pms-pwa: класс-сервис с методами для HTTP-запросов.
// В данном случае используем fetch вместо axios (нет зависимости от axios).

import type { Product } from './productModels';

export default class ProductService {
  private baseUrl = 'https://fakestoreapi.com';

  /** GET /products — возвращает все товары */
  async getAll(): Promise<Product[]> {
    const response = await fetch(`${this.baseUrl}/products`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  /** GET /products/:id — возвращает один товар */
  async getById(id: number): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/products/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  /** GET /products/categories — список категорий */
  async getCategories(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/products/categories`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * POST /products — создать новый товар (ДЗ 4).
   * fakestoreapi не сохраняет данные реально, но возвращает
   * объект с присвоенным id — этого достаточно для демонстрации.
   */
  async create(product: Omit<Product, 'id' | 'rating'>): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }
}
