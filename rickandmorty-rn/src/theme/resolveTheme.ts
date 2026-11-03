import type { ThemePreference } from '../stores/themeStore';

export type ResolvedTheme = 'light' | 'dark';

// TODO(F7 · Sesaque): preferência do usuário + esquema do sistema → tema final.
// O teste cobre os 3 × 2 casos (e o sistema pode responder null).
export function resolveTheme(
  preference: ThemePreference,
  system: 'light' | 'dark' | null | undefined,
): ResolvedTheme {
  throw new Error('TODO(F7 · Sesaque): resolveTheme');
}
