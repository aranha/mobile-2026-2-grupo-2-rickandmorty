import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { ApiError } from '../api/client';
import { CharacterCard } from '../components/CharacterCard';
import { CharacterSearchBar } from '../components/CharacterSearchBar';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Skeleton } from '../components/Skeleton';
import { StatusFilterChips } from '../components/StatusFilterChips';
import type { CharacterFilters, CharacterSummary } from '../domain/character';
import { normalizeFilters } from '../domain/filters';
import type { TabScreenProps } from '../navigation/types';
import { useCharacters } from '../queries/useCharacters';
import { radius, spacing } from '../theme/tokens';

const SKELETON_ROWS = 8;

// Busca (Hugo) e filtro (Guilherme) só mexem no `filters`; a lista (Paulo) lê dele.
export function CharactersScreen({ navigation }: TabScreenProps<'Characters'>) {
  const [filters, setFilters] = useState<CharacterFilters>({});
  const [refreshing, setRefreshing] = useState(false);
  const query = useCharacters(filters);
  const { fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = query;

  const characters = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);

  const openDetail = useCallback(
    (character: CharacterSummary) =>
      navigation.navigate('CharacterDetail', { id: character.id, name: character.name }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: CharacterSummary }) => <CharacterCard character={item} onPress={() => openDetail(item)} />,
    [openDetail],
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Estado local: o `isRefetching` do TanStack também liga em refetch de fundo,
  // e o spinner do pull-to-refresh só deve aparecer quando a pessoa puxou.
  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // Mesmo critério do useCharacters: nome só com espaços não conta como filtro.
  const hasFilters = Object.keys(normalizeFilters(filters)).length > 0;

  let content;
  if (query.isPending) {
    content = <ListSkeleton />;
  } else if (query.isError && characters.length === 0) {
    content = <ErrorState message={errorMessage(query.error)} onRetry={() => refetch()} />;
  } else if (characters.length === 0) {
    content = hasFilters ? (
      <EmptyState title="Nenhum personagem com esses filtros" description="Tente outro nome ou outro status." />
    ) : (
      <EmptyState title="Nenhum personagem por aqui" description="Puxe para baixo para tentar de novo." />
    );
  } else {
    content = (
      <FlatList
        data={characters}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={refresh}
        ListFooterComponent={
          <ListFooter
            loading={isFetchingNextPage}
            failed={query.isFetchNextPageError}
            reachedEnd={!hasNextPage}
            onRetry={() => fetchNextPage()}
          />
        }
      />
    );
  }

  return (
    <View testID="item-list-screen" style={styles.container}>
      <CharacterSearchBar onSearch={(name) => setFilters((current) => ({ ...current, name }))} />
      <StatusFilterChips
        value={filters.status}
        onChange={(status) => setFilters((current) => ({ ...current, status }))}
      />
      {content}
    </View>
  );
}

function errorMessage(error: Error): string {
  return error instanceof ApiError ? error.message : 'Não foi possível carregar os personagens.';
}

/** Mesmo formato do card, para a tela não "pular" quando os dados chegam. */
function ListSkeleton() {
  return (
    <View style={styles.listContent} accessibilityLabel="Carregando personagens">
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <View key={index} style={styles.skeletonRow}>
          <Skeleton width={40} height={40} />
          <View style={styles.skeletonText}>
            <Skeleton width="60%" height={14} />
            <Skeleton width="35%" height={12} />
          </View>
        </View>
      ))}
    </View>
  );
}

interface ListFooterProps {
  loading: boolean;
  failed: boolean;
  reachedEnd: boolean;
  onRetry: () => void;
}

function ListFooter({ loading, failed, reachedEnd, onRetry }: ListFooterProps) {
  if (loading) return <ActivityIndicator style={styles.footer} accessibilityLabel="Carregando mais personagens" />;
  if (failed) {
    return (
      <View style={styles.footer}>
        <Text variant="bodyMedium">Não deu para carregar mais personagens.</Text>
        <Button onPress={onRetry}>Tentar de novo</Button>
      </View>
    );
  }
  if (reachedEnd) {
    return (
      <Text variant="bodySmall" style={[styles.footer, styles.footerText]}>
        Você chegou ao fim da lista.
      </Text>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingVertical: spacing.sm },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  skeletonText: { flex: 1, gap: spacing.sm },
  footer: { alignItems: 'center', paddingVertical: spacing.lg },
  footerText: { textAlign: 'center' },
});
