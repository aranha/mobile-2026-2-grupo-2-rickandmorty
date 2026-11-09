import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { OfflineBanner } from '../components/OfflineBanner';
import { ThemeMenu } from '../components/ThemeMenu';
import { CharactersScreen } from '../screens/CharactersScreen';
import { EpisodesScreen } from '../screens/EpisodesScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { useFavoritesStore } from '../stores/favoritesStore';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const tabIcon =
  (name: IconName) =>
  ({ color, size }: { color: string; size: number }) => <MaterialCommunityIcons name={name} color={color} size={size} />;

export function RootTabs() {
  const favoriteCount = useFavoritesStore((state) => Object.keys(state.byId).length);

  return (
    <Tab.Navigator
      screenOptions={{ headerRight: () => <ThemeMenu /> }}
      // Banner de sem internet logo abaixo do header, em todas as abas.
      screenLayout={({ children }) => (
        <View style={styles.screen}>
          <OfflineBanner />
          {children}
        </View>
      )}
    >
      <Tab.Screen
        name="Characters"
        component={CharactersScreen}
        options={{ title: 'Personagens', tabBarIcon: tabIcon('account-group'), tabBarButtonTestID: 'tab-characters' }}
      />
      <Tab.Screen
        name="Episodes"
        component={EpisodesScreen}
        options={{ title: 'Episódios', tabBarIcon: tabIcon('television-classic'), tabBarButtonTestID: 'tab-episodes' }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Favoritos',
          tabBarIcon: tabIcon('star'),
          tabBarButtonTestID: 'tab-favorites',
          tabBarBadge: favoriteCount || undefined,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
