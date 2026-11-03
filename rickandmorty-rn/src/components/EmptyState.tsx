import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { spacing } from '../theme/tokens';

export interface EmptyStateProps {
  title: string;
  description?: string;
}

// TODO(F3 · Hugo): ícone/ilustração e texto por contexto.
export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.text}>
        {title}
      </Text>
      {description && (
        <Text variant="bodyMedium" style={styles.text}>
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
