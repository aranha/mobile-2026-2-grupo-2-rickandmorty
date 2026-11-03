import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CharacterDetailScreen } from '../screens/CharacterDetailScreen';
import { EpisodeDetailScreen } from '../screens/EpisodeDetailScreen';
import { RootTabs } from './RootTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={RootTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="CharacterDetail"
        component={CharacterDetailScreen}
        options={({ route }) => ({ title: route.params.name ?? 'Personagem' })}
      />
      <Stack.Screen
        name="EpisodeDetail"
        component={EpisodeDetailScreen}
        options={({ route }) => ({ title: route.params.code ?? 'Episódio' })}
      />
    </Stack.Navigator>
  );
}
