import { useSyncExternalStore } from 'react';
import { StyleSheet, View } from 'react-native';
import { onlineManager } from '@tanstack/react-query';
import { Icon, Text, useTheme } from 'react-native-paper';
import { spacing } from '../theme/tokens';

// Mesma fonte de verdade do TanStack Query (alimentada pelo NetInfo em queryClient.ts):
// o banner aparece exatamente quando as consultas ficam pausadas esperando a rede.
const isOnline = () => onlineManager.isOnline();

/** Aviso de sem internet no topo das abas; some sozinho quando a conexão volta. */
export function OfflineBanner() {
  const { colors } = useTheme();
  const online = useSyncExternalStore(onlineManager.subscribe, isOnline);

  if (online) return null;

  return (
    <View
      testID="offline-banner"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[styles.banner, { backgroundColor: colors.errorContainer }]}
    >
      <Icon source="wifi-off" size={20} color={colors.onErrorContainer} />
      <Text variant="bodyMedium" style={[styles.text, { color: colors.onErrorContainer }]}>
        Sem internet. Mostrando o que já foi carregado; o app tenta de novo quando a conexão voltar.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: { flex: 1 },
});
