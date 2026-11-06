import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { FavoriteButton } from './FavoriteButton';
import type { CharacterSummary } from '../domain/character';
import { radius, spacing } from '../theme/tokens';

export interface CharacterCardProps {
  character: CharacterSummary;
  onPress: () => void;
  testID?: string;
}

export function CharacterCard({ character, onPress, testID = `item-card-${character.id}` }: CharacterCardProps) {
  return (
    <Card testID={testID} onPress={onPress} style={styles.card}>
      <Card.Title
        title={character.name}
        subtitle={character.species}
        left={() => <Image source={character.image} style={styles.avatar} />}
        right={() => <FavoriteButton character={character} />}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: spacing.md, marginVertical: spacing.xs },
  avatar: { width: 40, height: 40, borderRadius: radius.pill },
});
