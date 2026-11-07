import { getJson } from './client';
import type { EpisodeDto, PageDto } from './dto';
import { parseEpisodeCode, type Episode } from '../domain/episode';
import { asArray, idsFromUrls } from '../domain/ids';

/** EpisodeDto → Episode: "S01E01" vira season/number e characters[] (URLs) vira ids. */
export function toEpisode(dto: EpisodeDto): Episode {
  const { season, episode } = parseEpisodeCode(dto.episode);
  return {
    id: dto.id,
    name: dto.name,
    code: dto.episode,
    airDate: dto.air_date,
    season,
    number: episode,
    characterIds: idsFromUrls(dto.characters),
  };
}

/** São 51 episódios em 3 páginas: lê a 1ª para saber quantas são e busca o resto em paralelo. */
export async function getAllEpisodes(signal?: AbortSignal): Promise<Episode[]> {
  const first = await getJson<PageDto<EpisodeDto>>('/episode', { page: 1 }, signal);
  const otherPages = Array.from({ length: first.info.pages - 1 }, (_, i) => i + 2);
  const rest = await Promise.all(
    otherPages.map((page) => getJson<PageDto<EpisodeDto>>('/episode', { page }, signal)),
  );
  return [first, ...rest].flatMap((p) => p.results).map(toEpisode);
}

export async function getEpisode(id: number, signal?: AbortSignal): Promise<Episode> {
  return toEpisode(await getJson<EpisodeDto>(`/episode/${id}`, undefined, signal));
}

/** /episode/1 devolve objeto e /episode/1,2,3 devolve array — asArray normaliza. */
export async function getEpisodesByIds(ids: number[], signal?: AbortSignal): Promise<Episode[]> {
  // "/episode/" sem ids devolveria a página 1 inteira, não uma lista vazia.
  if (ids.length === 0) return [];
  const data = await getJson<EpisodeDto | EpisodeDto[]>(`/episode/${ids.join(',')}`, undefined, signal);
  return asArray(data).map(toEpisode);
}
