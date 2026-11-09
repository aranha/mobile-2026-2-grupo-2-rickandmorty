import { useEffect, useEffectEvent, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { spacing } from '../theme/tokens';

const DEBOUNCE_MS = 400;

export interface CharacterSearchBarProps {
  /** Chamado com o texto já com debounce — a tela só repassa para o filtro. */
  onSearch: (name: string) => void;
}

/** Busca por nome (F3): o campo responde na hora, mas a API só é chamada após 400 ms sem digitar. */
export function CharacterSearchBar({ onSearch }: CharacterSearchBarProps) {
  const [text, setText] = useState('');
  const debounced = useDebouncedValue(text, DEBOUNCE_MS);
  // Efeito só reage ao texto: a tela pode passar uma função nova a cada render sem disparar a busca de novo.
  const emitSearch = useEffectEvent(onSearch);

  useEffect(() => {
    emitSearch(debounced);
  }, [debounced]);

  return (
    <Searchbar
      placeholder="Buscar personagem"
      value={text}
      onChangeText={setText}
      style={styles.bar}
      autoCorrect={false}
      autoCapitalize="none"
      accessibilityLabel="Buscar personagem por nome"
      testID="search-input"
    />
  );
}

const styles = StyleSheet.create({
  bar: { marginHorizontal: spacing.md, marginTop: spacing.sm },
});
