import type { EpisodeDto } from './dto';
import type { Episode } from '../domain/episode';

// TODO(F6 · Rafael): EpisodeDto → Episode (code "S01E01" vira season/number; characters[] vira ids).
export function toEpisode(dto: EpisodeDto): Episode {
  throw new Error('TODO(F6 · Rafael): toEpisode');
}

// TODO(F6 · Rafael): são 51 episódios em 3 páginas (/episode?page=N) — trazer todos para agrupar por temporada.
export async function getAllEpisodes(signal?: AbortSignal): Promise<Episode[]> {
  throw new Error('TODO(F6 · Rafael): getAllEpisodes');
}

export async function getEpisode(id: number, signal?: AbortSignal): Promise<Episode> {
  throw new Error('TODO(F6 · Rafael): getEpisode');
}

// Mesmo gotcha do getCharactersByIds: um id só devolve objeto, vários devolvem array.
export async function getEpisodesByIds(ids: number[], signal?: AbortSignal): Promise<Episode[]> {
  throw new Error('TODO(F6 · Rafael): getEpisodesByIds');
}
