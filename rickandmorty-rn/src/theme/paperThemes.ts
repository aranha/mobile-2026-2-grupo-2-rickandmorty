import { MD3DarkTheme, MD3LightTheme, configureFonts, type MD3Theme } from 'react-native-paper';
import { darkColors, lightColors } from './colors';
import { fonts } from './tokens';

// Títulos com a Fredoka; corpo e rótulos seguem a fonte do sistema (legibilidade em texto corrido).
// fontWeight 'normal': o peso já está no arquivo da fonte, e outro peso faz o Android cair na fonte do sistema.
const display = { fontFamily: fonts.display, fontWeight: 'normal' } as const;
const title = { fontFamily: fonts.title, fontWeight: 'normal' } as const;

const appFonts = configureFonts({
  config: {
    displayLarge: display,
    displayMedium: display,
    displaySmall: display,
    headlineLarge: display,
    headlineMedium: display,
    headlineSmall: display,
    titleLarge: title,
    titleMedium: title,
  },
});

// Material 3 com a paleta do desenho e a fonte dos títulos.
export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: { ...MD3LightTheme.colors, ...lightColors },
  fonts: appFonts,
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: { ...MD3DarkTheme.colors, ...darkColors },
  fonts: appFonts,
};
