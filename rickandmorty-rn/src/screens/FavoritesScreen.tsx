import { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { CharacterCard } from '../components/CharacterCard';
import type { CharacterSummary } from '../domain/character';
import type { TabScreenProps } from '../navigation/types';
import { useFavoritesStore } from '../stores/favoritesStore';
import { spacing } from '../theme/tokens';

export function FavoritesScreen({ navigation }: TabScreenProps<'Favorites'>) {
  const byId = useFavoritesStore((state) => state.byId);
  const favorites = useMemo(() => Object.values(byId), [byId]);

  const openDetail = useCallback(
    (character: CharacterSummary) =>
      navigation.navigate('CharacterDetail', { id: character.id, name: character.name }),
    [navigation],
  );

  if (favorites.length === 0) {
    return (
      <View testID="favorites-empty-state" style={styles.empty}>
        <EmptyState
          icon="star-outline"
          title="Nenhum favorito ainda"
          description="Toque na ★ de um personagem para salvar aqui."
        />
      </View>
    );
  }

  return (
    <FlatList
      testID="favorites-list"
      data={favorites}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <CharacterCard character={item} onPress={() => openDetail(item)} testID={`favorite-item-${item.id}`} />
      )}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingVertical: spacing.sm },
  empty: { flex: 1 },
});
