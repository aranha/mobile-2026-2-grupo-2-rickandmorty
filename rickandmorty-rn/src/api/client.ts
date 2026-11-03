const BASE_URL = 'https://rickandmortyapi.com/api';
const TIMEOUT_MS = 10_000;

export type ApiErrorKind = 'not-found' | 'network' | 'http';

/** Único tipo de erro que sai da camada api/ — a UI decide a mensagem pelo `kind`. */
export class ApiError extends Error {
  constructor(
    readonly kind: ApiErrorKind,
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export type QueryParams = Record<string, string | number | undefined>;

export function buildUrl(path: string, params: QueryParams = {}): string {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
  return `${BASE_URL}${path}${query ? `?${query}` : ''}`;
}

export async function getJson<T>(path: string, params?: QueryParams, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  signal?.addEventListener('abort', () => controller.abort());

  let res: Response;
  try {
    res = await fetch(buildUrl(path, params), { signal: controller.signal });
  } catch {
    throw new ApiError('network', 'Não foi possível falar com a API. Confira sua internet.');
  } finally {
    clearTimeout(timer);
  }

  // A API responde 404 tanto para id inexistente quanto para busca sem resultado.
  if (res.status === 404) throw new ApiError('not-found', 'Nada encontrado.', 404);
  if (!res.ok) throw new ApiError('http', `A API respondeu com erro ${res.status}.`, res.status);
  return (await res.json()) as T;
}
