import { IconButton } from 'react-native-paper';
import type { CharacterSummary } from '../domain/character';

export interface FavoriteButtonProps {
  character: CharacterSummary;
}

// TODO(F5 · Marcus): ler e alternar no favoritesStore, com Snackbar de feedback.
export function FavoriteButton(_props: FavoriteButtonProps) {
  return <IconButton icon="star-outline" disabled accessibilityLabel="Favoritar" />;
}
