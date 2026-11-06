import type { CharacterStatus } from '../domain/character';

// Espaçamento, raio e cores fixas num lugar só. Tela nenhuma escreve número ou cor solta:
// as cores que mudam com o tema vêm do `useTheme()` do Paper (paperThemes.ts), que parte desta paleta.

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const radius = { sm: 8, md: 12, lg: 20, pill: 999 } as const;

/** Paleta do desenho: verde do portal, ciano do cabelo do Rick, amarelo da camisa do Morty e o espaço. */
export const palette = {
  portalGreen: '#97CE4C',
  portalGreenDeep: '#3D7A12',
  portalGreenLight: '#C5EE95',
  portalGreenDark: '#2C5200',
  cyan: '#5DD5F0',
  cyanDeep: '#00687A',
  cyanLight: '#AEECFF',
  cyanDark: '#004E5D',
  mortyYellow: '#F0E14A',
  mortyYellowDeep: '#6B5F00',
  spaceBlack: '#0B1220',
  spaceNavy: '#141E30',
  spaceSlate: '#253041',
  labWhite: '#F6FBF1',
  labGray: '#DEE6D4',
  ink: '#181D14',
} as const;

export const statusColors: Record<CharacterStatus, string> = {
  alive: '#55CC44',
  dead: '#D63D2E',
  unknown: '#9E9E9E',
};

/** Rótulo de um personagem (singular); os chips do filtro usam o plural. */
export const statusLabels: Record<CharacterStatus, string> = {
  alive: 'Vivo',
  dead: 'Morto',
  unknown: 'Desconhecido',
};
