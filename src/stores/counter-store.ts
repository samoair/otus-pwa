// ============================================================
// counter-store.ts — Pinia store в стиле Composition API.
//
// Два стиля создания store в Pinia:
//   1. Options API (аналог Vue Options API):
//      defineStore('counter', { state, getters, actions })
//
//   2. Setup/Composition API (используется здесь):
//      defineStore('counter', () => { ... })
//      Внутри используются ref() и computed() — те же примитивы,
//      что и в обычных компонентах.
//
// Setup-стиль предпочтительнее, потому что:
//   - одинаковые паттерны в компонентах и store
//   - можно выносить общую логику в composable-функции
//   - гибкость: можно использовать watch, onMounted и т.д.
// ============================================================

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCounterStore = defineStore('counter', () => {
  // ============================================================
  // СОСТОЯНИЕ (state) — через ref()
  //
  // Каждый ref() здесь — отдельное поле состояния.
  // Pinia автоматически «подхватывает» все ref'ы из return
  // и делает их доступными как store.count, store.step и т.д.
  // ============================================================
  const count = ref(0);
  const step = ref(1);
  const history = ref<number[]>([]);  // типизированный ref: массив чисел

  // ============================================================
  // ГЕТТЕРЫ (getters) — через computed()
  //
  // Анаалог computed() в компонентах: кешируются, пересчитываются
  // только при изменении зависимостей. В store доступны как свойства:
  // store.doubleCount, store.isPositive и т.д.
  // ============================================================
  const doubleCount = computed(() => count.value * 2);
  const isPositive = computed(() => count.value > 0);
  const isNegative = computed(() => count.value < 0);
  const historyLength = computed(() => history.value.length);

  // ============================================================
  // ДЕЙСТВИЯ (actions) — обычные функции
  //
  // Actions — единственное место, где разрешено менять state.
  // В отличие от Redux, Pinia не требует immutability —
  // можно напрямую менять count.value, push'ить в массив и т.д.
  // Pinia перехватывает эти изменения и уведомляет подписчиков.
  //
  // Actions могут быть async — для работы с API.
  // ============================================================
  function increment() {
    count.value += step.value;
    history.value.push(count.value);
  }

  function decrement() {
    count.value -= step.value;
    history.value.push(count.value);
  }

  function reset() {
    count.value = 0;
    history.value = [];
  }

  function setStep(newStep: number) {
    step.value = Math.max(1, newStep);
  }

  // ============================================================
  // ВАЖНО: всё, что не возвращено — приватное.
  //
  // Функция setup в Pinia работает как замыкание.
  // Только возвращённые значения доступны извне через store.
  // Можно создать внутренние переменные и вспомогательные функции,
  // которые не будут видны за пределами store.
  // ============================================================
  return {
    count,
    step,
    history,
    doubleCount,
    isPositive,
    isNegative,
    historyLength,
    increment,
    decrement,
    reset,
    setStep,
  };
});
