import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import type { CharacterSummary } from '../domain/character';
import { radius, spacing } from '../theme/tokens';

export interface CharacterCardProps {
  character: CharacterSummary;
  onPress: () => void;
}

// TODO(F7 · Sesaque): visual final (StatusBadge, placeholder da imagem, espaço para o FavoriteButton).
export function CharacterCard({ character, onPress }: CharacterCardProps) {
  return (
    <Card testID={`item-card-${character.id}`} onPress={onPress} style={styles.card}>
      <Card.Title
        title={character.name}
        subtitle={character.species}
        left={() => <Image source={character.image} style={styles.avatar} />}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: spacing.md, marginVertical: spacing.xs },
  avatar: { width: 40, height: 40, borderRadius: radius.pill },
});
