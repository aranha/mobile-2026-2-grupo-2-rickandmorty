import { EmptyState } from '../components/EmptyState';

// TODO(F5 · Marcus): lista do favoritesStore (snapshot, funciona offline), remover com desfazer,
// tocar abre o CharacterDetail.
export function FavoritesScreen() {
  return <EmptyState title="Nenhum favorito ainda" description="Toque na ★ de um personagem para salvar aqui." />;
}
