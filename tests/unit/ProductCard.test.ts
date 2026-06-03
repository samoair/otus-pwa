import { describe, it, expect, vi } from 'vitest';
import ProductCard from '@/components/ProductCard.vue';
import type { Product } from '@/services/product/productModels';
import { mount } from '../unit/setup';

describe('ProductCard.vue', () => {
  it('emits toggleCart event when Add/Remove button is clicked', async () => {
    const mockProduct: Product = {
      id: 123,
      title: 'Test Product',
      price: 29.99,
      description: 'Test description',
      category: 'electronics',
      image: 'test.jpg',
      rating: { rate: 4.5, count: 10 },
    };

    const onToggleCart = vi.fn();

    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
        inCart: false,
        // Vue 3 maps onToggleCart → @toggle-cart event listener
        onToggleCart,
      },
    });

    const button = wrapper.getByRole('button', { name: /в корзину/i });
    await button.click();

    expect(onToggleCart).toHaveBeenCalledWith(123);
  });

  it('emits toggleCart event when removing from cart', async () => {
    const mockProduct: Product = {
      id: 456,
      title: 'Test Product',
      price: 29.99,
      description: 'Test description',
      category: 'electronics',
      image: 'test.jpg',
      rating: { rate: 4.5, count: 10 },
    };

    const onToggleCart = vi.fn();

    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
        inCart: true,
        onToggleCart,
      },
    });

    const button = wrapper.getByRole('button', { name: /убрать/i });
    await button.click();

    expect(onToggleCart).toHaveBeenCalledWith(456);
  });

  it('displays product title and price correctly', () => {
    const mockProduct: Product = {
      id: 789,
      title: 'Test Product',
      price: 49.99,
      description: 'Test description',
      category: 'electronics',
      image: 'test.jpg',
      rating: { rate: 4.5, count: 10 },
    };

    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
        inCart: false,
      },
    });

    expect(wrapper.getByText('$49.99')).toBeDefined();
    expect(wrapper.getByText('Test Product')).toBeDefined();
  });
});
