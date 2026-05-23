/// <reference types="@quasar/app-vite" />

// Типы для переменных окружения, доступных через process.env
declare namespace NodeJS {
  interface ProcessEnv {
    APP_VERSION: string;
  }
}
