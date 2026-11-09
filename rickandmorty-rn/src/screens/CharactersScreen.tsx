import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { CharacterCard, CharacterCardSkeleton } from '../components/CharacterCard';
import { CharacterSearchBar } from '../components/CharacterSearchBar';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { StatusFilterChips } from '../components/StatusFilterChips';
import type { CharacterFilters, CharacterSummary } from '../domain/character';
import { normalizeFilters } from '../domain/filters';
import type { TabScreenProps } from '../navigation/types';
import { useCharacters } from '../queries/useCharacters';
import { spacing } from '../theme/tokens';

const SKELETON_ROWS = 8;

// Busca (Hugo) e filtro (Guilherme) só mexem no `filters`; a lista (Paulo) lê dele.
export function CharactersScreen({ navigation }: TabScreenProps<'Characters'>) {
  const [filters, setFilters] = useState<CharacterFilters>({});
  const [refreshing, setRefreshing] = useState(false);
  const query = useCharacters(filters);
  const { fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = query;

  const characters = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);

  // Estável: a busca chama onSearch num efeito, e uma função nova a cada render dispararia de novo.
  const search = useCallback((name: string) => setFilters((current) => ({ ...current, name })), []);

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

  // Mesmo critério do useCharacters: nome só com espaços não conta como busca.
  const searchedName = normalizeFilters(filters).name;

  let content;
  if (query.isPending) {
    content = <ListSkeleton />;
  } else if (query.isError && characters.length === 0) {
    content = (
      <ErrorState message="Não foi possível carregar os personagens." error={query.error} onRetry={() => refetch()} />
    );
  } else if (characters.length === 0) {
    content = searchedName ? (
      <EmptyState
        icon="account-search-outline"
        title="Nenhum personagem com esse nome"
        description={`Nada encontrado para "${searchedName}". Tente outro nome ou outro status.`}
      />
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
      <CharacterSearchBar onSearch={search} />
      <StatusFilterChips
        value={filters.status}
        onChange={(status) => setFilters((current) => ({ ...current, status }))}
      />
      {content}
    </View>
  );
}

/** Mesmo formato do card, para a tela não "pular" quando os dados chegam. */
function ListSkeleton() {
  return (
    <View style={styles.listContent} accessibilityLabel="Carregando personagens">
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <CharacterCardSkeleton key={index} />
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
  footer: { alignItems: 'center', paddingVertical: spacing.lg },
  footerText: { textAlign: 'center' },
});
