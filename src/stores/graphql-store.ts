// GraphQL Store — Pinia store для данных из Rick and Morty API (ДЗ 8).
//
// Демонстрирует:
// - GraphQL-запросы через сервис
// - Пагинация
// - Интеграция с WebSocket для real-time обновлений
// - computed() — фильтрация, статистика
// - actions — загрузка, обновление статуса

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchCharacters } from 'src/services/graphql/graphqlService';
import type { CharacterInfo, WsCharacterEvent } from 'src/services/graphql/graphqlModels';

export const useGraphQLStore = defineStore('graphql', () => {
  const characters = ref<CharacterInfo[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const totalCount = ref(0);
  const statusFilter = ref('');
  const nameFilter = ref('');

  // WebSocket-события — лог обновлений в реальном времени
  const wsEvents = ref<WsCharacterEvent[]>([]);
  const wsConnected = ref(false);

  // Отфильтрованные персонажи (локальная фильтрация поверх GraphQL)
  const filteredCharacters = computed(() => {
    let result = [...characters.value];

    if (statusFilter.value) {
      result = result.filter((c) => c.status === statusFilter.value);
    }

    return result;
  });

  // Статистика
  const aliveCount = computed(() =>
    characters.value.filter((c) => c.status === 'Alive').length,
  );
  const deadCount = computed(() =>
    characters.value.filter((c) => c.status === 'Dead').length,
  );

  /** Загрузить персонажей из GraphQL API */
  async function loadCharacters(page?: number) {
    loading.value = true;
    error.value = null;

    try {
      const filter: Record<string, string> = {};
      if (nameFilter.value) filter.name = nameFilter.value;

      const response = await fetchCharacters(page ?? currentPage.value, filter);
      characters.value = response.characters.results;
      totalPages.value = response.characters.info.pages;
      totalCount.value = response.characters.info.count;
      if (page) currentPage.value = page;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки';
    } finally {
      loading.value = false;
    }
  }

  /** Следующая страница */
  function nextPage() {
    if (currentPage.value < totalPages.value) {
      loadCharacters(currentPage.value + 1);
    }
  }

  /** Предыдущая страница */
  function prevPage() {
    if (currentPage.value > 1) {
      loadCharacters(currentPage.value - 1);
    }
  }

  /** Обработать WebSocket-событие — обновить данные в реальном времени */
  function handleWsEvent(event: WsCharacterEvent) {
    wsEvents.value.unshift(event);

    // Ограничиваем лог событий
    if (wsEvents.value.length > 50) {
      wsEvents.value = wsEvents.value.slice(0, 50);
    }

    // Применяем обновление к персонажу
    if (event.type === 'status_change' && event.data.status) {
      const character = characters.value.find((c) => c.id === event.characterId);
      if (character) {
        character.status = event.data.status as CharacterInfo['status'];
      }
    }

    if (event.type === 'location_change' && event.data.location) {
      const character = characters.value.find((c) => c.id === event.characterId);
      if (character) {
        character.location = event.data.location!;
      }
    }
  }

  /** Сбросить фильтры */
  function resetFilters() {
    statusFilter.value = '';
    nameFilter.value = '';
  }

  return {
    characters,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    statusFilter,
    nameFilter,
    filteredCharacters,
    aliveCount,
    deadCount,
    wsEvents,
    wsConnected,
    loadCharacters,
    nextPage,
    prevPage,
    handleWsEvent,
    resetFilters,
  };
});
