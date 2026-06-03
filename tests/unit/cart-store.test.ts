import { describe, it, expect, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { useCartStore } from '@/stores/cart-store';

describe('CartStore', () => {
  let cartStore: ReturnType<typeof useCartStore>;

  beforeEach(() => {
    cartStore = useCartStore();
    // Clear state before each test
    cartStore.clearCart();
  });

  it('should initialize with empty cart', () => {
    expect(cartStore.items).toEqual([]);
    expect(cartStore.totalItems).toBe(0);
    expect(cartStore.totalPrice).toBe(0);
  });

  it('should add product to cart', () => {
    const mockProduct = {
      id: 1,
      title: 'Test Product',
      price: 10.99,
      description: 'Test',
      category: 'electronics',
      image: 'test.jpg',
      rating: { rate: 5, count: 1 },
    };

    cartStore.addToCart(mockProduct);

    expect(cartStore.items).toHaveLength(1);
    expect(cartStore.items[0].product.id).toBe(1);
    expect(cartStore.items[0].quantity).toBe(1);
    expect(cartStore.totalItems).toBe(1);
    expect(cartStore.totalPrice).toBe(10.99);
  });

  it('should increase quantity when adding existing product', () => {
    const mockProduct = {
      id: 1,
      title: 'Test Product',
      price: 10.99,
      description: 'Test',
      category: 'electronics',
      image: 'test.jpg',
      rating: { rate: 5, count: 1 },
    };

    cartStore.addToCart(mockProduct);
    cartStore.addToCart(mockProduct);

    expect(cartStore.items).toHaveLength(1);
    expect(cartStore.items[0].quantity).toBe(2);
    expect(cartStore.totalItems).toBe(2);
    expect(cartStore.totalPrice).toBe(21.98);
  });

  it('should decrease quantity and remove if 0', () => {
    const mockProduct = {
      id: 1,
      title: 'Test Product',
      price: 10.99,
      description: 'Test',
      category: 'electronics',
      image: 'test.jpg',
      rating: { rate: 5, count: 1 },
    };

    cartStore.addToCart(mockProduct);
    cartStore.addToCart(mockProduct);
    cartStore.decreaseQuantity(1);

    expect(cartStore.items).toHaveLength(1);
    expect(cartStore.items[0].quantity).toBe(1);
    expect(cartStore.totalItems).toBe(1);
    expect(cartStore.totalPrice).toBe(10.99);

    cartStore.decreaseQuantity(1);
    expect(cartStore.items).toHaveLength(0);
    expect(cartStore.totalItems).toBe(0);
  });

  it('should remove product from cart', () => {
    const product1 = {
      id: 1,
      title: 'Product 1',
      price: 10,
      description: '',
      category: '',
      image: '',
      rating: { rate: 0, count: 0 },
    };
    const product2 = {
      id: 2,
      title: 'Product 2',
      price: 20,
      description: '',
      category: '',
      image: '',
      rating: { rate: 0, count: 0 },
    };

    cartStore.addToCart(product1);
    cartStore.addToCart(product2);
    cartStore.removeFromCart(1);

    expect(cartStore.items).toHaveLength(1);
    expect(cartStore.items[0].product.id).toBe(2);
    expect(cartStore.totalItems).toBe(1);
    expect(cartStore.totalPrice).toBe(20);
  });

  it('should clear cart', () => {
    const mockProduct = {
      id: 1,
      title: 'Test Product',
      price: 10.99,
      description: 'Test',
      category: 'electronics',
      image: 'test.jpg',
      rating: { rate: 5, count: 1 },
    };

    cartStore.addToCart(mockProduct);
    cartStore.clearCart();

    expect(cartStore.items).toHaveLength(0);
    expect(cartStore.totalItems).toBe(0);
    expect(cartStore.totalPrice).toBe(0);
  });

  it('should check if product is in cart', () => {
    const mockProduct = {
      id: 1,
      title: 'Test Product',
      price: 10.99,
      description: 'Test',
      category: 'electronics',
      image: 'test.jpg',
      rating: { rate: 5, count: 1 },
    };

    expect(cartStore.isInCart(1)).toBe(false);
    cartStore.addToCart(mockProduct);
    expect(cartStore.isInCart(1)).toBe(true);
    expect(cartStore.isInCart(999)).toBe(false);
  });
});