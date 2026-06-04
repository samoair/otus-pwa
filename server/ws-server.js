#!/usr/bin/env node
// ws-server.js — простой WebSocket-сервер для демонстрации real-time (ДЗ 8).
//
// Отправляет случайные события:
// - status_change — персонаж меняет статус (Alive → Dead и т.д.)
// - location_change — персонаж перемещается
// - new_character — новый персонаж обнаружен
//
// Запуск: node server/ws-server.js
// По умолчанию слушает ws://localhost:8080

import { WebSocketServer } from 'ws';

const PORT = 8080;
const INTERVAL_MS = 4000; // событие каждые 4 секунды

const STATUSES = ['Alive', 'Dead', 'unknown'];
const LOCATIONS = [
  'Citadel of Ricks',
  'Earth (C-137)',
  'Earth (Replacement Dimension)',
  'Gazorpazorp',
  'Alphabetrium',
  'Interdimensional Cable',
  'Purge Planet',
  'Planet Squanch',
  'Abadango',
  'Anatomy Park',
];
const NAMES = [
  'Morty Smith', 'Summer Smith', 'Beth Smith', 'Jerry Smith',
  'Squanchy', 'Mr. Poopybutthole', 'Birdperson', 'Tammy Guetermann',
  'Snuffles', 'Mr. Meeseeks', ' Evil Morty', 'Space Cruiser',
];

let nextId = 100;

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createEvent() {
  const types = ['status_change', 'location_change', 'new_character'];
  const type = randomItem(types);
  const characterId = Math.floor(Math.random() * 20) + 1;

  const event = {
    type,
    characterId,
    timestamp: new Date().toISOString(),
  };

  switch (type) {
    case 'status_change':
      event.data = { status: randomItem(STATUSES) };
      break;
    case 'location_change':
      event.data = { location: { name: randomItem(LOCATIONS), url: '' } };
      break;
    case 'new_character':
      nextId++;
      event.characterId = nextId;
      event.data = {
        name: randomItem(NAMES),
        status: randomItem(STATUSES),
        species: 'Human',
        image: `https://rickandmortyapi.com/api/character/avatar/${nextId % 826 + 1}.jpeg`,
      };
      break;
  }

  return event;
}

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
  console.log(`[WS] Клиент подключён (${wss.clients.size} всего)`);

  // Отправляем события с интервалом
  const timer = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      const event = createEvent();
      ws.send(JSON.stringify(event));
    }
  }, INTERVAL_MS);

  ws.on('close', () => {
    clearInterval(timer);
    console.log('[WS] Клиент отключился');
  });

  ws.on('error', (err) => {
    console.error('[WS] Ошибка:', err.message);
  });
});

console.log(`[WS] WebSocket-сервер запущен на ws://localhost:${PORT}`);
console.log('[WS] Подключитесь из приложения на странице /graphql');
