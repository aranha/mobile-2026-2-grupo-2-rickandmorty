import type { CharacterFilters } from '../domain/character';

// Todas as chaves do TanStack Query num lugar só: cache e invalidação ficam previsíveis.
export const queryKeys = {
  characters: (filters: CharacterFilters) => ['characters', filters] as const,
  character: (id: number) => ['character', id] as const,
  charactersByIds: (ids: number[]) => ['characters', 'byIds', ids] as const,
  episodes: () => ['episodes'] as const,
  episode: (id: number) => ['episode', id] as const,
  episodesByIds: (ids: number[]) => ['episodes', 'byIds', ids] as const,
};
