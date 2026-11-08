
import { useLayoutEffect } from 'react';
import {
  ScrollView,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import {
  Button,
  Card,
  Divider,
  Text,
  useTheme,
} from 'react-native-paper';

import { CharacterEpisodesSection } from '../components/CharacterEpisodesSection';
import { FavoriteButton } from '../components/FavoriteButton';
import { Skeleton } from '../components/Skeleton';
import { StatusBadge } from '../components/StatusBadge';
import { ErrorState } from '../components/ErrorState';
import type { RootScreenProps } from '../navigation/types';
import { useCharacter } from '../queries/useCharacter';
import { radius, spacing } from '../theme/tokens';

const IMAGE_HEIGHT = 300;

export function CharacterDetailScreen({
  route,
  navigation,
}: RootScreenProps<'CharacterDetail'>) {
  const { id } = route.params;
  const { colors } = useTheme();

  const query = useCharacter(id);
  const character = query.data;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: character?.name ?? route.params.name ?? 'Detalhes',
      headerRight: character
        ? () => <FavoriteButton character={character} testID="detail-favorite-button" />
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
    return <DetailSkeleton />;
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
          source={character.image}
          style={[styles.image, { backgroundColor: colors.surfaceVariant }]}
          contentFit="cover"
          transition={200}
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
            <View style={styles.loadingDetails} accessibilityLabel="Carregando informações adicionais">
              <InfoRowSkeleton />
              <InfoRowSkeleton />
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
  const { colors } = useTheme();
  return (
    <View style={styles.infoRow}>
      <Text variant="labelLarge" style={[styles.label, { color: colors.onSurfaceVariant }]}>
        {label}
      </Text>
      <Text variant="bodyLarge" style={styles.value}>
        {value || '—'}
      </Text>
    </View>
  );
}

function InfoRowSkeleton() {
  return (
    <View style={styles.infoRow}>
      <Skeleton width="30%" height={12} />
      <View style={styles.skeletonValue}>
        <Skeleton width="55%" height={16} />
      </View>
    </View>
  );
}

/** Mesmo formato da tela pronta (foto, nome, status e campos), para ela não "pular" quando os dados chegam. */
function DetailSkeleton() {
  return (
    <View style={[styles.container, styles.content]} accessibilityLabel="Carregando personagem">
      <Card style={styles.card}>
        <Skeleton width="100%" height={IMAGE_HEIGHT} borderRadius={0} />
        <Card.Content style={styles.cardContent}>
          <Skeleton width="70%" height={28} />
          <View style={styles.skeletonBadge}>
            <Skeleton width={80} height={22} borderRadius={radius.pill} />
          </View>
          <Divider style={styles.divider} />
          <InfoRowSkeleton />
          <InfoRowSkeleton />
          <InfoRowSkeleton />
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
  },
  cardContent: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  // Sem fontWeight: o headlineMedium já usa a Fredoka do tema, e um peso extra faz o Android cair na fonte do sistema.
  name: {
    marginBottom: spacing.md,
  },
  divider: {
    marginVertical: spacing.lg,
  },
  infoRow: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
  },
  value: {
    fontWeight: '500',
  },
  loadingDetails: {
    paddingTop: spacing.xs,
  },
  skeletonValue: {
    marginTop: spacing.sm,
  },
  skeletonBadge: {
    marginTop: spacing.md,
  },
});
