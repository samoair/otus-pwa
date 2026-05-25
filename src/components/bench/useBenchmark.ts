// Общий composable для VDOM и Vapor бенчмарков.
// Оба компонента используют одну и ту же логику —
// разница только в режиме компиляции (VDOM vs Vapor).

import { ref, nextTick } from 'vue';

export interface BenchItem {
  id: number;
  value: number;
}

export interface BenchResult {
  label: string;
  time: string;
}

export function useBenchmark() {
  const items = ref<BenchItem[]>([]);
  let nextId = 0;

  async function generate(count: number): Promise<BenchResult> {
    nextId = 0;
    items.value = [];
    await nextTick();
    await nextTick();

    const start = performance.now();
    items.value = Array.from({ length: count }, () => ({
      id: nextId++,
      value: +(Math.random() * 100).toFixed(1),
    }));
    await nextTick();
    return { label: 'Создание', time: (performance.now() - start).toFixed(2) };
  }

  async function updateOne(): Promise<BenchResult> {
    await nextTick();
    await nextTick();

    const idx = Math.floor(Math.random() * items.value.length);
    const start = performance.now();
    items.value[idx] = { ...items.value[idx], value: +(Math.random() * 100).toFixed(1) };
    await nextTick();
    return { label: 'Обновление 1', time: (performance.now() - start).toFixed(2) };
  }

  async function updateAll(): Promise<BenchResult> {
    await nextTick();
    await nextTick();

    const start = performance.now();
    items.value = items.value.map((item) => ({
      ...item,
      value: +(Math.random() * 100).toFixed(1),
    }));
    await nextTick();
    return { label: 'Обновление всех', time: (performance.now() - start).toFixed(2) };
  }

  async function shuffle(): Promise<BenchResult> {
    await nextTick();
    await nextTick();

    const start = performance.now();
    const arr = [...items.value];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    items.value = arr;
    await nextTick();
    return { label: 'Перемешивание', time: (performance.now() - start).toFixed(2) };
  }

  return { items, generate, updateOne, updateAll, shuffle };
}
