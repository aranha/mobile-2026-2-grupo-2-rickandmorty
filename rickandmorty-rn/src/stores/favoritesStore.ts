import { create } from 'zustand';
import type { CharacterSummary } from '../domain/character';

export interface FavoritesState {
  /** Snapshot por id: a aba Favoritos funciona sem internet. */
  byId: Record<number, CharacterSummary>;
  toggle: (character: CharacterSummary) => void;
}

// TODO(F5 · Marcus): implementar o toggle e persistir com `persist` + AsyncStorage
// (chave nova — o skeleton usava `favorite_pokemon_ids`).
export const useFavoritesStore = create<FavoritesState>()(() => ({
  byId: {},
  toggle: () => {
    throw new Error('TODO(F5 · Marcus): toggle');
  },
}));
