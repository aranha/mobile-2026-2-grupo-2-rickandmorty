import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { spacing } from '../theme/tokens';

export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

// TODO(F3 · Hugo): visual final — ícone, texto por tipo de ApiError, caso "sem internet".
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text variant="bodyLarge" style={styles.text}>
        {message}
      </Text>
      {onRetry && <Button onPress={onRetry}>Tentar de novo</Button>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.md },
  text: { textAlign: 'center' },
});
