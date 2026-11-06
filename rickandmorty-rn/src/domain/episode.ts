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

// "S02E07" → S, dígitos da temporada, E, dígitos do episódio. Aceita minúscula e espaços nas pontas.
const EPISODE_CODE = /^S(\d+)E(\d+)$/i;

/**
 * "S02E07" → { season: 2, episode: 7 }.
 * Código fora do formato lança erro: todos os 51 episódios da API seguem SxxEyy, então algo
 * diferente é contrato quebrado — melhor virar estado de erro do que inventar uma "Temporada 0".
 */
export function parseEpisodeCode(code: string): EpisodeCode {
  const match = code.trim().match(EPISODE_CODE);
  if (!match) throw new Error(`Código de episódio inválido: "${code}"`);
  return { season: Number(match[1]), episode: Number(match[2]) };
}

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

/**
 * "December 2, 2013" (formato da API) → "02/12/2013".
 * Feito à mão porque o Hermes não garante `new Date()` com texto livre. Fora do formato, devolve como veio.
 */
export function formatAirDate(airDate: string): string {
  const match = airDate.trim().match(/^([A-Za-z]+) (\d{1,2}), (\d{4})$/);
  const month = match ? MONTHS.indexOf(match[1].toLowerCase()) + 1 : 0;
  if (!match || month === 0) return airDate;
  const pad = (n: number | string) => String(n).padStart(2, '0');
  return `${pad(match[2])}/${pad(month)}/${match[3]}`;
}

/** Agrupa por temporada (1, 2, 3…) com os episódios de cada uma em ordem. Não altera a lista recebida. */
export function groupBySeason(episodes: Episode[]): SeasonSection[] {
  const bySeason = new Map<number, Episode[]>();
  for (const episode of episodes) {
    const list = bySeason.get(episode.season) ?? [];
    list.push(episode);
    bySeason.set(episode.season, list);
  }

  return [...bySeason.entries()]
    .sort(([a], [b]) => a - b)
    .map(([season, data]) => ({ season, data: data.sort((a, b) => a.number - b.number) }));
}
