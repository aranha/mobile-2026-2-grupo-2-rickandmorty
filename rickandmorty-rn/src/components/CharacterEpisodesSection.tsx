import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { ActivityIndicator, Button, Card, List, Text } from 'react-native-paper';
import { formatAirDate } from '../domain/episode';
import { useEpisodesByIds } from '../queries/useEpisodes';
import { spacing } from '../theme/tokens';

export interface CharacterEpisodesSectionProps {
  episodeIds: number[];
}

const PREVIEW_COUNT = 5;

// "Aparece em N episódios" no detalhe do personagem (F6 · Rafael).
// Fica dentro do ScrollView do detalhe, por isso .map() e não FlatList (lista dentro de lista).
export function CharacterEpisodesSection({ episodeIds }: CharacterEpisodesSectionProps) {
  // Tipado como stack: só a stack tem push (abre um detalhe novo mesmo se já houver um na pilha).
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const query = useEpisodesByIds(episodeIds);
  const [expanded, setExpanded] = useState(false);

  if (episodeIds.length === 0) return null;

  const episodes = query.data ?? [];
  const visible = expanded ? episodes : episodes.slice(0, PREVIEW_COUNT);
  const total = episodeIds.length;

  return (
    <Card style={styles.card} testID="character-episodes-section">
      <Card.Title
        title={`Aparece em ${total} ${total === 1 ? 'episódio' : 'episódios'}`}
        titleVariant="titleMedium"
      />
      <Card.Content>
        {query.isPending && <ActivityIndicator style={styles.loading} accessibilityLabel="Carregando episódios" />}

        {query.isError && (
          <View style={styles.error}>
            <Text variant="bodyMedium">Não deu para carregar os episódios.</Text>
            <Button onPress={() => query.refetch()}>Tentar de novo</Button>
          </View>
        )}

        {visible.map((episode) => (
          <List.Item
            key={episode.id}
            testID={`character-episode-${episode.id}`}
            title={episode.name}
            description={`${episode.code} · ${formatAirDate(episode.airDate)}`}
            left={(props) => <List.Icon {...props} icon="television-play" />}
            onPress={() => navigation.push('EpisodeDetail', { id: episode.id, code: episode.code })}
            style={styles.item}
          />
        ))}

        {episodes.length > PREVIEW_COUNT && (
          <Button onPress={() => setExpanded((value) => !value)}>
            {expanded ? 'Mostrar menos' : `Ver todos (${episodes.length})`}
          </Button>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: spacing.md },
  loading: { marginVertical: spacing.md },
  error: { alignItems: 'center', gap: spacing.sm },
  item: { paddingHorizontal: 0 },
});
