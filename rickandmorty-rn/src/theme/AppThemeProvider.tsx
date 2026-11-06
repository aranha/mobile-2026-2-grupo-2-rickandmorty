import { useEffect, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Fredoka_500Medium, Fredoka_600SemiBold, useFonts } from '@expo-google-fonts/fredoka';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import { useThemeStore } from '../stores/themeStore';
import { darkTheme, lightTheme } from './paperThemes';
import { resolveTheme } from './resolveTheme';

// A splash só sai quando a fonte carregou e a preferência de tema foi lida do disco:
// assim o app não abre piscando no tema errado nem com a fonte do sistema nos títulos.
SplashScreen.preventAutoHideAsync().catch(() => {});

// O tema do Paper também pinta header e abas do React Navigation (inclusive a fonte dos títulos).
const { LightTheme: navigationLight, DarkTheme: navigationDark } = adaptNavigationTheme({
  reactNavigationLight: NavigationLightTheme,
  reactNavigationDark: NavigationDarkTheme,
  materialLight: lightTheme,
  materialDark: darkTheme,
});

function useThemeHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useThemeStore.persist.hasHydrated());
  useEffect(() => {
    if (hydrated) return;
    return useThemeStore.persist.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);
  return hydrated;
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const preference = useThemeStore((state) => state.preference);
  const isDark = resolveTheme(preference, useColorScheme()) === 'dark';
  const hydrated = useThemeHydrated();
  // Se a fonte falhar, segue com a do sistema em vez de travar na splash.
  const [fontsLoaded, fontError] = useFonts({ Fredoka_500Medium, Fredoka_600SemiBold });
  const ready = hydrated && (fontsLoaded || fontError !== null);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

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
