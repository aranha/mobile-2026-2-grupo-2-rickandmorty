import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';
import { darkColors, lightColors } from './colors';

// Material 3 com a paleta do desenho. Só as cores mudam; o resto (tipografia, animação) é do MD3.
export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: { ...MD3LightTheme.colors, ...lightColors },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: { ...MD3DarkTheme.colors, ...darkColors },
};
