// Типы для авторизации по JWT (ДЗ 9).
//
// JWT (JSON Web Token) — стандартный формат токена:
// header.payload.signature (base64url-кодированные части).
// Payload содержит claims (утверждения) о пользователе.
//
// В реальном приложении:
// - Токен генерирует сервер (Spring Security, Passport.js, etc.)
// - Signature проверяется сервером с помощью секретного ключа
// - Refresh token используется для обновления access token
// Здесь — эмуляция для демонстрации Pinia + Vue Router guards.

export interface JwtPayload {
  /** Subject — ID пользователя */
  sub: number;
  /** Логин пользователя */
  username: string;
  /** Роль: admin | user */
  role: 'admin' | 'user';
  /** Issued At — время выдачи (Unix timestamp) */
  iat: number;
  /** Expiration — время истечения (Unix timestamp) */
  exp: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: {
    id: number;
    username: string;
    role: 'admin' | 'user';
  };
}
