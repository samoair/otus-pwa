import { describe, it, expect, beforeEach } from 'vitest';
import { useCounterStore } from '@/stores/counter-store';

describe('CounterStore', () => {
  let store: ReturnType<typeof useCounterStore>;

  beforeEach(() => {
    store = useCounterStore();
    store.reset();
  });

  it('инициализируется с нулём', () => {
    expect(store.count).toBe(0);
    expect(store.step).toBe(1);
    expect(store.history).toEqual([]);
  });

  it('increment увеличивает count на step', () => {
    store.setStep(3);
    store.increment();

    expect(store.count).toBe(3);
    expect(store.history).toEqual([3]);
  });

  it('decrement уменьшает count на step', () => {
    store.setStep(2);
    store.decrement();

    expect(store.count).toBe(-2);
    expect(store.history).toEqual([-2]);
  });

  it('doubleCount — удвоенное значение', () => {
    store.increment();
    store.increment();

    expect(store.doubleCount).toBe(4);
  });

  it('isPositive / isNegative — знаки count', () => {
    expect(store.isPositive).toBe(false);
    expect(store.isNegative).toBe(false);

    store.increment();
    expect(store.isPositive).toBe(true);

    store.decrement();
    store.decrement();
    expect(store.isNegative).toBe(true);
  });

  it('reset обнуляет count и историю', () => {
    store.increment();
    store.increment();

    store.reset();

    expect(store.count).toBe(0);
    expect(store.history).toEqual([]);
  });

  it('setStep не допускает значения меньше 1', () => {
    store.setStep(0);
    expect(store.step).toBe(1);

    store.setStep(-5);
    expect(store.step).toBe(1);

    store.setStep(5);
    expect(store.step).toBe(5);
  });
});
