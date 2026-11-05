import { getJson } from './client';
import type { CharacterDto, PageDto } from './dto';
import type {
  CharacterDetail,
  CharacterFilters,
  CharacterStatus,
  CharacterSummary,
  Page,
} from '../domain/character';
import { buildCharacterQuery } from '../domain/filters';

const STATUS_FROM_API: Record<CharacterDto['status'], CharacterStatus> = {
  Alive: 'alive',
  Dead: 'dead',
  unknown: 'unknown',
};

export function toCharacterSummary(dto: CharacterDto): CharacterSummary {
  return {
    id: dto.id,
    name: dto.name,
    // Valor fora do contrato da API não derruba a lista: vira "unknown".
    status: STATUS_FROM_API[dto.status] ?? 'unknown',
    species: dto.species,
    image: dto.image,
  };
}

/** "https://.../character/?page=3&status=dead" → 3; null quando não há próxima página. */
function pageFromUrl(url: string | null): number | null {
  const match = url?.match(/[?&]page=(\d+)/);
  return match ? Number(match[1]) : null;
}

export function toCharacterPage(dto: PageDto<CharacterDto>): Page<CharacterSummary> {
  return {
    items: dto.results.map(toCharacterSummary),
    nextPage: pageFromUrl(dto.info.next),
  };
}

// TODO(F2 · Vinícius): CharacterDto → CharacterDetail. Texto vazio da API ("type": "") vira "—";
// episode[] vira episodeIds com idsFromUrls (domain/ids.ts, do Rafael).

export function toCharacterDetail(dto: CharacterDto): CharacterDetail {
  const textOrDash = (value: string): string =>
    value.trim() || '—';

  return {
    ...toCharacterSummary(dto),
    type: textOrDash(dto.type),
    gender: textOrDash(dto.gender),
    origin: textOrDash(dto.origin.name),
    location: textOrDash(dto.location.name),
    episodeIds: dto.episode
      .map((url) => Number(url.match(/\/(\d+)\/?$/)?.[1]))
      .filter((id) => Number.isInteger(id) && id > 0),
  };
}


export async function getCharacters(
  filters: CharacterFilters,
  page: number,
  signal?: AbortSignal,
): Promise<Page<CharacterSummary>> {
  // TODO(F3 · Hugo): busca sem resultado responde 404 → devolver página vazia, não erro.
  const dto = await getJson<PageDto<CharacterDto>>('/character', buildCharacterQuery(filters, page), signal);
  return toCharacterPage(dto);
}

export async function getCharacter(id: number, signal?: AbortSignal): Promise<CharacterDetail> {
  return toCharacterDetail(await getJson<CharacterDto>(`/character/${id}`, undefined, signal));
}

// TODO(F6 · Rafael): /character/1,2,3 devolve array, mas /character/1 devolve objeto — normalizar.
export async function getCharactersByIds(ids: number[], signal?: AbortSignal): Promise<CharacterSummary[]> {
  throw new Error('TODO(F6 · Rafael): getCharactersByIds');
}
