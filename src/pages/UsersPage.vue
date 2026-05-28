<!--
  UsersPage.vue — ДЗ 2: директивы Vue.

  Демонстрирует:
  - v-for   — рендеринг списка пользователей
  - v-if    — условный рендеринг (элемент создаётся/уничтожается)
  - v-show  — переключение видимости (display: none)
  - v-bind  — динамические атрибуты (классы, стили)
  - v-on    — обработка событий (клик, наведение мыши)
  - v-html  — вставка HTML-разметки

  VirtualDOM:
  Все эти директивы работают через VirtualDOM — Vue создаёт
  виртуальное дерево, сравнивает (diff) с предыдущим и применяет
  минимальные изменения к реальному DOM.

  Vapor Mode:
  Этот компонент написан в стиле, совместимом с Vapor Mode
  (только Composition API, только <script setup>).
  Для включения Vapor нужно заменить <script setup lang="ts">
  на <script setup vapor lang="ts"> — это потребует Vue 3.6+.
  Подробнее — на странице /vapor.

  Примечание: Vue 3.6 beta уже доступна, стабильный релиз ожидается
  в 2026. Включение Vapor Mode для этого компонента даст:
  - Прямые DOM-операции вместо VNode-создания
  - Tочечные обновления при hover (вместо полного re-render)
  - Меньший размер бандла (без VDOM-рантайма)
-->
<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">Пользователи — директивы Vue</div>
    <p class="text-body2 text-grey-7">
      Список пользователей, демонстрирующий основные директивы Vue. Каждая директива выделена в
      отдельный блок с объяснением.
    </p>

    <!-- ============================================================
         СЕКЦИЯ 1: v-on — обработка событий

         v-on — директива для прослушивания DOM-событий.
         Сокращённая запись: @event="handler"

         Здесь: @click переключает видимость списка.
         В Vapor Mode: обработчики событий привязываются напрямую
         к DOM-узлам, без промежуточного VDOM-слоя.
         ============================================================ -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6">v-on — управление событиями</div>
        <div class="text-caption text-grey q-mb-md">
          <code>@click</code> переключает видимость списка. <code>@mouseenter</code> /
          <code>@mouseleave</code> — подсветка карточки при наведении (см. ниже).
        </div>

        <!--
          @click="toggleList" — сокращение от v-on:click="toggleList".
          При клике вызывается функция toggleList(),
          которая меняет ref listVisible.value = !listVisible.value
        -->
        <div class="q-gutter-sm">
          <q-btn
            :color="listVisible ? 'negative' : 'positive'"
            :icon="listVisible ? 'visibility_off' : 'visibility'"
            @click="toggleList"
          >
            {{ listVisible ? 'Скрыть список' : 'Показать список' }}
          </q-btn>

          <!--
            Второй пример v-on: @keyup.enter — модификатор.
            Вызывается только при нажатии Enter, а не при каждой клавише.
          -->
          <q-input
            v-model="searchQuery"
            dense
            outlined
            placeholder="Поиск по имени... (Enter для сброса)"
            style="max-width: 300px; display: inline-block"
            @keyup.enter="searchQuery = ''"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </q-card-section>
    </q-card>

    <!-- ============================================================
         СЕКЦИЯ 2: v-show — переключение видимости

         v-show — скрывает/показывает элемент через CSS display: none.
         Элемент ВСЕГДА присутствует в DOM — просто невидим.

         Разница с v-if:
         - v-if: элемент создаётся и уничтожается (дороже при частом переключении)
         - v-show: элемент всегда в DOM, переключается только CSS (дешевле)

         Когда что использовать:
         - v-if — условие меняется редко (например, роль пользователя)
         - v-show — частое переключение (например, подсветка, раскрытие деталей)

         Здесь v-show подходит, потому что список скрывается/показывается
         часто, и пересоздавать все DOM-элементы каждый раз — неоптимально.
         ============================================================ -->
    <div v-show="listVisible">
      <div class="text-caption text-grey q-mb-sm">
        <code>v-show="listVisible"</code> — список всегда в DOM, переключается только CSS display.
        Inspect → видны скрытые элементы.
      </div>

      <!-- ============================================================
           СЕКЦИЯ 3: v-for — рендеринг списка

           v-for="(user, index) in filteredUsers" — директива цикла.
           Создаёт DOM-элемент для каждого элемента массива.

           :key="user.id" — ОБЯЗАТЕЛЬНЫЙ атрибут для v-for.
           Vue использует key для отслеживания идентичности элементов:
           - Без key: Vue пересоздаёт все элементы при любом изменении списка
           - С key: Vue переиспользует существующие DOM-элементы,
             только перемещает/добавляет/удаляет нужные

           В VirtualDOM: Vue создаёт VNode для каждого элемента списка,
           затем diff-алгоритм сравнивает VNodes по key.
           В Vapor Mode: каждый элемент связан с DOM напрямую через
           реактивные эффекты — diff не нужен.
           ============================================================ -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">
            v-for — список пользователей ({{ filteredUsers.length }} из {{ users.length }})
          </div>

          <!--
            Фильтры и переключатели для демонстрации v-if и v-show.
            toggleShowAge — включает/выключает отображение возраста (v-if)
            toggleShowEmail — включает/выключает email (v-show)
          -->
          <div class="row q-gutter-sm q-mb-md">
            <q-btn
              outline
              size="sm"
              :color="showAge ? 'positive' : 'grey'"
              @click="showAge = !showAge"
            >
              v-if: {{ showAge ? 'Скрыть возраст' : 'Показать возраст' }}
            </q-btn>
            <q-btn
              outline
              size="sm"
              :color="showEmail ? 'positive' : 'grey'"
              @click="showEmail = !showEmail"
            >
              v-show: {{ showEmail ? 'Скрыть email' : 'Показать email' }}
            </q-btn>
            <q-btn outline size="sm" color="purple" @click="highlightAll = !highlightAll">
              v-bind: {{ highlightAll ? 'Убрать подсветку' : 'Подсветить всех' }}
            </q-btn>
          </div>

          <!-- ОСНОВНОЙ v-for -->
          <div class="row q-col-gutter-md">
            <div
              v-for="(user, index) in filteredUsers"
              :key="user.id"
              class="col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <!--
                СЕКЦИЯ 4: v-bind — динамическая привязка атрибутов

                v-bind — директива для динамической привязки значений атрибутов.
                Сокращённая запись: :attr="expression"

                Здесь используется:
                :class — динамический CSS-класс (объектный синтаксис)
                :style — инлайн-стиль (вычисляется из данных)
                :color — атрибут Quasar-компонента

                При наведении мыши (mouseenter/mouseleave) hoveredId
                обновляется, что вызывает пересчёт :class и :style
                для данной карточки.

                В VirtualDOM: весь шаблон перерисовывается при hover,
                создаётся новое VNode-дерево, diff находит изменённый
                класс и обновляет только его.
                В Vapor Mode: только эффект, привязанный к :class
                конкретной карточки, выполнит одно DOM-обновление.
                ============================================================ -->
              <q-card
                flat
                bordered
                class="user-card full-height cursor-pointer"
                :class="{
                  'user-card--hovered': hoveredId === user.id,
                  'user-card--highlighted': highlightAll,
                }"
                :style="{
                  borderLeftColor: hoveredId === user.id ? user.color : 'transparent',
                  borderLeftWidth: hoveredId === user.id ? '4px' : '4px',
                }"
                @mouseenter="hoveredId = user.id"
                @mouseleave="hoveredId = null"
              >
                <q-card-section>
                  <!-- v-bind:color — динамический цвет аватара -->
                  <div class="row items-center q-mb-sm">
                    <q-avatar :color="user.color" text-color="white" size="32px" class="q-mr-sm">
                      {{ user.name.charAt(0) }}
                    </q-avatar>
                    <div>
                      <!--
                        :style — инлайн-стиль через объектный синтаксис.
                        colour вычисляется из role.
                      -->
                      <div
                        class="text-subtitle2"
                        :style="{ color: hoveredId === user.id ? user.color : '' }"
                      >
                        {{ user.name }}
                      </div>
                      <div class="text-caption text-grey">{{ user.role }}</div>
                    </div>
                    <q-space />
                    <!--
                      v-bind:class — динамический класс для статуса.
                      Используем объектный синтаксис:
                      { 'class-name': booleanExpression }
                    -->
                    <q-badge
                      :class="{
                        'bg-positive': user.status === 'online',
                        'bg-grey': user.status === 'offline',
                        'bg-warning': user.status === 'busy',
                      }"
                    >
                      {{ user.status }}
                    </q-badge>
                  </div>

                  <!--
                    СЕКЦИЯ 5: v-if — условный рендеринг

                    v-if — элемент создаётся в DOM только если условие true.
                    При false — элемент полностью удаляется из DOM.

                    v-else-if / v-else — цепочки условий (как if/else if/else).

                    Разница с v-show (важно для понимания VirtualDOM):
                    - v-if:   DOM-элемент создаётся/уничтожается.
                              Дороже при частом переключении, но не занимает
                              память когда скрыт.
                    - v-show: DOM-элемент всегда существует, display: none.
                              Дешевле при переключении, но занимает память.

                    В VirtualDOM: Vue сравнивает старое и новое VNode-дерево.
                    Если v-if переключился с true на false, diff находит
                    что узёл удалён и генерирует DOM-операцию удаления.
                    В Vapor Mode: эффект привязан к условию — при false
                    DOM-узел удаляется напрямую, без diff.
                  -->
                  <div v-if="showAge" class="text-body2 q-mb-xs">
                    <q-icon name="cake" size="xs" class="q-mr-xs" />
                    Возраст: <strong>{{ user.age }}</strong>
                  </div>

                  <!-- v-else-if / v-else — демонстрация цепочки -->
                  <div v-if="user.age < 25" class="text-caption text-info">Младший специалист</div>
                  <div v-else-if="user.age < 35" class="text-caption text-positive">
                    Средний уровень
                  </div>
                  <div v-else class="text-caption text-weight-bold text-primary">
                    Старший специалист
                  </div>

                  <!--
                    СЕКЦИЯ 5 (продолжение): v-show — видимость через CSS

                    v-show="showEmail" — элемент ВСЕГДА в DOM.
                    Когда showEmail = false, Vue ставит display: none.
                    Когда showEmail = true, Vue убирает display: none.

                    Проверьте через DevTools: даже когда email скрыт,
                    тег <div> присутствует в DOM с style="display: none".
                    Это и есть отличие от v-if.
                  -->
                  <div v-show="showEmail" class="text-caption text-grey q-mt-xs">
                    <q-icon name="email" size="xs" class="q-mr-xs" />
                    {{ user.email }}
                  </div>

                  <!--
                    v-show vs v-if — сравнение:

                    Если бы мы использовали v-if вместо v-show для email:
                    - При каждом переключении Vue создавал бы новый DOM-узел
                    - И уничтожал старый → больше работы для браузера
                    - Но меньше элементов в DOM → меньше памяти

                    v-show выбран для email, потому что пользователь
                    часто переключает видимость — пересоздавать элемент
                    каждый раз неэффективно.
                  -->
                </q-card-section>

                <!--
                  СЕКЦИЯ 6: v-html — вставка HTML

                  v-html — заменяет innerHTML элемента.
                  Используется когда данные содержат HTML-разметку,
                  которую нужно отрендерить (жирный текст, ссылки, списки).

                  ⚠️ ОПАСНОСТЬ XSS:
                  Никогда не используйте v-html с пользовательским вводом!
                  Только с доверенными данными (из вашей базы, прошедшими
                  санитизацию). В противном случае атакующий может внедрить
                  вредоносный скрипт через HTML.

                  В VirtualDOM: v-html обновляет innerHTML напрямую,
                  минуя VDOM. Vue не отслеживает изменения внутри v-html.
                  В Vapor Mode: то же поведение — прямой innerHTML.
                -->
                <q-separator />
                <q-card-section>
                  <div class="text-caption text-grey q-mb-xs">О сотруднике:</div>
                  <div class="text-body2" v-html="user.bio"></div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Если поиск не дал результатов -->
          <div
            v-if="filteredUsers.length === 0 && searchQuery"
            class="text-center text-grey q-pa-lg"
          >
            <q-icon name="search_off" size="48px" class="q-mb-sm" />
            <div>Пользователи не найдены</div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Когда список скрыт через v-show, показываем заглушку -->
    <div v-if="!listVisible" class="text-center text-grey q-pa-lg">
      <q-icon name="visibility_off" size="48px" class="q-mb-sm" />
      <div>Список скрыт. Нажмите кнопку выше, чтобы показать.</div>
    </div>

    <!-- ============================================================
         СЕКЦИЯ 7: Справочник директив — краткая шпаргалка
         ============================================================ -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Справочник директив</div>

        <q-markup-table flat bordered dense>
          <thead>
            <tr>
              <th>Директива</th>
              <th>Сокращение</th>
              <th>Назначение</th>
              <th>На этой странице</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>v-for</code></td>
              <td>—</td>
              <td>Рендеринг списка элементов</td>
              <td>Карточки пользователей</td>
            </tr>
            <tr>
              <td><code>v-if</code></td>
              <td>—</td>
              <td>Условный рендеринг (создание/удаление DOM)</td>
              <td>Возраст, категория, заглушка поиска</td>
            </tr>
            <tr>
              <td><code>v-show</code></td>
              <td>—</td>
              <td>Переключение видимости (display: none)</td>
              <td>Email, весь список</td>
            </tr>
            <tr>
              <td><code>v-bind</code></td>
              <td><code>:</code></td>
              <td>Динамическая привязка атрибутов</td>
              <td>Классы при hover, цвет аватара, стиль</td>
            </tr>
            <tr>
              <td><code>v-on</code></td>
              <td><code>@</code></td>
              <td>Обработка DOM-событий</td>
              <td>@click, @mouseenter, @mouseleave, @keyup.enter</td>
            </tr>
            <tr>
              <td><code>v-html</code></td>
              <td>—</td>
              <td>Вставка HTML-разметки (⚠ XSS-риск)</td>
              <td>Биография сотрудника</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>

    <!-- ============================================================
         СЕКЦИЯ 8: VirtualDOM — как директивы работают под капотом
         ============================================================ -->
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6 q-mb-md">VirtualDOM — что происходит под капотом</div>

        <div class="text-body2 text-grey-7 q-mb-md">
          Когда вы кликаете кнопку, наводите мышь или переключаете фильтр, Vue выполняет следующие
          шаги:
        </div>

        <q-timeline dense color="primary">
          <q-timeline-entry title="Реактивные данные изменились" :icon="'bolt'" color="negative">
            <div class="text-caption text-grey">
              Например: <code>hoveredId.value = 5</code> при наведении мыши. Vue отслеживает через
              Proxy — перехватывает запись в .value.
            </div>
          </q-timeline-entry>

          <q-timeline-entry title="Создаётся новое VNode-дерево" :icon="'account_tree'">
            <div class="text-caption text-grey">
              Vue запускает render-функцию и создаёт JS-объекты (VNodes) для ВСЕХ элементов шаблона,
              даже если изменился только один класс.
            </div>
          </q-timeline-entry>

          <q-timeline-entry title="Diff-алгоритм сравнивает" :icon="'compare'">
            <div class="text-caption text-grey">
              Vue сравнивает старое и новое VNode-дерево. Для v-for с :key — ищет
              добавленные/удалённые/перемещённые элементы. Для :class — сравнивает строку классов.
            </div>
          </q-timeline-entry>

          <q-timeline-entry title="DOM-патчи" :icon="'build'" color="positive">
            <div class="text-caption text-grey">
              Vue применяет минимальный набор изменений к реальному DOM: обновляет class, style,
              textContent или создаёт/удаляет элементы.
            </div>
          </q-timeline-entry>
        </q-timeline>

        <q-separator class="q-my-md" />

        <div class="text-body2 q-mb-sm">
          <strong>Как увидеть это на практике:</strong>
        </div>
        <ol class="text-body2 text-grey-7 q-pl-lg" style="line-height: 2">
          <li>
            Установите расширение <strong>Vue DevTools</strong> для браузера. Откройте → вкладка
            <strong>Timeline</strong> → начните запись → наведите мышь на карточку → остановите. Вы
            увидите события <code>component:render</code> и <code>component:patch</code>
            с точным временем каждого шага.
          </li>
          <li>
            Альтернатива: Chrome DevTools → вкладка <strong>Performance</strong> → запишите →
            наведите на карточку → остановите. В flame chart (Main thread) найдите жёлтые блоки
            <code>Scripting</code> — внутри будут вызовы Vue: <code>renderEffect</code>,
            <code>patch</code>, <code>patchProp</code>, <code>setClass</code>. Их суммарная
            длительность — и есть время VDOM-цикла.
          </li>
          <li>
            Для наглядного сравнения зайдите на страницу
            <router-link to="/vapor">Vapor Mode</router-link> — там интерактивный бенчмарк с точными
            замерами для 100–10000 элементов.
          </li>
        </ol>

        <div class="text-body2 q-mt-sm">
          Подробнее о Vapor Mode и бенчмарках — на странице
          <router-link to="/vapor">Vapor Mode</router-link>.
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
// ============================================================
// Этот компонент совместим с Vapor Mode.
//
// Для включения Vapor в Vue 3.6+ замените строку ниже на:
//   <script setup vapor lang="ts">
//
// После этого:
// - Шаблон компилируется в прямые DOM-операции (без VNode)
// - v-if → условное создание DOM-узлов напрямую
// - v-show → setAttribute('style', ...) напрямую
// - v-bind → setAttribute() напрямую
// - v-on → addEventListener() напрямую
// - v-for → цикл с прямым createElement()
//
// Что НЕ поддерживается в Vapor Mode:
// - Options API (данный компонент использует только Composition API ✓)
// - getCurrentInstance() (здесь не используется ✓)
// - <Transition>, <KeepAlive> (здесь не используются ✓)
// ============================================================

import { ref, computed } from 'vue';

// ============================================================
// ТИПЫ
// ============================================================

/** Модель пользователя — аналогично IPersonAutocompleteVm в pms-pwa */
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  role: string;
  status: 'online' | 'offline' | 'busy';
  color: string;
  bio: string; // HTML для демонстрации v-html
}

// ============================================================
// СОСТОЯНИЕ (state) — через ref()
// ============================================================

// v-on: переключает видимость списка
const listVisible = ref(true);

// v-bind: id пользователя, на которого наведена мышь
const hoveredId = ref<number | null>(null);

// v-if: флаг показа возраста
const showAge = ref(true);

// v-show: флаг показа email
const showEmail = ref(true);

// v-bind: глобальная подсветка
const highlightAll = ref(false);

// Фильтрация (v-on @keyup)
const searchQuery = ref('');

// ============================================================
// ДАННЫЕ — моковый список пользователей
// В реальном приложении данные приходят из API (как в pms-pwa)
// ============================================================
const users: User[] = [
  {
    id: 1,
    name: 'Алексей Петров',
    age: 28,
    email: 'a.petrov@company.ru',
    role: 'Frontend Developer',
    status: 'online',
    color: 'blue',
    bio: '<strong>Стек:</strong> Vue, TypeScript, Quasar. <em>Опыт:</em> 5 лет. Работал над <u>PWA для госсектора</u>.',
  },
  {
    id: 2,
    name: 'Мария Иванова',
    age: 34,
    email: 'm.ivanova@company.ru',
    role: 'Team Lead',
    status: 'busy',
    color: 'purple',
    bio: '<strong>Управление:</strong> команда из 8 человек. <em>Проекты:</em> e-commerce, аналитические дашборды.',
  },
  {
    id: 3,
    name: 'Дмитрий Козлов',
    age: 22,
    email: 'd.kozlov@company.ru',
    role: 'Junior Developer',
    status: 'online',
    color: 'teal',
    bio: '<strong>Изучает:</strong> Composition API, Pinia. <em>Цель:</em> перейти на <u>Vapor Mode</u> в 2026.',
  },
  {
    id: 4,
    name: 'Елена Сидорова',
    age: 31,
    email: 'e.sidorova@company.ru',
    role: 'Backend Developer',
    status: 'offline',
    color: 'deep-orange',
    bio: '<strong>Стек:</strong> Node.js, PostgreSQL, Docker. <em>Интересы:</em> микросервисы, event-driven архитектура.',
  },
  {
    id: 5,
    name: 'Иван Морозов',
    age: 45,
    email: 'i.morozov@company.ru',
    role: 'Architect',
    status: 'online',
    color: 'brown',
    bio: '<strong>Экспертиза:</strong> 20 лет в разработке. <em>Специализация:</em> <u>high-load системы</u>, распределённые базы данных.',
  },
  {
    id: 6,
    name: 'Анна Волкова',
    age: 26,
    email: 'a.volkova@company.ru',
    role: 'UI/UX Designer',
    status: 'online',
    color: 'pink',
    bio: '<strong>Инструменты:</strong> Figma, Storybook. <em>Принципы:</em> accessibility-first, <u>design tokens</u>.',
  },
  {
    id: 7,
    name: 'Сергей Новиков',
    age: 38,
    email: 's.novikov@company.ru',
    role: 'DevOps Engineer',
    status: 'busy',
    color: 'cyan',
    bio: '<strong>CI/CD:</strong> GitHub Actions, ArgoCD. <em>Инфра:</em> Kubernetes, Terraform, <u>monitoring stack</u>.',
  },
  {
    id: 8,
    name: 'Ольга Федорова',
    age: 29,
    email: 'o.fedorova@company.ru',
    role: 'QA Engineer',
    status: 'offline',
    color: 'light-green',
    bio: '<strong>Тестирование:</strong> Playwright, Vitest. <em>Подход:</em> shift-left, <u>contract testing</u>.',
  },
];

// ============================================================
// COMPUTED — производные данные
// ============================================================

// Фильтрация пользователей по имени.
// computed() — кешируется, пересчитывается только при
// изменении searchQuery или users.
// В Vapor Mode: эффект привязан к текстовому узлу напрямую.
const filteredUsers = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return users;
  return users.filter(
    (u) => u.name.toLowerCase().includes(query) || u.role.toLowerCase().includes(query),
  );
});

// ============================================================
// ОБРАБОТЧИКИ СОБЫТИЙ (v-on handlers)
// ============================================================

/** v-on:click — переключает видимость списка */
function toggleList() {
  listVisible.value = !listVisible.value;
}
</script>

<style scoped>
/* Карточка пользователя — базовые стили */
.user-card {
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
}

/* Состояние hover — добавляется через v-bind:class */
.user-card--hovered {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* Глобальная подсветка — через v-bind:class */
.user-card--highlighted {
  background-color: #e8f5e9 !important;
  border-left-color: #4caf50 !important;
}
</style>
