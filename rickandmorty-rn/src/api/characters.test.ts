import {
  getCharacters,
  toCharacterPage,
  toCharacterSummary,
  toCharacterDetail,
} from './characters';
import { ApiError } from './client';
import type { CharacterDto, PageDto } from './dto';

// Rick Sanchez como a API devolve (só os campos que importam aqui).
function characterDto(overrides: Partial<CharacterDto> = {}): CharacterDto {
  return {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
    location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: ['https://rickandmortyapi.com/api/episode/1'],
    url: 'https://rickandmortyapi.com/api/character/1',
    created: '2017-11-04T18:48:46.250Z',
    ...overrides,
  };
}

function pageDto(next: string | null, results: CharacterDto[] = [characterDto()]): PageDto<CharacterDto> {
  return { info: { count: 826, pages: 42, next, prev: null }, results };
}

describe('toCharacterSummary', () => {
  it('leva só o que a lista usa e passa o status para minúsculo', () => {
    expect(toCharacterSummary(characterDto())).toEqual({
      id: 1,
      name: 'Rick Sanchez',
      status: 'alive',
      species: 'Human',
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    });
  });

  it('mapeia Dead e unknown, e status fora do contrato vira unknown', () => {
    expect(toCharacterSummary(characterDto({ status: 'Dead' })).status).toBe('dead');
    expect(toCharacterSummary(characterDto({ status: 'unknown' })).status).toBe('unknown');
    const unexpected = characterDto({ status: 'Zombie' as CharacterDto['status'] });
    expect(toCharacterSummary(unexpected).status).toBe('unknown');
  });
});

describe('toCharacterPage', () => {
  it('tira o número da próxima página de info.next', () => {
    const page = toCharacterPage(pageDto('https://rickandmortyapi.com/api/character/?page=3'));
    expect(page.nextPage).toBe(3);
    expect(page.items).toHaveLength(1);
  });

  it('acha a página mesmo com busca e filtro na URL', () => {
    const next = 'https://rickandmortyapi.com/api/character/?name=rick&page=2&status=dead';
    expect(toCharacterPage(pageDto(next)).nextPage).toBe(2);
  });

  it('nextPage é null na última página', () => {
    expect(toCharacterPage(pageDto(null)).nextPage).toBeNull();
  });
});

describe('F2 - toCharacterDetail', () => {
  it('mapeia os dados completos do personagem', () => {
    const detail = toCharacterDetail(characterDto());

    expect(detail.id).toBe(1);
    expect(detail.name).toBe('Rick Sanchez');
    expect(detail.status).toBe('alive');
    expect(detail.species).toBe('Human');
    expect(detail.gender).toBe('Male');
    expect(detail.origin).toBe('Earth (C-137)');
    expect(detail.location).toBe('Citadel of Ricks');
  });

  it('converte campos vazios para travessão', () => {
    const detail = toCharacterDetail(
      characterDto({
        type: '',
        origin: { name: '', url: '' },
        location: { name: '', url: '' },
      }),
    );

    expect(detail.type).toBe('—');
    expect(detail.origin).toBe('—');
    expect(detail.location).toBe('—');
  });

  it('extrai corretamente os IDs dos episódios', () => {
    const detail = toCharacterDetail(
      characterDto({
        episode: [
          'https://rickandmortyapi.com/api/episode/1',
          'https://rickandmortyapi.com/api/episode/2',
        ],
      }),
    );

    expect(detail.episodeIds).toEqual([1, 2]);
  });
});

describe('F3 - getCharacters (busca)', () => {
  function mockFetch(status: number, body: unknown = { error: 'There is nothing here' }) {
    global.fetch = jest.fn().mockResolvedValue({ ok: status < 400, status, json: async () => body }) as unknown as typeof fetch;
  }

  it('busca sem resultado (404) vira página vazia, não erro', async () => {
    mockFetch(404);

    await expect(getCharacters({ name: 'xyzxyz' }, 1)).resolves.toEqual({ items: [], nextPage: null });
  });

  it('erro 500 continua sendo erro', async () => {
    mockFetch(500);

    const error = await getCharacters({ name: 'rick' }, 1).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ kind: 'http', status: 500 });
  });

  it('com resultado, devolve a página mapeada', async () => {
    mockFetch(200, pageDto(null));

    await expect(getCharacters({ name: 'rick' }, 1)).resolves.toMatchObject({ items: [{ id: 1 }], nextPage: null });
  });
});
