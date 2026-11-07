// Número no fim da URL, com ou sem barra final: ".../episode/28" ou ".../episode/28/".
const TRAILING_ID = /\/(\d+)\/?$/;

/**
 * "https://rickandmortyapi.com/api/episode/28" → 28.
 * Usado no detalhe do personagem (episode[]) e no detalhe do episódio (characters[]).
 * URL sem id no fim é descartada em vez de virar NaN.
 */
export function idsFromUrls(urls: string[]): number[] {
  return urls
    .map((url) => Number(url.match(TRAILING_ID)?.[1]))
    .filter((id) => Number.isInteger(id) && id > 0);
}

/**
 * A API devolve objeto para um id (/episode/1) e array para vários (/episode/1,2,3).
 * Normaliza para sempre ser array.
 */
export function asArray<T>(data: T | T[]): T[] {
  return Array.isArray(data) ? data : [data];
}
