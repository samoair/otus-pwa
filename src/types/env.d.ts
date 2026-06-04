// env.d.ts — типы для переменных окружения (ДЗ 10).
//
// Vite подставляет значения на этапе сборки через define в quasar.config.ts.
// Этот файл говорит TypeScript, какие process.env поля существуют.
// Без него process.env.APP_VERSION — тип any.

declare namespace NodeJS {
  interface ProcessEnv {
    readonly APP_VERSION: string;
    readonly VUE_ROUTER_MODE: 'hash' | 'history';
    readonly VUE_ROUTER_BASE: string;
    readonly SERVER: string;
    readonly DEV: string;
    readonly PROD: string;
    readonly MODE: string;
  }
}
