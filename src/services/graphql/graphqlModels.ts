// Типы данных для GraphQL и WebSocket (ДЗ 8 + ДЗ 10: строгая типизация).
//
// ДЗ 10: типы перенесены в src/types/global.d.ts — единый источник истины.
// Здесь — реэкспорт для удобного импорта из сервисов.
//
// Демонстрируемые паттерны TypeScript:
// - Discriminated union — WsCharacterEvent = A | B | C (type narrowing)
// - Union types — CharacterStatus, CharacterGender (вместо string)
// - Pick/Omit — WsNewCharacterEvent использует Pick<CharacterInfo, ...>
// - Type guard — isWsEvent() для runtime-проверки WS-сообщений
// - Interface inheritance — WsEventBase → конкретные события

export type {
  CharacterStatus,
  CharacterGender,
  CharacterInfo,
  CharactersResponse,
  CharacterFilter,
  PageInfo,
  NamedLink,
  EpisodeRef,
  WsCharacterEvent,
  WsStatusChangeEvent,
  WsLocationChangeEvent,
  WsNewCharacterEvent,
  WsEventType,
  QuasarColor,
} from 'src/types/global.d';

export { isWsEvent } from 'src/types/global.d';
