import { StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OfflineBanner } from '../components/OfflineBanner';
import { CharacterDetailScreen } from '../screens/CharacterDetailScreen';
import { EpisodeDetailScreen } from '../screens/EpisodeDetailScreen';
import { RootTabs } from './RootTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={RootTabs} options={{ headerShown: false }} />
      {/* Banner de sem internet abaixo do header dos detalhes (as abas têm o próprio, em RootTabs). */}
      <Stack.Group
        screenLayout={({ children }) => (
          <View style={styles.screen}>
            <OfflineBanner />
            {children}
          </View>
        )}
      >
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
      </Stack.Group>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
