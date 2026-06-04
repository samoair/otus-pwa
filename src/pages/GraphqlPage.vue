<!--
  GraphqlPage.vue — ДЗ 8 + ДЗ 10: GraphQL API + WebSocket real-time.

  ДЗ 10: строгая типизация:
  - statusColor() принимает CharacterStatus вместо string
  - eventTypeColor() принимает WsEventType вместо string
  - useWebSocket<WsCharacterEvent> — generic с type guard
  - import type — только типы, не попадают в бандл
-->
<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="text-h4">GraphQL + WebSocket</div>
      <q-space />
      <q-chip
        :icon="wsConnected ? 'wifi' : 'wifi_off'"
        :color="wsConnected ? 'green-2' : 'red-2'"
        :text-color="wsConnected ? 'green-10' : 'red-10'"
        dense
      >
        WS {{ wsConnected ? 'подключён' : 'отключён' }}
      </q-chip>
    </div>

    <q-card flat bordered class="q-mb-md bg-grey-1">
      <q-card-section>
        <div class="text-body2 text-grey-8">
          Данные загружаются из <strong>Rick and Morty GraphQL API</strong>
          (graphql-request). WebSocket-сервер отправляет real-time события —
          изменение статуса, перемещение, новых персонажей.
          <br />
          Запустите сервер: <code>npm run ws-server</code>
        </div>
      </q-card-section>
    </q-card>

    <!-- Фильтры и пагинация -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-sm items-end">
          <div class="col-12 col-md-3">
            <q-input
              v-model="store.nameFilter"
              dense
              outlined
              label="Поиск по имени"
              clearable
              @keyup.enter="store.loadCharacters(1)"
            >
              <template v-slot:prepend><q-icon name="search" /></template>
            </q-input>
          </div>

          <div class="col-12 col-md-2">
            <q-select
              v-model="store.statusFilter"
              :options="statusOptions"
              dense
              outlined
              label="Статус"
              emit-value
            >
              <template v-slot:prepend><q-icon name="filter_list" /></template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt || 'Все' }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-4">
            <div class="text-caption text-grey">
              Всего: <strong>{{ store.totalCount }}</strong>
              · Alive: <strong class="text-green">{{ store.aliveCount }}</strong>
              · Dead: <strong class="text-red">{{ store.deadCount }}</strong>
              · Страница {{ store.currentPage }}/{{ store.totalPages }}
            </div>
          </div>

          <div class="col-12 col-md-3">
            <q-btn flat dense color="primary" label="Найти" icon="search" @click="store.loadCharacters(1)" class="q-mr-sm" />
            <q-btn flat dense color="grey" label="Сбросить" @click="resetAndLoad" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Загрузка -->
    <div v-if="store.loading" class="text-center q-pa-xl">
      <q-spinner-dots size="48px" color="primary" />
      <div class="text-grey q-mt-md">Загрузка из GraphQL API...</div>
    </div>

    <!-- Ошибка -->
    <q-card v-else-if="store.error" flat bordered class="bg-red-1">
      <q-card-section class="text-center">
        <q-icon name="error_outline" size="48px" color="negative" />
        <div class="text-h6 text-negative q-mt-sm">Ошибка GraphQL</div>
        <div class="text-body2 text-grey-7">{{ store.error }}</div>
        <q-btn color="primary" label="Повторить" @click="store.loadCharacters()" class="q-mt-md" />
      </q-card-section>
    </q-card>

    <!-- Список персонажей -->
    <template v-else>
      <div class="row q-col-gutter-md q-mb-md">
        <div
          v-for="char in store.filteredCharacters"
          :key="char.id"
          class="col-6 col-sm-4 col-md-3 col-lg-2"
        >
          <q-card flat bordered>
            <q-img :src="char.image" :alt="char.name" ratio="1" />
            <q-card-section class="q-pa-sm">
              <div class="text-subtitle2 ellipsis">{{ char.name }}</div>
              <div class="row items-center q-mt-xs">
                <q-badge :color="statusColor(char.status)" :label="char.status" dense />
                <span class="text-caption text-grey q-ml-xs">{{ char.species }}</span>
              </div>
              <div class="text-caption text-grey q-mt-xs ellipsis">
                <q-icon name="place" size="xs" /> {{ char.location.name }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="row justify-center q-mb-lg">
        <q-pagination
          v-model="store.currentPage"
          :max="store.totalPages"
          :max-pages="6"
          direction-links
          boundary-links
          @update:model-value="store.loadCharacters"
        />
      </div>
    </template>

    <!-- Real-time лог -->
    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <div class="text-subtitle1 text-weight-bold q-mb-sm">
          <q-icon name="wifi" class="q-mr-xs" /> Real-time события
          <q-badge color="grey" class="q-ml-sm">{{ store.wsEvents.length }}</q-badge>
        </div>

        <div v-if="store.wsEvents.length === 0" class="text-caption text-grey">
          Нет событий. Запустите WebSocket-сервер: <code>npm run ws-server</code>
        </div>

        <div
          v-for="(event, idx) in store.wsEvents.slice(0, 10)"
          :key="idx"
          class="q-pa-xs q-mb-xs"
          :class="idx === 0 ? 'bg-blue-1' : ''"
        >
          <q-chip
            dense
            size="sm"
            :color="eventTypeColor(event.type)"
            text-color="white"
            :label="event.type"
          />
          <span class="text-caption">
            Персонаж #{{ event.characterId }}
            <!-- Discriminated union narrowing — TypeScript знает тип data для каждого type -->
            <template v-if="event.type === 'status_change'">
              → статус: <strong>{{ event.data.status }}</strong>
            </template>
            <template v-else-if="event.type === 'location_change'">
              → {{ event.data.location.name }}
            </template>
            <template v-else-if="event.type === 'new_character'">
              → <strong>{{ event.data.name }}</strong>
            </template>
          </span>
          <span class="text-caption text-grey float-right">
            {{ formatTime(event.timestamp) }}
          </span>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
// ДЗ 10: import type — типы не попадают в runtime-бандл
import { onMounted } from 'vue';
import type { CharacterStatus, WsEventType, QuasarColor } from 'src/services/graphql/graphqlModels';
import { isWsEvent } from 'src/services/graphql/graphqlModels';
import { useGraphQLStore } from 'src/stores/graphql-store';
import { useWebSocket } from 'src/composables/useWebSocket';

const store = useGraphQLStore();

// Типизированные опции для q-select — CharacterStatus union
const statusOptions: Array<CharacterStatus | ''> = ['', 'Alive', 'Dead', 'unknown'];

// ============================================================
// WebSocket — generic composable с type guard
// useWebSocket<WsCharacterEvent> — строгая типизация событий
// isWsEvent — runtime-валидация входящих данных
// ============================================================
const { connected: wsConnected } = useWebSocket({
  url: 'ws://localhost:8080',
  validate: isWsEvent,
  onMessage(event) {
    store.handleWsEvent(event);
  },
});

onMounted(() => {
  if (store.characters.length === 0) {
    store.loadCharacters();
  }
});

// Строго типизированные функции — параметры — union types, не string
function statusColor(status: CharacterStatus): QuasarColor {
  switch (status) {
    case 'Alive': return 'green';
    case 'Dead': return 'red';
    default: return 'grey';
  }
}

function eventTypeColor(type: WsEventType): QuasarColor {
  switch (type) {
    case 'status_change': return 'orange';
    case 'location_change': return 'blue';
    case 'new_character': return 'green';
  }
}

function formatTime(ts: string): string {
  return new Date(ts).toLocaleTimeString('ru-RU');
}

function resetAndLoad(): void {
  store.resetFilters();
  store.loadCharacters(1);
}
</script>
