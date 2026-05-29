// Типы данных для fakestoreapi.com/products
// Интерфейсы — аналог моделей из pms-pwa/src/services/

export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
}

// ============================================================
// ДЗ 4: типы для формы заказа
// Данные пользователя, адрес, оплата — всё в одном объекте.
// Zod-схема валидации определена рядом с формой (OrderForm.vue),
// а здесь — только TypeScript-интерфейс для аннотаций.
// ============================================================

export interface OrderAddress {
  city: string;
  street: string;
  house: string;
  apartment?: string;
}

export interface OrderPayment {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardHolder: string;
}

export interface OrderFormData {
  fio: string;
  email: string;
  birthDate: string;
  phone: string;
  address: OrderAddress;
  country: string;
  payment: OrderPayment;
  agreeTerms: boolean;
}

/** Ответ httpbin.org/post — echo-сервер возвращает то, что отправили */
export interface HttpbinResponse {
  args: Record<string, string>;
  data: string;
  files: Record<string, string>;
  form: Record<string, string>;
  headers: Record<string, string>;
  json: OrderFormData | null;
  origin: string;
  url: string;
}
