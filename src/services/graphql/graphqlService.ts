// GraphQL-сервис — подключение к Rick and Morty API (ДЗ 8 + ДЗ 10).
//
// ДЗ 10: строгая типизация:
// - CharacterFilter вместо Record<string, string>
// - Типизированный generic в request<T>
// - Возвращаемый тип Promise<CharactersResponse>

import { request, gql } from 'graphql-request';
import type { CharactersResponse, CharacterFilter } from './graphqlModels';

const ENDPOINT = 'https://rickandmortyapi.com/graphql';

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

/**
 * Получить список персонажей из GraphQL API.
 *
 * @param page - номер страницы (1-based)
 * @param filter - типизированный фильтр (CharacterFilter вместо Record<string, string>)
 */
export async function fetchCharacters(
  page: number = 1,
  filter?: CharacterFilter,
): Promise<CharactersResponse> {
  return request<CharactersResponse>(ENDPOINT, CHARACTERS_QUERY, { page, filter });
}
