import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Card, Text, useTheme } from 'react-native-paper';
import type { CharacterSummary } from '../domain/character';
import { radius, spacing, statusLabels } from '../theme/tokens';
import { FavoriteButton } from './FavoriteButton';
import { Skeleton } from './Skeleton';
import { StatusBadge } from './StatusBadge';

export interface CharacterCardProps {
  character: CharacterSummary;
  onPress: () => void;
}

const AVATAR_SIZE = 64;

/** Card da lista e dos favoritos: foto, nome, espécie, status e espaço para o FavoriteButton. */
export function CharacterCard({ character, onPress }: CharacterCardProps) {
  const { colors } = useTheme();
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Card
      mode="elevated"
      onPress={onPress}
      style={styles.card}
      testID={`item-card-${character.id}`}
      accessibilityLabel={`${character.name}, ${character.species}, ${statusLabels[character.status]}`}
      accessibilityHint="Abre os detalhes do personagem"
    >
      <View style={styles.row}>
        {imageFailed ? (
          <View style={[styles.avatar, styles.fallback, { backgroundColor: colors.surfaceVariant }]}>
            <MaterialCommunityIcons name="account-question" size={32} color={colors.onSurfaceVariant} />
          </View>
        ) : (
          // Enquanto a foto carrega, o placeholder é o fundo surfaceVariant (acompanha o tema;
          // um blurhash fixo acendia um quadrado claro no tema escuro) e a foto entra com fade.
          <Image
            source={character.image}
            transition={200}
            contentFit="cover"
            recyclingKey={String(character.id)}
            onError={() => setImageFailed(true)}
            style={[styles.avatar, { backgroundColor: colors.surfaceVariant }]}
            accessibilityIgnoresInvertColors
          />
        )}
        <View style={styles.info}>
          <Text variant="titleMedium" numberOfLines={1}>
            {character.name}
          </Text>
          <Text variant="bodyMedium" numberOfLines={1} style={{ color: colors.onSurfaceVariant }}>
            {character.species}
          </Text>
          <StatusBadge status={character.status} />
        </View>
        <FavoriteButton character={character} />
      </View>
    </Card>
  );
}

/** Mesmo formato do card, para a tela não "pular" quando os dados chegam. */
export function CharacterCardSkeleton() {
  return (
    <Card mode="elevated" style={styles.card}>
      <View style={styles.row}>
        <Skeleton width={AVATAR_SIZE} height={AVATAR_SIZE} borderRadius={radius.md} />
        <View style={styles.info}>
          <Skeleton width="65%" height={16} />
          <Skeleton width="40%" height={12} />
          <Skeleton width={72} height={20} borderRadius={radius.pill} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: spacing.md, marginVertical: spacing.xs + 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md - 4 },
  avatar: { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: radius.md },
  fallback: { alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: spacing.xs },
});
