import type { ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CharactersScreen } from '../screens/CharactersScreen';
import { EpisodesScreen } from '../screens/EpisodesScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const tabIcon =
  (name: IconName) =>
  ({ color, size }: { color: string; size: number }) => <MaterialCommunityIcons name={name} color={color} size={size} />;

export function RootTabs() {
  return (
    <Tab.Navigator>
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
        options={{ title: 'Favoritos', tabBarIcon: tabIcon('star'), tabBarButtonTestID: 'tab-favorites' }}
      />
    </Tab.Navigator>
  );
}
