import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import type { CharacterStatus } from '../domain/character';
import { radius, spacing, statusColors, statusLabels } from '../theme/tokens';

// Bolinha com a cor do status + rótulo em português. O texto usa a cor do tema (contraste garantido);
// a cor do status vai na bolinha e no fundo translúcido, então a informação não depende só da cor.
export function StatusBadge({ status }: { status: CharacterStatus }) {
  const { colors } = useTheme();
  const color = statusColors[status];
  const label = statusLabels[status];

  return (
    <View
      style={[styles.badge, { backgroundColor: `${color}26`, borderColor: `${color}66` }]}
      accessible
      accessibilityLabel={`Status: ${label}`}
      testID={`status-badge-${status}`}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text variant="labelMedium" style={{ color: colors.onSurface }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  dot: { width: 8, height: 8, borderRadius: radius.pill },
});
