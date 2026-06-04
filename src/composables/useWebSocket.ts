// useWebSocket — composable для работы с WebSocket (ДЗ 8).
//
// Демонстрирует:
// - Нативный WebSocket API браузера
// - Реактивное состояние подключения
// - Автоматическое переподключение (reconnect)
// - Типизация сообщений
//
// WebSocket-сервер запускается отдельно: npm run ws-server
// Если сервер недоступен — composable работает в offline-режиме.

import { ref, onMounted, onUnmounted } from 'vue';
import type { WsCharacterEvent } from 'src/services/graphql/graphqlModels';

export interface WebSocketOptions {
  url: string;
  onMessage?: (event: WsCharacterEvent) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useWebSocket(options: WebSocketOptions) {
  const {
    url,
    onMessage,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
  } = options;

  const connected = ref(false);
  const lastEvent = ref<WsCharacterEvent | null>(null);
  const events = ref<WsCharacterEvent[]>([]);

  let ws: WebSocket | null = null;
  let reconnectAttempts = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let intentionalClose = false;

  function connect() {
    if (ws?.readyState === WebSocket.OPEN) return;

    try {
      ws = new WebSocket(url);

      ws.onopen = () => {
        connected.value = true;
        reconnectAttempts = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data: WsCharacterEvent = JSON.parse(event.data);
          lastEvent.value = data;
          events.value.unshift(data);
          if (events.value.length > 100) {
            events.value = events.value.slice(0, 100);
          }
          onMessage?.(data);
        } catch {
          // Не JSON — игнорируем
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
      // WebSocket не поддерживается или URL невалидный
      connected.value = false;
    }
  }

  function scheduleReconnect() {
    if (reconnectAttempts >= maxReconnectAttempts) return;
    reconnectAttempts++;
    reconnectTimer = setTimeout(() => {
      connect();
    }, reconnectInterval);
  }

  function disconnect() {
    intentionalClose = true;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    ws?.close();
    ws = null;
    connected.value = false;
  }

  function send(data: unknown) {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  // Подключаемся при монтировании, отключаемся при размонтировании
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
