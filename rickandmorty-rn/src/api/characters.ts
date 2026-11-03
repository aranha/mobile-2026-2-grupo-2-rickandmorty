import { getJson } from './client';
import type { CharacterDto, PageDto } from './dto';
import type { CharacterDetail, CharacterFilters, CharacterSummary, Page } from '../domain/character';
import { buildCharacterQuery } from '../domain/filters';

// TODO(F1 · Paulo): CharacterDto → CharacterSummary ("Alive" vira "alive").
export function toCharacterSummary(dto: CharacterDto): CharacterSummary {
  throw new Error('TODO(F1 · Paulo): toCharacterSummary');
}

// TODO(F1 · Paulo): results → items e info.next ("...?page=3") → nextPage 3 (null quando acabou).
export function toCharacterPage(dto: PageDto<CharacterDto>): Page<CharacterSummary> {
  throw new Error('TODO(F1 · Paulo): toCharacterPage');
}

// TODO(F2 · Vinícius): CharacterDto → CharacterDetail. Texto vazio da API ("type": "") vira "—";
// episode[] vira episodeIds com idsFromUrls (domain/ids.ts, do Rafael).
export function toCharacterDetail(dto: CharacterDto): CharacterDetail {
  throw new Error('TODO(F2 · Vinícius): toCharacterDetail');
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
