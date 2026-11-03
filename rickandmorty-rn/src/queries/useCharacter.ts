import { useQuery } from '@tanstack/react-query';
import { getCharacter } from '../api/characters';
import { queryKeys } from './keys';

// TODO(F2 · Vinícius): placeholderData com o que a lista já tem em cache (nome e foto aparecem na hora).
export function useCharacter(id: number) {
  return useQuery({
    queryKey: queryKeys.character(id),
    queryFn: ({ signal }) => getCharacter(id, signal),
  });
}
