import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { spacing } from '../theme/tokens';

const DEBOUNCE_MS = 400;

export interface CharacterSearchBarProps {
  /** Chamado com o texto já com debounce — a tela só repassa para o filtro. Precisa ser estável (useCallback). */
  onSearch: (name: string) => void;
}

/** Busca por nome (F3): o campo responde na hora, mas a API só é chamada após 400 ms sem digitar. */
export function CharacterSearchBar({ onSearch }: CharacterSearchBarProps) {
  const [text, setText] = useState('');
  const debounced = useDebouncedValue(text, DEBOUNCE_MS);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <Searchbar
      placeholder="Buscar personagem"
      value={text}
      onChangeText={setText}
      style={styles.bar}
      autoCorrect={false}
      autoCapitalize="none"
      returnKeyType="search"
      accessibilityLabel="Buscar personagem por nome"
      testID="search-input"
    />
  );
}

const styles = StyleSheet.create({
  bar: { marginHorizontal: spacing.md, marginTop: spacing.sm },
});
