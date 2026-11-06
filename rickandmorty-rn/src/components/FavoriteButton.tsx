import { Fragment, useState } from 'react';
import { IconButton, Portal, Snackbar } from 'react-native-paper';
import type { CharacterSummary } from '../domain/character';
import { useFavoritesStore } from '../stores/favoritesStore';

export interface FavoriteButtonProps {
  character: CharacterSummary;
  testID?: string;
}

export function FavoriteButton({ character, testID = `favorite-button-${character.id}` }: FavoriteButtonProps) {
  const isFavorite = useFavoritesStore((state) => Boolean(state.byId[character.id]));
  const toggle = useFavoritesStore((state) => state.toggle);
  const add = useFavoritesStore((state) => state.add);
  const remove = useFavoritesStore((state) => state.remove);
  const [message, setMessage] = useState<string | null>(null);
  const [undoAction, setUndoAction] = useState<(() => void) | null>(null);

  function handlePress() {
    toggle(character);
    if (isFavorite) {
      setMessage('Removido dos favoritos');
      setUndoAction(() => () => add(character));
    } else {
      setMessage('Adicionado aos favoritos');
      setUndoAction(() => () => remove(character.id));
    }
  }

  function undo() {
    setMessage(null);
    undoAction?.();
    setUndoAction(null);
  }

  return (
    <Fragment>
      <IconButton
        icon={isFavorite ? 'star' : 'star-outline'}
        onPress={handlePress}
        accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
        testID={testID}
      />
      <Portal>
        <Snackbar
          visible={message !== null}
          duration={5000}
          onDismiss={() => {
            setMessage(null);
            setUndoAction(null);
          }}
          action={{ label: 'Desfazer', onPress: undo }}
        >
          {message}
        </Snackbar>
      </Portal>
    </Fragment>
  );
}
