import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Icon, Text, useTheme } from 'react-native-paper';
import { spacing } from '../theme/tokens';

export interface EmptyStateProps {
  title: string;
  description?: string;
  /** Ícone que combina com o contexto (ex.: busca, favoritos). */
  icon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
}

export function EmptyState({ title, description, icon = 'ufo-outline' }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Icon source={icon} size={56} color={colors.onSurfaceVariant} />
      <Text variant="titleMedium" style={styles.text}>
        {title}
      </Text>
      {description && (
        <Text variant="bodyMedium" style={[styles.text, { color: colors.onSurfaceVariant }]}>
          {description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.sm },
  text: { textAlign: 'center' },
});
