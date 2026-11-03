import { useInfiniteQuery } from '@tanstack/react-query';
import { getCharacters } from '../api/characters';
import type { CharacterFilters } from '../domain/character';
import { queryKeys } from './keys';

/** Lista (F1), busca (F3) e filtro (F4) usam este mesmo hook — muda só o `filters`. */
export function useCharacters(filters: CharacterFilters) {
  return useInfiniteQuery({
    queryKey: queryKeys.characters(filters),
    queryFn: ({ pageParam, signal }) => getCharacters(filters, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
}
