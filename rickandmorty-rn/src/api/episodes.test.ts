import { getAllEpisodes, getEpisodesByIds, toEpisode } from './episodes';
import { getCharactersByIds } from './characters';
import type { EpisodeDto, PageDto } from './dto';

function episodeDto(id: number, code: string): EpisodeDto {
  return {
    id,
    name: 'Pilot',
    air_date: 'December 2, 2013',
    episode: code,
    characters: [
      'https://rickandmortyapi.com/api/character/1',
      'https://rickandmortyapi.com/api/character/2',
    ],
    url: `https://rickandmortyapi.com/api/episode/${id}`,
    created: '2017-11-10T12:56:33.798Z',
  };
}

// Troca o fetch de verdade por um falso que responde o JSON que o teste quiser.
const fetchMock = jest.fn();
globalThis.fetch =fetchMock as unknown as typeof fetch;

function respondWith(...bodies: unknown[]) {
  for (const body of bodies) {
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => body });
  }
}

const calledUrls = () => fetchMock.mock.calls.map(([url]) => url as string);

describe('toEpisode', () => {
  it('converte código em temporada/número e URLs de personagens em ids', () => {
    expect(toEpisode(episodeDto(1, 'S01E01'))).toEqual({
      id: 1,
      name: 'Pilot',
      code: 'S01E01',
      airDate: 'December 2, 2013',
      season: 1,
      number: 1,
      characterIds: [1, 2],
    });
  });
});

describe('getAllEpisodes', () => {
  it('lê a primeira página e busca as outras', () => {
    const page = (n: number, pages: number): PageDto<EpisodeDto> => ({
      info: { count: 3, pages, next: null, prev: null },
      results: [episodeDto(n, `S01E0${n}`)],
    });
    respondWith(page(1, 3), page(2, 3), page(3, 3));

    return getAllEpisodes().then((episodes) => {
      expect(episodes.map((e) => e.id)).toEqual([1, 2, 3]);
      expect(calledUrls()).toEqual([
        'https://rickandmortyapi.com/api/episode?page=1',
        'https://rickandmortyapi.com/api/episode?page=2',
        'https://rickandmortyapi.com/api/episode?page=3',
      ]);
    });
  });
});

describe('getEpisodesByIds — objeto × array', () => {
  it('um id: a API devolve objeto e mesmo assim sai array', async () => {
    respondWith(episodeDto(1, 'S01E01'));
    const episodes = await getEpisodesByIds([1]);
    expect(episodes.map((e) => e.id)).toEqual([1]);
    expect(calledUrls()).toEqual(['https://rickandmortyapi.com/api/episode/1']);
  });

  it('vários ids: a API devolve array', async () => {
    respondWith([episodeDto(1, 'S01E01'), episodeDto(2, 'S01E02')]);
    const episodes = await getEpisodesByIds([1, 2]);
    expect(episodes.map((e) => e.id)).toEqual([1, 2]);
    expect(calledUrls()).toEqual(['https://rickandmortyapi.com/api/episode/1,2']);
  });

  it('nenhum id: não chama a API', async () => {
    expect(await getEpisodesByIds([])).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('getCharactersByIds — objeto × array', () => {
  const rick = {
    id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human',
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  };

  it('um id (objeto) e vários ids (array) saem como array', async () => {
    respondWith(rick, [rick, { ...rick, id: 2, name: 'Morty Smith' }]);
    expect((await getCharactersByIds([1])).map((c) => c.id)).toEqual([1]);
    expect((await getCharactersByIds([1, 2])).map((c) => c.name)).toEqual(['Rick Sanchez', 'Morty Smith']);
  });

  it('nenhum id: não chama a API', async () => {
    expect(await getCharactersByIds([])).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
