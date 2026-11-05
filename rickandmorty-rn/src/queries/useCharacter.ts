
import {
  useQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';

import { getCharacter } from '../api/characters';
import type {
  CharacterDetail,
  CharacterSummary,
  Page,
} from '../domain/character';
import { queryKeys } from './keys';

export function useCharacter(id: number) {
  const queryClient = useQueryClient();

  return useQuery<CharacterDetail, Error>({
    queryKey: queryKeys.character(id),

    queryFn: ({ signal }) => getCharacter(id, signal),

    placeholderData: (): CharacterDetail | undefined => {
      const cachedLists = queryClient.getQueriesData<
        InfiniteData<Page<CharacterSummary>>
      >({
        queryKey: ['characters'],
      });

      for (const [, data] of cachedLists) {
        if (!Array.isArray(data?.pages)) continue;

        for (const page of data.pages) {
          const character = page.items.find(
            (item) => item.id === id,
          );

          if (character) {
            return {
              ...character,
              type: '—',
              gender: '—',
              origin: '—',
              location: '—',
              episodeIds: [],
            };
          }
        }
      }

      return undefined;
    },
  });
}
