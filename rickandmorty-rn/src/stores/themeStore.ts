import { create } from 'zustand';

export type ThemePreference = 'system' | 'light' | 'dark';

export interface ThemeState {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

// TODO(F7 · Sesaque): persistir com `persist` + AsyncStorage e criar o seletor na UI.
export const useThemeStore = create<ThemeState>()((set) => ({
  preference: 'system',
  setPreference: (preference) => set({ preference }),
}));
