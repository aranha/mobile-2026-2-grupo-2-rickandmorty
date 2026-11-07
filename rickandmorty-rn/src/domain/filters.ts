import { CHARACTER_STATUSES, type CharacterFilters } from './character';

/**
 * Deixa o filtro no formato canônico: nome sem espaços nas pontas e só o que tem valor.
 * Assim " rick " e "rick" viram o mesmo filtro — e a mesma chave de cache no TanStack Query.
 */
export function normalizeFilters(filters: CharacterFilters): CharacterFilters {
  const normalized: CharacterFilters = {};
  const name = filters.name?.trim();
  if (name) normalized.name = name;
  // Status fora do contrato (ex.: vindo de um link) não vai para a API: vira "Todos".
  if (filters.status && CHARACTER_STATUSES.includes(filters.status)) normalized.status = filters.status;
  return normalized;
}

/**
 * Parâmetros do GET /character. O filtro é aplicado na API, não na página já carregada.
 * Ex.: ({ name: ' rick ', status: 'dead' }, 2) → { page: 2, name: 'rick', status: 'dead' }.
 */
export function buildCharacterQuery(filters: CharacterFilters, page: number): Record<string, string | number> {
  const { name, status } = normalizeFilters(filters);
  const query: Record<string, string | number> = { page };
  if (name) query.name = name;
  if (status) query.status = status;
  return query;
}
