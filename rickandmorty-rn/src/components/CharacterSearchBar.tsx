export interface CharacterSearchBarProps {
  /** Chamado com o texto já com debounce — a tela só repassa para o filtro. */
  onSearch: (name: string) => void;
}

// TODO(F3 · Hugo): Searchbar do Paper com debounce de ~400 ms antes de chamar onSearch.
export function CharacterSearchBar(_props: CharacterSearchBarProps) {
  return null;
}
