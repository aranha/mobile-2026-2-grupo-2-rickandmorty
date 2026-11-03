// Formato cru da Rick and Morty API (https://rickandmortyapi.com/documentation).
// Só a camada api/ conhece estes tipos; o resto do app usa os de domain/.

export interface PageDto<T> {
  info: { count: number; pages: number; next: string | null; prev: string | null };
  results: T[];
}

export interface CharacterDto {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface EpisodeDto {
  id: number;
  name: string;
  air_date: string;
  episode: string; // "S01E01"
  characters: string[];
  url: string;
  created: string;
}
