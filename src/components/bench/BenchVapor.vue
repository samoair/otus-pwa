<!--
  BenchVapor.vue — бенчмарк на Vapor Mode.

  <script setup vapor> — компилируется в прямые DOM-операции.
  При каждом изменении items Vue НЕ создаёт VNode-дерево.
  Вместо этого реактивные эффекты напрямую обновляют
  конкретные текстовые узлы и создают/удаляют DOM-элементы.

  Результат: нет overhead на создание JS-объектов (VNode),
  нет diff-алгоритма, меньше потребление памяти.
-->
<script setup vapor lang="ts">
import { useBenchmark } from './useBenchmark';

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
