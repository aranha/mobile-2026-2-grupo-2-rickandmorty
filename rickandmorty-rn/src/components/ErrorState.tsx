import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Icon, Text, useTheme } from 'react-native-paper';
import { ApiError, type ApiErrorKind } from '../api/client';
import { spacing } from '../theme/tokens';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface ErrorStateProps {
  /** O que falhou, no contexto da tela (ex.: "Não foi possível carregar o personagem."). */
  message: string;
  /** O `query.error`: define ícone e título pelo tipo de ApiError. */
  error?: Error | null;
  onRetry?: () => void;
}

const BY_KIND: Record<ApiErrorKind, { icon: IconName; title: string }> = {
  // Inclui o timeout de 10 s do client: nem sempre é a internet do aparelho.
  network: { icon: 'wifi-off', title: 'Sem conexão' },
  'not-found': { icon: 'map-search-outline', title: 'Nada por aqui' },
  http: { icon: 'cloud-alert-outline', title: 'A API não respondeu bem' },
};

const FALLBACK: { icon: IconName; title: string } = { icon: 'alert-circle-outline', title: 'Algo deu errado' };

export function ErrorState({ message, error, onRetry }: ErrorStateProps) {
  const { colors } = useTheme();
  const { icon, title } = error instanceof ApiError ? BY_KIND[error.kind] : FALLBACK;

  return (
    <View style={styles.container} accessibilityRole="alert">
      <Icon source={icon} size={56} color={colors.onSurfaceVariant} />
      <Text variant="titleMedium" style={styles.text}>
        {title}
      </Text>
      <Text variant="bodyMedium" style={[styles.text, { color: colors.onSurfaceVariant }]}>
        {message}
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
