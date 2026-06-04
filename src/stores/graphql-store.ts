// GraphQL Store — Pinia store для Rick and Morty API (ДЗ 8 + ДЗ 10).
//
// ДЗ 10: строгая типизация:
// - Discriminated union — switch по event.type, TypeScript сужает data
// - CharacterFilter вместо Record<string, string>
// - CharacterStatus union type вместо string
// - Типизированные computed и actions

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchCharacters } from 'src/services/graphql/graphqlService';
import type {
  CharacterInfo,
  CharacterStatus,
  CharacterFilter,
  WsCharacterEvent,
} from 'src/services/graphql/graphqlModels';

export const useGraphQLStore = defineStore('graphql', () => {
  const characters = ref<CharacterInfo[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const totalCount = ref(0);
  const statusFilter = ref<CharacterStatus | ''>('');
  const nameFilter = ref('');

  const wsEvents = ref<WsCharacterEvent[]>([]);
  const wsConnected = ref(false);

  const filteredCharacters = computed((): CharacterInfo[] => {
    let result = [...characters.value];

    if (statusFilter.value) {
      result = result.filter((c) => c.status === statusFilter.value);
    }

    return result;
  });

  const aliveCount = computed((): number =>
    characters.value.filter((c) => c.status === 'Alive').length,
  );

  const deadCount = computed((): number =>
    characters.value.filter((c) => c.status === 'Dead').length,
  );

  async function loadCharacters(page?: number): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const filter: CharacterFilter = {};
      if (nameFilter.value) filter.name = nameFilter.value;

      const response = await fetchCharacters(page ?? currentPage.value, filter);
      characters.value = response.characters.results;
      totalPages.value = response.characters.info.pages;
      totalCount.value = response.characters.info.count;
      if (page) currentPage.value = page;
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки';
    } finally {
      loading.value = false;
    }
  }

  function nextPage(): void {
    if (currentPage.value < totalPages.value) {
      loadCharacters(currentPage.value + 1);
    }
  }

  function prevPage(): void {
    if (currentPage.value > 1) {
      loadCharacters(currentPage.value - 1);
    }
  }

  /**
   * Обработать WebSocket-событие — discriminated union.
   *
   * TypeScript сужает тип event.data в каждом case:
   * - 'status_change' → event.data: { status: CharacterStatus }
   * - 'location_change' → event.data: { location: NamedLink }
   * - 'new_character' → event.data: Pick<CharacterInfo, ...>
   */
  function handleWsEvent(event: WsCharacterEvent): void {
    wsEvents.value.unshift(event);

    if (wsEvents.value.length > 50) {
      wsEvents.value = wsEvents.value.slice(0, 50);
    }

    // Discriminated union — switch по event.type
    switch (event.type) {
      case 'status_change': {
        const character = characters.value.find((c) => c.id === event.characterId);
        if (character) {
          character.status = event.data.status;
        }
        break;
      }
      case 'location_change': {
        const character = characters.value.find((c) => c.id === event.characterId);
        if (character) {
          character.location = event.data.location;
        }
        break;
      }
      case 'new_character':
        // Новый персонаж — для demo не добавляем автоматически
        break;
    }
  }

  function resetFilters(): void {
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
