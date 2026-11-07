import { useInfiniteQuery } from '@tanstack/react-query';
import { getCharacters } from '../api/characters';
import type { CharacterFilters } from '../domain/character';
import { normalizeFilters } from '../domain/filters';
import { queryKeys } from './keys';

/** Lista (F1), busca (F3) e filtro (F4) usam este mesmo hook — muda só o `filters`. */
export function useCharacters(filters: CharacterFilters) {
  // Normalizado antes da chave: "rick " depois de "rick" reaproveita o cache em vez de recarregar.
  const normalized = normalizeFilters(filters);
  return useInfiniteQuery({
    queryKey: queryKeys.characters(normalized),
    queryFn: ({ pageParam, signal }) => getCharacters(normalized, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
}
