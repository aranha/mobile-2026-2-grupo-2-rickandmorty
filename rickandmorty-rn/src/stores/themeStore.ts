import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'system' | 'light' | 'dark';

export interface ThemeState {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

// A escolha sobrevive a fechar o app. Só a preferência vai para o disco, nunca as funções.
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference) => set({ preference }),
    }),
    {
      name: 'theme-preference',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ preference }) => ({ preference }),
    },
  ),
);
