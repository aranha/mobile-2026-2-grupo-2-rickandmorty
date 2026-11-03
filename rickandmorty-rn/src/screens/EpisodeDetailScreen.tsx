import { EmptyState } from '../components/EmptyState';
import type { RootScreenProps } from '../navigation/types';

// TODO(F6 · Rafael): useEpisode(id) → nome, código, data e grade de personagens (useCharactersByIds);
// tocar num personagem abre o CharacterDetail.
export function EpisodeDetailScreen({ route }: RootScreenProps<'EpisodeDetail'>) {
  return <EmptyState title={`Episódio #${route.params.id}`} description="O detalhe chega no F6" />;
}
