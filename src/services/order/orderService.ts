// Сервис отправки заказа на echo-сервер httpbin.org.
// Паттерн как в kir-pwa-en: класс-сервис с методами для HTTP-запросов.
// В реальном приложении здесь был бы axios с interceptors,
// но для ДЗ достаточно fetch — меньше зависимостей.

import type { OrderFormData, HttpbinResponse } from '../product/productModels';

export default class OrderService {
  private echoUrl = 'https://httpbin.org/post';

  /**
   * Отправить заказ на echo-сервер.
   * httpbin.org/post возвращает отправленные данные обратно —
   * это позволяет проверить, что запрос собран правильно.
   *
   * В реальном приложении здесь был бы POST к /api/orders
   * с авторизацией, обработкой статусов и т.д.
   */
  async submitOrder(order: OrderFormData): Promise<HttpbinResponse> {
    const response = await fetch(this.echoUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}
