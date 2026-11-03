import type { CharacterFilters } from './character';

// TODO(F4 · Guilherme): incluir `status` e `name` (sem espaços nas pontas; vazio não vai).
// Ex.: ({ name: ' rick ', status: 'dead' }, 2) → { page: 2, name: 'rick', status: 'dead' }.
// Até lá devolve só a página, para a lista do F1 já funcionar.
export function buildCharacterQuery(filters: CharacterFilters, page: number): Record<string, string | number> {
  return { page };
}
