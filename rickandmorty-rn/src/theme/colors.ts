import { palette } from './tokens';

// Cores dos temas claro e escuro, separadas do Paper para o teste de contraste rodar sem ele.
// Claro: verde e ciano escuros, para texto branco em cima passar no contraste (WCAG AA).
// Escuro: o verde do portal em cima do fundo espacial.

export const lightColors = {
  primary: palette.portalGreenDeep,
  onPrimary: '#FFFFFF',
  primaryContainer: palette.portalGreenLight,
  onPrimaryContainer: '#0F2000',
  secondary: palette.cyanDeep,
  onSecondary: '#FFFFFF',
  secondaryContainer: palette.cyanLight,
  onSecondaryContainer: '#001F26',
  tertiary: palette.mortyYellowDeep,
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#F8E66A',
  onTertiaryContainer: '#201C00',
  background: palette.labWhite,
  onBackground: palette.ink,
  surface: palette.labWhite,
  onSurface: palette.ink,
  surfaceVariant: palette.labGray,
  onSurfaceVariant: '#42493C',
  outline: '#72796B',
  outlineVariant: '#C2C9B9',
  inversePrimary: palette.portalGreen,
  elevation: {
    level0: 'transparent',
    level1: '#EEF5E6',
    level2: '#E9F1E0',
    level3: '#E4EDDA',
    level4: '#E2ECD8',
    level5: '#DEE9D3',
  },
} as const;

export const darkColors = {
  primary: palette.portalGreen,
  onPrimary: '#173800',
  primaryContainer: palette.portalGreenDark,
  onPrimaryContainer: '#B9F27C',
  secondary: palette.cyan,
  onSecondary: '#003641',
  secondaryContainer: palette.cyanDark,
  onSecondaryContainer: palette.cyanLight,
  tertiary: palette.mortyYellow,
  onTertiary: '#363100',
  tertiaryContainer: '#4F4700',
  onTertiaryContainer: '#F8E66A',
  background: palette.spaceBlack,
  onBackground: '#E2E8F0',
  surface: palette.spaceBlack,
  onSurface: '#E2E8F0',
  surfaceVariant: palette.spaceSlate,
  onSurfaceVariant: '#C2CCD8',
  outline: '#8C97A6',
  outlineVariant: '#3A4656',
  inversePrimary: palette.portalGreenDeep,
  elevation: {
    level0: 'transparent',
    level1: palette.spaceNavy,
    level2: '#172235',
    level3: '#1A273B',
    level4: '#1B293E',
    level5: '#1E2D43',
  },
} as const;
