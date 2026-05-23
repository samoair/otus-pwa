<!--
  TaskList.vue — компонент для работы со списком задач.
  Демонстрирует:
  - ref() с типизированными массивами
  - computed() для фильтрации и подсчёта
  - v-model на чекбоксах (изменение свойства объекта в реактивном массиве)
  - @keyup.enter — модификатор события клавиатуры
-->
<template>
  <q-card flat bordered class="q-pa-md">
    <q-card-section>
      <div class="text-h6">Список задач (реактивные массивы + computed)</div>
      <div class="text-caption text-grey">
        Фильтрация и подсчёты — через computed(). При добавлении/удалении
        задачи производные значения пересчитываются автоматически.
      </div>
    </q-card-section>

    <q-card-section>
      <!--
        Строка ввода новой задачи.
        v-model="newTask" — связывает input с ref().
        @keyup.enter="addTask" — модификатор .enter: функция вызывается
        только при нажатии Enter (а не при каждом нажатии клавиши).
      -->
      <div class="row q-gutter-sm q-mb-md">
        <q-input
          v-model="newTask"
          placeholder="Добавить задачу..."
          dense
          outlined
          class="col"
          @keyup.enter="addTask"
        />
        <!-- :disable — кнопка отключена, если строка пустая -->
        <q-btn color="primary" icon="add" @click="addTask" :disable="!newTask.trim()" />
      </div>

      <!--
        q-select для фильтрации.
        v-model="filter" связан с ref('all').
        При изменении выбора filteredTasks (computed) пересчитывается.
      -->
      <q-select
        v-model="filter"
        :options="filterOptions"
        label="Фильтр"
        dense
        outlined
        class="q-mb-sm"
        style="max-width: 200px"
      />

      <!--
        v-for по отфильтрованному списку.
        :key="task.id" — уникальный ключ для каждого элемента.
        Vue использует key чтобы понять, какие элементы добавились,
        удалились или переместились. Без key Vue перерисовывает
        весь список при любом изменении.
      -->
      <q-list bordered separator>
        <q-item v-for="task in filteredTasks" :key="task.id">
          <!--
            v-model="task.done" — двустороннее связывание с boolean.
            Когда пользователь ставит/снимает галочку, task.done
            обновляется. Это запускает перерисовку, и computed
            (filteredTasks, doneCount, pendingCount) пересчитываются.
          -->
          <q-item-section side>
            <q-checkbox v-model="task.done" />
          </q-item-section>
          <q-item-section>
            <!--
              Динамический класс через объектный синтаксис.
              { 'text-strike': task.done } означает:
              класс text-strike применяется, когда task.done === true.
            -->
            <q-item-label :class="{ 'text-strike': task.done }">
              {{ task.text }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round icon="delete" color="negative" size="sm" @click="removeTask(task.id)" />
          </q-item-section>
        </q-item>

        <!-- Показываем заглушку, если отфильтрованный список пуст -->
        <q-item v-if="filteredTasks.length === 0">
          <q-item-section class="text-grey text-center">
            Задачи не найдены
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Производные значения из computed() -->
      <div class="q-mt-sm text-caption text-grey">
        Всего: {{ totalCount }} | Выполнено: {{ doneCount }} | В работе: {{ pendingCount }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// ============================================================
// TypeScript-интерфейс для типизации элемента списка.
// Определяет «форму» объекта задачи — какие поля у него есть
// и какого они типа. Компилятор проверяет, что мы не обращаемся
// к несуществующим полям или не передаём неправильные типы.
// ============================================================
interface Task {
  id: number;
  text: string;
  done: boolean;
}

// ============================================================
// ref<Task[]>([]) — типизированный реактивный массив.
//
// Почему не reactive()? ref() универсальнее:
//   - ref() можно переназначить целиком: tasks.value = [...newTasks]
//   - reactive() нельзя — потеряет реактивность при переназначении
//   - ref() работает с примитивами, объектами, массивами
//   - reactive() только с объектами и массивами
//
// Поэтому в Composition API ref() — «дефолтный» выбор.
// ============================================================
const tasks = ref<Task[]>([
  { id: 1, text: 'Изучить основы Vite', done: true },
  { id: 2, text: 'Разобраться в quasar.config.ts', done: false },
  { id: 3, text: 'Попрактиковать Composition API', done: false },
]);

const newTask = ref('');
const filter = ref('all');
const filterOptions = ['Все', 'В работе', 'Выполнены'];

// Счётчик для генерации уникальных id.
// Не оборачиваем в ref — он используется только в скрипте,
// не нужен в шаблоне, реактивность не требуется.
let nextId = 4;

// ============================================================
// computed() — основа «производных» данных.
//
// filteredTasks пересчитывается, только когда меняется tasks или filter.
// Если пользователь кликает по странице, скроллит, вводит текст в
// другие поля — computed НЕ пересчитывается. Это и есть кеширование.
//
// Для сравнения: если бы это был method в Options API:
//   methods: { filteredTasks() { ... } }
// он бы вызывался при КАЖДОЙ перерисовке компонента,
// даже если данные не изменились.
// ============================================================
const filteredTasks = computed(() => {
  switch (filter.value) {
    case 'В работе':
      return tasks.value.filter((t) => !t.done);
    case 'Выполнены':
      return tasks.value.filter((t) => t.done);
    default:
      return tasks.value;
  }
});

const totalCount = computed(() => tasks.value.length);
const doneCount = computed(() => tasks.value.filter((t) => t.done).length);
const pendingCount = computed(() => tasks.value.filter((t) => !t.done).length);

// Добавление задачи: push мутирует массив.
// Vue отслеживает мутации реактивных массивов (push, pop, splice, sort...)
// и автоматически запускает перерисовку.
function addTask() {
  const text = newTask.value.trim();
  if (!text) return;
  tasks.value.push({ id: nextId++, text, done: false });
  newTask.value = '';
}

// Удаление: фильтр создаёт новый массив, который присваивается в .value.
// Это тоже отслеживается — ref() реагирует на присвоение нового значения.
function removeTask(id: number) {
  tasks.value = tasks.value.filter((t) => t.id !== id);
}
</script>
