import { useState } from 'react';
import { View } from 'react-native';
import { CharacterSearchBar } from '../components/CharacterSearchBar';
import { EmptyState } from '../components/EmptyState';
import { StatusFilterChips } from '../components/StatusFilterChips';
import type { CharacterFilters } from '../domain/character';

// Busca (Hugo) e filtro (Guilherme) só mexem no `filters`; a lista (Paulo) lê dele.
export function CharactersScreen() {
  const [filters, setFilters] = useState<CharacterFilters>({});

  // TODO(F1 · Paulo): useCharacters(filters) + FlatList de CharacterCard com scroll infinito e
  // pull-to-refresh; Skeleton no primeiro carregamento, ErrorState no erro, EmptyState sem resultado.
  return (
    <View testID="item-list-screen" style={{ flex: 1 }}>
      <CharacterSearchBar onSearch={(name) => setFilters((current) => ({ ...current, name }))} />
      <StatusFilterChips
        value={filters.status}
        onChange={(status) => setFilters((current) => ({ ...current, status }))}
      />
      <EmptyState title="A lista de personagens chega no F1" />
    </View>
  );
}
