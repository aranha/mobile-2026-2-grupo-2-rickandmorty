import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text, useTheme } from 'react-native-paper';
import { ApiError, type ApiErrorKind } from '../api/client';
import { spacing } from '../theme/tokens';

export interface ErrorStateProps {
  /** Texto da tela; vale quando o erro não é um ApiError (que já traz a própria mensagem). */
  message: string;
  /** O `query.error`: define ícone, título e texto pelo tipo de ApiError. */
  error?: Error | null;
  onRetry?: () => void;
}

const BY_KIND: Record<ApiErrorKind, { icon: string; title: string }> = {
  network: { icon: 'wifi-off', title: 'Sem internet' },
  'not-found': { icon: 'map-search-outline', title: 'Nada por aqui' },
  http: { icon: 'cloud-alert-outline', title: 'A API não respondeu bem' },
};

const FALLBACK = { icon: 'alert-circle-outline', title: 'Algo deu errado' };

export function ErrorState({ message, error, onRetry }: ErrorStateProps) {
  const { colors } = useTheme();
  const apiError = error instanceof ApiError ? error : undefined;
  const { icon, title } = apiError ? BY_KIND[apiError.kind] : FALLBACK;

  return (
    <View style={styles.container} accessibilityRole="alert">
      <Icon source={icon} size={56} color={colors.onSurfaceVariant} />
      <Text variant="titleMedium" style={styles.text}>
        {title}
      </Text>
      <Text variant="bodyMedium" style={[styles.text, { color: colors.onSurfaceVariant }]}>
        {apiError?.message ?? message}
      </Text>
      {onRetry && (
        <Button mode="contained-tonal" icon="refresh" onPress={onRetry}>
          Tentar de novo
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.sm },
  text: { textAlign: 'center' },
});
