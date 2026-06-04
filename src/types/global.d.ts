// global.d.ts — глобальные типы приложения (ДЗ 10).
//
// Общие типы, используемые в нескольких модулях.
// Централизованное определение — единый источник истины.

// ============================================================
// GraphQL — Rick and Morty API
// ============================================================

/** Статус персонажа — union type вместо string */
export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';

/** Пол персонажа */
export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';

/** Ссылка на локацию/происхождение */
export interface NamedLink {
  name: string;
  url: string;
}

/** Ссылка на эпизод */
export interface EpisodeRef {
  id: string;
  name: string;
}

/** Полные данные персонажа из GraphQL API */
export interface CharacterInfo {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: CharacterGender;
  origin: NamedLink;
  location: NamedLink;
  image: string;
  episode: EpisodeRef[];
}

/** Информация о пагинации */
export interface PageInfo {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
}

/** Ответ GraphQL-запроса characters */
export interface CharactersResponse {
  characters: {
    info: PageInfo;
    results: CharacterInfo[];
  };
}

/** Фильтр для GraphQL-запроса — типизированный */
export interface CharacterFilter {
  name?: string;
  status?: CharacterStatus;
  species?: string;
  type?: string;
  gender?: CharacterGender;
}

// ============================================================
// WebSocket — discriminated union для событий
// ============================================================

/** Базовые поля любого WebSocket-события */
interface WsEventBase {
  characterId: number;
  timestamp: string;
}

/** Событие: изменение статуса персонажа */
export interface WsStatusChangeEvent extends WsEventBase {
  type: 'status_change';
  data: { status: CharacterStatus };
}

/** Событие: перемещение персонажа */
export interface WsLocationChangeEvent extends WsEventBase {
  type: 'location_change';
  data: { location: NamedLink };
}

/** Событие: новый персонаж обнаружен */
export interface WsNewCharacterEvent extends WsEventBase {
  type: 'new_character';
  data: Pick<CharacterInfo, 'name' | 'status' | 'species' | 'image'>;
}

/**
 * Discriminated union — тип события определяется полем `type`.
 * TypeScript сужает тип в switch/if: при проверке event.type === 'status_change'
 * TypeScript знает, что event.data — { status: CharacterStatus }.
 */
export type WsCharacterEvent =
  | WsStatusChangeEvent
  | WsLocationChangeEvent
  | WsNewCharacterEvent;

// ============================================================
// Utility types
// ============================================================

/** Цвет для Quasar-компонентов */
export type QuasarColor =
  | 'green' | 'red' | 'grey' | 'orange' | 'blue'
  | 'primary' | 'negative' | 'positive';

/** Тип события — для type guards и отображения */
export type WsEventType = WsCharacterEvent['type'];

// ============================================================
// Type guard — проверка типа WS-события в runtime
// ============================================================

export function isWsEvent(data: unknown): data is WsCharacterEvent {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.type === 'string' &&
    typeof obj.characterId === 'number' &&
    typeof obj.timestamp === 'string' &&
    typeof obj.data === 'object'
  );
}
