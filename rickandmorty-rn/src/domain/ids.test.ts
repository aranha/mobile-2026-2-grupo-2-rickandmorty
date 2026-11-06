import { asArray, idsFromUrls } from './ids';

describe('idsFromUrls', () => {
  it('extrai o id do fim de cada URL', () => {
    expect(
      idsFromUrls([
        'https://rickandmortyapi.com/api/episode/1',
        'https://rickandmortyapi.com/api/episode/28',
      ]),
    ).toEqual([1, 28]);
  });

  it('aceita barra no final', () => {
    expect(idsFromUrls(['https://rickandmortyapi.com/api/character/42/'])).toEqual([42]);
  });

  it('descarta URL sem id em vez de devolver NaN', () => {
    expect(idsFromUrls(['https://rickandmortyapi.com/api/episode/', '', 'lixo'])).toEqual([]);
  });
});

describe('asArray (objeto × array da API)', () => {
  it('objeto sozinho vira array de um item', () => {
    expect(asArray({ id: 1 })).toEqual([{ id: 1 }]);
  });

  it('array continua o mesmo', () => {
    expect(asArray([{ id: 1 }, { id: 2 }])).toEqual([{ id: 1 }, { id: 2 }]);
  });
});
