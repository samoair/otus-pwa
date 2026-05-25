<!--
  BenchVdom.vue — бенчмарк на Virtual DOM.
  Обычный <script setup> — компилируется в render-функцию с VNode.
  При каждом изменении items Vue создаёт новое VNode-дерево,
  сравнивает (diff) с предыдущим и патчит DOM.
-->
<script setup lang="ts">
import { useBenchmark } from './useBenchmark';
import type { BenchResult } from './useBenchmark';

const { items, generate, updateOne, updateAll, shuffle } = useBenchmark();

defineExpose({ items, generate, updateOne, updateAll, shuffle });
</script>

<template>
  <div class="bench-list">
    <div v-for="item in items" :key="item.id" class="bench-item">
      {{ item.value }}
    </div>
    <div v-if="items.length === 0" class="bench-empty">Нажмите «Запустить»</div>
  </div>
</template>

<style scoped>
.bench-list {
  height: 200px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 4px;
}
.bench-item {
  font-size: 12px;
  padding: 2px 4px;
  font-family: monospace;
}
.bench-empty {
  color: #999;
  text-align: center;
  padding: 40px 0;
}
</style>
