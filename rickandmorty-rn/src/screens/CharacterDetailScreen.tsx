
import { useLayoutEffect } from 'react';
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Divider,
  Text,
} from 'react-native-paper';

import { CharacterEpisodesSection } from '../components/CharacterEpisodesSection';
import { FavoriteButton } from '../components/FavoriteButton';
import { StatusBadge } from '../components/StatusBadge';
import { ErrorState } from '../components/ErrorState';
import type { CharacterDetail } from '../domain/character';
import type { RootScreenProps } from '../navigation/types';
import { useCharacter } from '../queries/useCharacter';

export function CharacterDetailScreen({
  route,
  navigation,
}: RootScreenProps<'CharacterDetail'>) {
  const { id } = route.params;

  const query = useCharacter(id);
  const character = query.data;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: character?.name ?? route.params.name ?? 'Detalhes',
      headerRight: character
        ? () => <FavoriteButton character={character} />
        : undefined,
    });
  }, [navigation, character, route.params.name]);

  async function shareCharacter() {
    if (!character) return;

    const statusLabels = {
      alive: 'Alive',
      dead: 'Dead',
      unknown: 'Unknown',
    };

    const message =
      `Conheça ${character.name} — ` +
      `${character.species}, ${statusLabels[character.status]}`;

    try {
      await Share.share({ message });
    } catch (error) {
      console.warn('Erro ao compartilhar personagem:', error);
    }
  }

  if (query.isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Carregando personagem...</Text>
      </View>
    );
  }

  if (query.isError && !character) {
    return (
      <ErrorState
        message="Não foi possível carregar o personagem."
        onRetry={() => query.refetch()}
      />
    );
  }

  if (!character) return null;

  return (
    <ScrollView
      testID="detail-screen"
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Card style={styles.card}>
        <Image
          source={{ uri: character.image }}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={`Foto de ${character.name}`}
        />

        <Card.Content style={styles.cardContent}>
          <Text variant="headlineMedium" style={styles.name}>
            {character.name}
          </Text>

          <StatusBadge status={character.status} />

          <Divider style={styles.divider} />

          <InfoRow label="Espécie" value={character.species} />

          {query.isPlaceholderData ? (
            <View style={styles.loadingDetails}>
              <ActivityIndicator size="small" />
              <Text>Carregando informações adicionais...</Text>
            </View>
          ) : (
            <>
              <InfoRow label="Tipo" value={character.type} />
              <InfoRow label="Gênero" value={character.gender} />
              <InfoRow label="Origem" value={character.origin} />
              <InfoRow
                label="Localização atual"
                value={character.location}
              />
            </>
          )}

          <Divider style={styles.divider} />

          <Button
            mode="contained"
            icon="share-variant"
            onPress={shareCharacter}
            testID="share-character-button"
          >
            Compartilhar personagem
          </Button>
        </Card.Content>
      </Card>

      {!query.isPlaceholderData && (
        <CharacterEpisodesSection
          episodeIds={character.episodeIds}
        />
      )}
    </ScrollView>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text variant="labelLarge" style={styles.label}>
        {label}
      </Text>
      <Text variant="bodyLarge" style={styles.value}>
        {value || '—'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#E5E5E5',
  },
  cardContent: {
    paddingTop: 20,
    paddingBottom: 24,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  divider: {
    marginVertical: 20,
  },
  infoRow: {
    marginBottom: 16,
  },
  label: {
    opacity: 0.65,
    marginBottom: 4,
  },
  value: {
    fontWeight: '500',
  },
  loadingDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
});
