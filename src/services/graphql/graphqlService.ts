// GraphQL-сервис — подключение к Rick and Morty API (ДЗ 8).
//
// Демонстрирует:
// - graphql-request — минимальный GraphQL-клиент
// - gql — шаблонные строки для запросов
// - типизация ответов через TypeScript-генерики
//
// API: https://rickandmortyapi.com/graphql
// Альтернативы: SpaceX, Countries, Star Wars — любой публичный GraphQL API.

import { request, gql } from 'graphql-request';
import type { CharactersResponse } from './graphqlModels';

const ENDPOINT = 'https://rickandmortyapi.com/graphql';

/** Запрос списка персонажей с пагинацией */
const CHARACTERS_QUERY = gql`
  query GetCharacters($page: Int!, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        type
        gender
        origin { name }
        location { name }
        image
        episode { id name }
      }
    }
  }
`;

/** Получить список персонажей */
export async function fetchCharacters(page = 1, filter?: Record<string, string>): Promise<CharactersResponse> {
  return request<CharactersResponse>(ENDPOINT, CHARACTERS_QUERY, { page, filter });
}
