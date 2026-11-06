import { useCallback, useMemo, useState } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';
import { ApiError } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Skeleton } from '../components/Skeleton';
import { formatAirDate, groupBySeason, type Episode, type SeasonSection } from '../domain/episode';
import type { TabScreenProps } from '../navigation/types';
import { useEpisodes } from '../queries/useEpisodes';
import { spacing } from '../theme/tokens';

const SKELETON_ROWS = 10;

// Aba Episódios (F6 · Rafael): os 51 episódios agrupados por temporada.
export function EpisodesScreen({ navigation }: TabScreenProps<'Episodes'>) {
  const { colors } = useTheme();
  const query = useEpisodes();
  const { refetch } = query;
  const [refreshing, setRefreshing] = useState(false);

  // groupBySeason só roda de novo quando os dados mudam, não a cada render.
  const sections = useMemo(() => groupBySeason(query.data ?? []), [query.data]);

  const openDetail = useCallback(
    (episode: Episode) => navigation.navigate('EpisodeDetail', { id: episode.id, code: episode.code }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Episode }) => (
      <List.Item
        testID={`episode-row-${item.id}`}
        title={item.name}
        description={`${item.code} · ${formatAirDate(item.airDate)}`}
        left={(props) => <List.Icon {...props} icon="television-play" />}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        onPress={() => openDetail(item)}
      />
    ),
    [openDetail],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: SeasonSection }) => (
      <View style={[styles.header, { backgroundColor: colors.elevation.level2 }]}>
        <Text variant="titleMedium" accessibilityRole="header">
          Temporada {section.season}
        </Text>
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
          {section.data.length} episódios
        </Text>
      </View>
    ),
    [colors],
  );

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  if (query.isPending) return <EpisodesSkeleton />;

  if (query.isError && sections.length === 0) {
    const message = query.error instanceof ApiError ? query.error.message : 'Não foi possível carregar os episódios.';
    return <ErrorState message={message} onRetry={() => refetch()} />;
  }

  if (sections.length === 0) return <EmptyState title="Nenhum episódio por aqui" />;

  return (
    <SectionList
      testID="episodes-screen"
      sections={sections}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      stickySectionHeadersEnabled
      refreshing={refreshing}
      onRefresh={refresh}
    />
  );
}

function EpisodesSkeleton() {
  return (
    <View style={styles.skeleton} accessibilityLabel="Carregando episódios">
      <Skeleton width="40%" height={20} />
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <View key={index} style={styles.skeletonRow}>
          <Skeleton width="70%" height={14} />
          <Skeleton width="40%" height={12} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  skeleton: { padding: spacing.md, gap: spacing.md },
  skeletonRow: { gap: spacing.sm, paddingVertical: spacing.xs },
});
