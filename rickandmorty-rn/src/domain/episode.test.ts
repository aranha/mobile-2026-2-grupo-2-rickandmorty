import { formatAirDate, groupBySeason, parseEpisodeCode, type Episode } from './episode';

function episode(id: number, season: number, number: number): Episode {
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    id,
    name: `Episódio ${id}`,
    code: `S${pad(season)}E${pad(number)}`,
    airDate: 'December 2, 2013',
    season,
    number,
    characterIds: [],
  };
}

describe('parseEpisodeCode', () => {
  it('"S02E07" → temporada 2, episódio 7', () => {
    expect(parseEpisodeCode('S02E07')).toEqual({ season: 2, episode: 7 });
  });

  it('aceita minúscula e espaços nas pontas', () => {
    expect(parseEpisodeCode(' s05e10 ')).toEqual({ season: 5, episode: 10 });
  });

  it('lança erro para código fora do formato SxxEyy', () => {
    expect(() => parseEpisodeCode('')).toThrow('Código de episódio inválido');
    expect(() => parseEpisodeCode('Pilot')).toThrow();
    expect(() => parseEpisodeCode('S01')).toThrow();
    expect(() => parseEpisodeCode('S01E01x')).toThrow();
  });
});

describe('groupBySeason', () => {
  it('agrupa por temporada com temporadas e episódios em ordem', () => {
    const shuffled = [episode(12, 2, 2), episode(1, 1, 1), episode(11, 2, 1), episode(2, 1, 2)];

    const sections = groupBySeason(shuffled);

    expect(sections.map((s) => s.season)).toEqual([1, 2]);
    expect(sections[0].data.map((e) => e.id)).toEqual([1, 2]);
    expect(sections[1].data.map((e) => e.id)).toEqual([11, 12]);
  });

  it('não altera a lista recebida', () => {
    const input = [episode(2, 1, 2), episode(1, 1, 1)];
    groupBySeason(input);
    expect(input.map((e) => e.id)).toEqual([2, 1]);
  });

  it('lista vazia → nenhuma seção', () => {
    expect(groupBySeason([])).toEqual([]);
  });
});

describe('formatAirDate', () => {
  it('"December 2, 2013" → "02/12/2013"', () => {
    expect(formatAirDate('December 2, 2013')).toBe('02/12/2013');
    expect(formatAirDate('September 10, 2017')).toBe('10/09/2017');
  });

  it('fora do formato devolve o texto original', () => {
    expect(formatAirDate('')).toBe('');
    expect(formatAirDate('Smarch 2, 2013')).toBe('Smarch 2, 2013');
  });
});
