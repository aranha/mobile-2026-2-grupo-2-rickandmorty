import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CharacterSummary } from '../domain/character';

export interface FavoritesState {
  byId: Record<number, CharacterSummary>;
  toggle: (character: CharacterSummary) => void;
  add: (character: CharacterSummary) => void;
  remove: (id: number) => void;
}

export const FAVORITES_STORAGE_KEY = 'rick-and-morty-favorites';

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      byId: {},
      toggle: (character) =>
        set((state) => {
          const next = { ...state.byId };
          if (next[character.id]) {
            delete next[character.id];
          } else {
            next[character.id] = character;
          }
          return { byId: next };
        }),
      add: (character) =>
        set((state) => ({
          byId: { ...state.byId, [character.id]: character },
        })),
      remove: (id) =>
        set((state) => {
          const next = { ...state.byId };
          delete next[id];
          return { byId: next };
        }),
    }),
    {
      name: FAVORITES_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ byId: state.byId }),
    },
  ),
);
