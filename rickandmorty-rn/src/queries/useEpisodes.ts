import { useQuery } from '@tanstack/react-query';
import { getCharactersByIds } from '../api/characters';
import { getAllEpisodes, getEpisode, getEpisodesByIds } from '../api/episodes';
import { queryKeys } from './keys';

// Hooks da F6 (Rafael). A ligação com o TanStack Query já está feita; falta a camada api/.

export function useEpisodes() {
  return useQuery({
    queryKey: queryKeys.episodes(),
    queryFn: ({ signal }) => getAllEpisodes(signal),
  });
}

export function useEpisode(id: number) {
  return useQuery({
    queryKey: queryKeys.episode(id),
    queryFn: ({ signal }) => getEpisode(id, signal),
  });
}

/** "Aparece em N episódios", no detalhe do personagem. */
export function useEpisodesByIds(ids: number[]) {
  return useQuery({
    queryKey: queryKeys.episodesByIds(ids),
    queryFn: ({ signal }) => getEpisodesByIds(ids, signal),
    enabled: ids.length > 0,
  });
}

/** Personagens do episódio, no detalhe do episódio. */
export function useCharactersByIds(ids: number[]) {
  return useQuery({
    queryKey: queryKeys.charactersByIds(ids),
    queryFn: ({ signal }) => getCharactersByIds(ids, signal),
    enabled: ids.length > 0,
  });
}
