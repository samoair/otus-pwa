// useWebSocket — типобезопасный composable для WebSocket (ДЗ 8 + ДЗ 10).
//
// ДЗ 10: Generic composable — <T> задаёт тип сообщения.
// - useWebSocket<WsCharacterEvent>({ ... }) — строго типизированные события
// - Type guard — validateIncoming проверяет структуру входящих данных
// - Убраны все `any` и `unknown`
// - Возвращаемый тип интерфейса UseWebSocketReturn<T>
//
// Паттерны TypeScript:
// - Generic <T> — composable работает с любым типом сообщений
// - Type guard (data: unknown): data is T — runtime-проверка
// - ReadonlyArray — events не мутируется извне
// - ReturnType<typeof setTimeout> — тип таймера без зависимости от платформы

import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

/** Опции composable — generic над типом сообщения */
export interface WebSocketOptions<T> {
  /** URL WebSocket-сервера */
  url: string;
  /** Колбэк при получении валидного сообщения */
  onMessage?: (event: T) => void;
  /** Интервал переподключения в ms (default: 3000) */
  reconnectInterval?: number;
  /** Макс. попыток переподключения (default: 10) */
  maxReconnectAttempts?: number;
  /** Функция-валидатор (type guard) для входящих данных */
  validate?: (data: unknown) => data is T;
}

/** Возвращаемый тип composable — все reactive-ссылки и методы */
export interface UseWebSocketReturn<T> {
  /** Подключён ли WebSocket */
  connected: Ref<boolean>;
  /** Последнее валидное сообщение */
  lastEvent: Ref<T | null>;
  /** Все полученные валидные сообщения (max 100) */
  events: Ref<T[]>;
  /** Подключиться вручную */
  connect: () => void;
  /** Отключиться */
  disconnect: () => void;
  /** Отправить типизированное сообщение */
  send: (data: T) => void;
}

/**
 * useWebSocket — типобезопасный composable для WebSocket.
 *
 * @typeParam T — тип сообщений, которые composable ожидает получить
 * @param options — конфигурация с URL, колбэками и type guard
 *
 * @example
 * ```ts
 * const { connected, events } = useWebSocket<WsCharacterEvent>({
 *   url: 'ws://localhost:8080',
 *   validate: isWsEvent,
 *   onMessage(event) { store.handleWsEvent(event); },
 * });
 * ```
 */
export function useWebSocket<T>(
  options: WebSocketOptions<T>,
): UseWebSocketReturn<T> {
  const {
    url,
    onMessage,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
    validate,
  } = options;

  const connected = ref<boolean>(false);
  const lastEvent = ref<T | null>(null) as Ref<T | null>;
  const events = ref<T[]>([]) as Ref<T[]>;

  let ws: WebSocket | null = null;
  let reconnectAttempts = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let intentionalClose = false;

  function connect(): void {
    if (ws?.readyState === WebSocket.OPEN) return;

    try {
      ws = new WebSocket(url);

      ws.onopen = () => {
        connected.value = true;
        reconnectAttempts = 0;
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const parsed: unknown = JSON.parse(event.data as string);

          // Type guard: если валидатор передан — проверяем структуру
          if (validate ? validate(parsed) : true) {
            const data = parsed as T;
            (lastEvent as Ref<T | null>).value = data;
            (events as Ref<T[]>).value = [data, ...events.value].slice(0, 100);
            if (events.value.length > 100) {
              events.value = events.value.slice(0, 100);
            }
            onMessage?.(data);
          }
        } catch {
          // Не JSON или невалидная структура — игнорируем
        }
      };

      ws.onclose = () => {
        connected.value = false;
        if (!intentionalClose) {
          scheduleReconnect();
        }
      };

      ws.onerror = () => {
        connected.value = false;
      };
    } catch {
      connected.value = false;
    }
  }

  function scheduleReconnect(): void {
    if (reconnectAttempts >= maxReconnectAttempts) return;
    reconnectAttempts++;
    reconnectTimer = setTimeout(() => {
      connect();
    }, reconnectInterval);
  }

  function disconnect(): void {
    intentionalClose = true;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    ws?.close();
    ws = null;
    connected.value = false;
  }

  function send(data: T): void {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  onMounted(() => {
    connect();
  });

  onUnmounted(() => {
    disconnect();
  });

  return {
    connected,
    lastEvent,
    events,
    connect,
    disconnect,
    send,
  };
}
