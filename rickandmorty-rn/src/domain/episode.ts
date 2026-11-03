export interface Episode {
  id: number;
  name: string;
  code: string; // "S01E01"
  airDate: string;
  season: number;
  number: number;
  characterIds: number[];
}

export interface EpisodeCode {
  season: number;
  episode: number;
}

/** Formato que a SectionList da aba Episódios recebe. */
export interface SeasonSection {
  season: number;
  data: Episode[];
}

// TODO(F6 · Rafael): "S02E07" → { season: 2, episode: 7 }. Decidir o que fazer com código inválido.
export function parseEpisodeCode(code: string): EpisodeCode {
  throw new Error('TODO(F6 · Rafael): parseEpisodeCode');
}

// TODO(F6 · Rafael): agrupar por temporada, temporadas e episódios em ordem.
export function groupBySeason(episodes: Episode[]): SeasonSection[] {
  throw new Error('TODO(F6 · Rafael): groupBySeason');
}
