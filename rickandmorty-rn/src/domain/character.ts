export type CharacterStatus = 'alive' | 'dead' | 'unknown';

export const CHARACTER_STATUSES: readonly CharacterStatus[] = ['alive', 'dead', 'unknown'];

/** O que a lista, o card e os favoritos precisam. */
export interface CharacterSummary {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  image: string;
}

/** Tela de detalhe. */
export interface CharacterDetail extends CharacterSummary {
  type: string;
  gender: string;
  origin: string;
  location: string;
  episodeIds: number[];
}

/** Busca (F3) e filtro (F4) juntos — a API aceita `?name=rick&status=dead`. */
export interface CharacterFilters {
  name?: string;
  status?: CharacterStatus;
}

/** Uma página já mapeada; `nextPage` null quer dizer que acabou. */
export interface Page<T> {
  items: T[];
  nextPage: number | null;
}
