import { useCallback, useLayoutEffect } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { ActivityIndicator, Chip, Divider, Text, useTheme } from 'react-native-paper';
import { ErrorState } from '../components/ErrorState';
import type { CharacterSummary } from '../domain/character';
import { formatAirDate, type Episode } from '../domain/episode';
import type { RootScreenProps } from '../navigation/types';
import { useCharactersByIds, useEpisode } from '../queries/useEpisodes';
import { radius, spacing } from '../theme/tokens';

const COLUMNS = 3;

// Detalhe do episódio (F6 · Rafael): nome, código, data e a grade de quem aparece nele.
export function EpisodeDetailScreen({ route, navigation }: RootScreenProps<'EpisodeDetail'>) {
  const { id } = route.params;
  const episodeQuery = useEpisode(id);
  const episode = episodeQuery.data;
  // Segunda consulta depende da primeira: só dispara quando os ids existem (enabled no hook).
  const charactersQuery = useCharactersByIds(episode?.characterIds ?? []);

  useLayoutEffect(() => {
    navigation.setOptions({ title: episode?.code ?? route.params.code ?? 'Episódio' });
  }, [navigation, episode?.code, route.params.code]);

  const openCharacter = useCallback(
    (character: CharacterSummary) => navigation.push('CharacterDetail', { id: character.id, name: character.name }),
    [navigation],
  );

  if (episodeQuery.isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" accessibilityLabel="Carregando episódio" />
      </View>
    );
  }

  if (!episode) {
    return <ErrorState message="Não foi possível carregar o episódio." onRetry={() => episodeQuery.refetch()} />;
  }

  return (
    <FlatList
      testID="episode-detail-screen"
      data={charactersQuery.data ?? []}
      keyExtractor={(item) => String(item.id)}
      numColumns={COLUMNS}
      contentContainerStyle={styles.content}
      ListHeaderComponent={<EpisodeHeader episode={episode} />}
      renderItem={({ item }) => <CharacterTile character={item} onPress={() => openCharacter(item)} />}
      ListEmptyComponent={
        charactersQuery.isError ? (
          <ErrorState message="Não deu para carregar os personagens." onRetry={() => charactersQuery.refetch()} />
        ) : (
          <ActivityIndicator style={styles.gridLoading} accessibilityLabel="Carregando personagens" />
        )
      }
    />
  );
}

function EpisodeHeader({ episode }: { episode: Episode }) {
  return (
    <View style={styles.header}>
      <Text variant="headlineSmall" style={styles.title}>
        {episode.name}
      </Text>
      <View style={styles.chips}>
        <Chip icon="television-classic" compact>
          Temporada {episode.season} · Episódio {episode.number}
        </Chip>
        <Chip icon="calendar" compact>
          {formatAirDate(episode.airDate)}
        </Chip>
      </View>
      <Divider style={styles.divider} />
      <Text variant="titleMedium">
        {episode.characterIds.length} personagens no episódio
      </Text>
    </View>
  );
}

function CharacterTile({ character, onPress }: { character: CharacterSummary; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      testID={`episode-character-${character.id}`}
      onPress={onPress}
      style={styles.tile}
      accessibilityRole="button"
      accessibilityLabel={character.name}
    >
      <Image
        source={character.image}
        style={[styles.avatar, { backgroundColor: colors.surfaceVariant }]}
        transition={150}
      />
      <Text variant="bodySmall" numberOfLines={2} style={styles.tileName}>
        {character.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { marginBottom: spacing.md },
  title: { fontWeight: 'bold', marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  divider: { marginVertical: spacing.md },
  // Largura fixa de 1/3: a última linha incompleta não estica os itens.
  tile: { width: `${100 / COLUMNS}%`, alignItems: 'center', padding: spacing.xs, marginBottom: spacing.sm },
  avatar: { width: '100%', aspectRatio: 1, borderRadius: radius.md },
  tileName: { textAlign: 'center', marginTop: spacing.xs },
  gridLoading: { marginTop: spacing.lg },
});
