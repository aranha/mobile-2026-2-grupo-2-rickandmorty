import { buildUrl } from '../api/client';
import type { CharacterStatus } from './character';
import { buildCharacterQuery, normalizeFilters } from './filters';

describe('buildCharacterQuery', () => {
  it('sem filtro manda só a página', () => {
    expect(buildCharacterQuery({}, 1)).toEqual({ page: 1 });
  });

  it('só status', () => {
    expect(buildCharacterQuery({ status: 'dead' }, 1)).toEqual({ page: 1, status: 'dead' });
  });

  it('só nome, sem os espaços das pontas', () => {
    expect(buildCharacterQuery({ name: '  morty ' }, 3)).toEqual({ page: 3, name: 'morty' });
  });

  it('nome e status juntos', () => {
    expect(buildCharacterQuery({ name: ' rick ', status: 'unknown' }, 2)).toEqual({
      page: 2,
      name: 'rick',
      status: 'unknown',
    });
  });

  it('nome só com espaços não vai para a API', () => {
    expect(buildCharacterQuery({ name: '   ', status: 'alive' }, 1)).toEqual({ page: 1, status: 'alive' });
  });

  it('status fora do contrato é ignorado', () => {
    const status = 'zombie' as CharacterStatus;
    expect(buildCharacterQuery({ status }, 1)).toEqual({ page: 1 });
  });

  it('vira a URL que a API espera (?name=rick&status=dead)', () => {
    expect(buildUrl('/character', buildCharacterQuery({ name: 'rick', status: 'dead' }, 2))).toBe(
      'https://rickandmortyapi.com/api/character?page=2&name=rick&status=dead',
    );
  });
});

describe('normalizeFilters', () => {
  it('" rick " e "rick" viram o mesmo filtro (mesma chave de cache)', () => {
    expect(normalizeFilters({ name: ' rick ', status: 'dead' })).toEqual(normalizeFilters({ name: 'rick', status: 'dead' }));
  });

  it('descarta o que está vazio', () => {
    expect(normalizeFilters({ name: '  ', status: undefined })).toEqual({});
  });
});
