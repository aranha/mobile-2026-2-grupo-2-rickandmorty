jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
  removeItem: jest.fn(async () => undefined),
}));

import { useFavoritesStore } from './favoritesStore';
import type { CharacterSummary } from '../domain/character';

const rick: CharacterSummary = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'alive',
  species: 'Human',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
};

beforeEach(() => {
  useFavoritesStore.setState({ byId: {} });
});

describe('favoritesStore', () => {
  it('adiciona um snapshot ao favoritar', () => {
    useFavoritesStore.getState().toggle(rick);

    expect(useFavoritesStore.getState().byId).toEqual({ [rick.id]: rick });
  });

  it('remove o snapshot ao desfavoritar', () => {
    useFavoritesStore.getState().toggle(rick);
    useFavoritesStore.getState().toggle(rick);

    expect(useFavoritesStore.getState().byId).toEqual({});
  });

  it('não duplica o mesmo personagem', () => {
    useFavoritesStore.getState().add(rick);
    useFavoritesStore.getState().add(rick);

    expect(Object.keys(useFavoritesStore.getState().byId)).toHaveLength(1);
  });
});
