import type { ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import { darkTheme, lightTheme } from './paperThemes';

// O tema do Paper também pinta header e abas do React Navigation.
const { LightTheme: navigationLight, DarkTheme: navigationDark } = adaptNavigationTheme({
  reactNavigationLight: NavigationLightTheme,
  reactNavigationDark: NavigationDarkTheme,
  materialLight: lightTheme,
  materialDark: darkTheme,
});

export function AppThemeProvider({ children }: { children: ReactNode }) {
  // TODO(F7 · Sesaque): trocar por resolveTheme(preference do themeStore, esquema do sistema).
  const isDark = useColorScheme() === 'dark';

  return (
    <PaperProvider
      theme={isDark ? darkTheme : lightTheme}
      settings={{ icon: (props) => <MaterialCommunityIcons {...props} /> }}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer theme={isDark ? navigationDark : navigationLight}>
        {children}
      </NavigationContainer>
    </PaperProvider>
  );
}
