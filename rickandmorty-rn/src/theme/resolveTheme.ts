import type { ColorSchemeName } from 'react-native';
import type { ThemePreference } from '../stores/themeStore';

export type ResolvedTheme = 'light' | 'dark';

/**
 * Preferência do usuário + esquema do sistema → tema final.
 * "Sistema" segue o aparelho; se ele não informar (null, undefined ou 'unspecified'), fica no claro.
 */
export function resolveTheme(
  preference: ThemePreference,
  system: ColorSchemeName | null | undefined,
): ResolvedTheme {
  if (preference !== 'system') return preference;
  return system === 'dark' ? 'dark' : 'light';
}
