import { ScrollView } from 'react-native';
import { CharacterEpisodesSection } from '../components/CharacterEpisodesSection';
import { EmptyState } from '../components/EmptyState';
import type { RootScreenProps } from '../navigation/types';

export function CharacterDetailScreen({ route }: RootScreenProps<'CharacterDetail'>) {
  const { id } = route.params;

  // TODO(F2 · Vinícius): useCharacter(id) → foto, nome, StatusBadge, espécie, gênero, origem e local;
  // FavoriteButton (Marcus) no header e botão de compartilhar.
  return (
    <ScrollView testID="detail-screen" contentContainerStyle={{ flexGrow: 1 }}>
      <EmptyState title={`Personagem #${id}`} description="O detalhe chega no F2" />
      <CharacterEpisodesSection episodeIds={[]} />
    </ScrollView>
  );
}
