import type { CharacterStatus } from '../domain/character';

// Espaçamento, raio e cores fixas num lugar só. Tela nenhuma escreve número ou cor solta.
// TODO(F7 · Sesaque): paleta do desenho (verde portal, ciano, fundo espacial) e fonte própria.

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const radius = { sm: 8, md: 12, lg: 20, pill: 999 } as const;

export const statusColors: Record<CharacterStatus, string> = {
  alive: '#55CC44',
  dead: '#D63D2E',
  unknown: '#9E9E9E',
};
