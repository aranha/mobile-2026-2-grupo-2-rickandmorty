import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import type { CharacterFilters } from '../domain/character';
import { useCharacters } from './useCharacters';

// Uma página como a API devolve, só com o necessário.
const page = {
  info: { count: 1, pages: 1, next: null, prev: null },
  results: [
    {
      id: 8,
      name: 'Adjudicator Rick',
      status: 'Dead',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'unknown', url: '' },
      location: { name: 'Citadel of Ricks', url: '' },
      image: 'https://rickandmortyapi.com/api/character/avatar/8.jpeg',
      episode: [],
      url: 'https://rickandmortyapi.com/api/character/8',
      created: '2017-11-04T20:03:34.737Z',
    },
  ],
};

const fetchMock = jest.fn();
let client: QueryClient;

beforeEach(() => {
  fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => page });
  global.fetch = fetchMock as unknown as typeof fetch;
  // gcTime Infinity: o TanStack não agenda o timer de limpeza, e o Jest sai sem processo pendurado.
  client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } });
});

afterEach(() => client.clear());

async function renderUseCharacters(filters: CharacterFilters) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, ...(await renderHook(() => useCharacters(filters), { wrapper })) };
}

describe('useCharacters (filtro na API)', () => {
  it('manda o status para a API, não filtra a página carregada', async () => {
    const { result } = await renderUseCharacters({ status: 'dead' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe('https://rickandmortyapi.com/api/character?page=1&status=dead');
    expect(result.current.data?.pages[0].items[0]).toMatchObject({ id: 8, status: 'dead' });
  });

  it('combina com a busca: ?name=rick&status=dead, nome sem espaços', async () => {
    const { result } = await renderUseCharacters({ name: ' rick ', status: 'dead' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock.mock.calls[0][0]).toBe('https://rickandmortyapi.com/api/character?page=1&name=rick&status=dead');
  });

  it('" rick " e "rick" usam a mesma chave de cache', async () => {
    const { client, result } = await renderUseCharacters({ name: ' rick ' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.getQueryCache().find({ queryKey: ['characters', { name: 'rick' }] })).toBeDefined();
  });
});
