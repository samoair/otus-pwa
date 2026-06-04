// Типы данных для Rick and Morty GraphQL API (https://rickandmortyapi.com/graphql).
// Используем бесплатный публичный API для демонстрации GraphQL в ДЗ 8.

export interface CharacterInfo {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: { id: string; name: string }[];
}

export interface CharactersResponse {
  characters: {
    info: { count: number; pages: number; next: number | null; prev: number | null };
    results: CharacterInfo[];
  };
}

// События от WebSocket-сервера
export interface WsCharacterEvent {
  type: 'status_change' | 'new_character' | 'location_change';
  characterId: number;
  data: Partial<CharacterInfo>;
  timestamp: string;
}
