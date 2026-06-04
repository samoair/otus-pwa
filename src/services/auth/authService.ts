// AuthService — эмуляция сервера авторизации (ДЗ 9).
//
// В реальном приложении:
// - POST /api/auth/login → { accessToken, refreshToken }
// - POST /api/auth/refresh → { accessToken }
// - Сервер проверяет credentials, генерирует JWT, подписывает
//
// Здесь — мок-сервис для демонстрации JWT-флоу:
// - Хранит список пользователей в памяти
// - Генерирует JWT-подобный токен (base64url header.payload.signature)
// - Имитирует задержку сети (500ms)
//
// Тестовые аккаунты:
// - admin / admin123 (роль: admin)
// - user / user123   (роль: user)

import type { LoginRequest, LoginResponse, JwtPayload } from './authModels';

// Моковая база пользователей
const MOCK_USERS = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' as const },
  { id: 2, username: 'user', password: 'user123', role: 'user' as const },
];

// Время жизни токена: 1 час (в секундах)
const TOKEN_LIFETIME = 3600;

/** Base64url-кодирование (JWT использует этот формат) */
function base64url(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Генерация mock-JWT: header.payload.signature */
function generateToken(payload: JwtPayload): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify(payload));
  // В реальном JWT — HMAC-SHA256(header + '.' + body, secret)
  const signature = base64url(`mock-signature-${payload.sub}`);
  return `${header}.${body}.${signature}`;
}

/** Логин — эмуляция POST /api/auth/login */
export async function login(request: LoginRequest): Promise<LoginResponse> {
  // Имитация задержки сети
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = MOCK_USERS.find(
    (u) => u.username === request.username && u.password === request.password,
  );

  if (!user) {
    throw new Error('Неверный логин или пароль');
  }

  const now = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = {
    sub: user.id,
    username: user.username,
    role: user.role,
    iat: now,
    exp: now + TOKEN_LIFETIME,
  };

  return {
    accessToken: generateToken(payload),
    tokenType: 'Bearer',
    expiresIn: TOKEN_LIFETIME,
    user: { id: user.id, username: user.username, role: user.role },
  };
}
