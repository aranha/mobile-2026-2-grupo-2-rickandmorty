import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';
import { CHARACTER_STATUSES, type CharacterStatus } from '../domain/character';
import { radius, spacing, statusColors } from '../theme/tokens';

export interface StatusFilterChipsProps {
  /** undefined = "Todos". */
  value?: CharacterStatus;
  onChange: (status: CharacterStatus | undefined) => void;
}

const STATUS_LABELS: Record<CharacterStatus, string> = {
  alive: 'Vivos',
  dead: 'Mortos',
  unknown: 'Desconhecido',
};

type ChipIcon = (props: { size: number }) => ReactNode;

interface FilterOption {
  value?: CharacterStatus;
  label: string;
  testID: string;
  /** Ícone quando não está selecionado; "Todos" não tem. */
  dot?: ChipIcon;
}

/** Bolinha com a cor do status — a mesma do StatusBadge, para o filtro "conversar" com o card. */
const statusDot =
  (status: CharacterStatus): ChipIcon =>
  ({ size }) => (
    <View style={[styles.iconBox, { width: size, height: size }]}>
      <View style={[styles.dot, { backgroundColor: statusColors[status] }]} />
    </View>
  );

// Montado uma vez só: os chips não recriam ícone a cada render da lista.
const OPTIONS: readonly FilterOption[] = [
  { value: undefined, label: 'Todos', testID: 'category-chip-all' },
  ...CHARACTER_STATUSES.map((status) => ({
    value: status,
    label: STATUS_LABELS[status],
    testID: `category-chip-${status}`,
    dot: statusDot(status),
  })),
];

/**
 * Chips Todos · Vivos · Mortos · Desconhecido no topo da lista (F4).
 * Só avisa a tela; quem filtra é a API, via useCharacters({ status }).
 */
export function StatusFilterChips({ value, onChange }: StatusFilterChipsProps) {
  const { colors } = useTheme();
  // Filter chip do Material 3: selecionado ganha fundo secondaryContainer, não só o ✓.
  const selectedStyle = { backgroundColor: colors.secondaryContainer, borderColor: colors.secondaryContainer };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.row}
      accessibilityLabel="Filtrar por status"
      testID="status-filter"
    >
      {OPTIONS.map((option) => {
        const selected = option.value === value;
        // Selecionado ganha o ✓ (não depende só de cor); os outros mostram a bolinha do status.
        const icon = selected ? 'check' : option.dot;
        return (
          <Chip
            key={option.testID}
            testID={option.testID}
            mode="outlined"
            selected={selected}
            icon={icon}
            style={selected ? selectedStyle : undefined}
            textStyle={selected ? { color: colors.onSecondaryContainer } : undefined}
            onPress={() => {
              if (!selected) onChange(option.value);
            }}
            accessibilityLabel={`Status: ${option.label}`}
          >
            {option.label}
          </Chip>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Altura só do conteúdo: sem flexGrow 0 ele estica na coluna da tela; sem flexShrink 0
  // (padrão do ScrollView no web) a lista abaixo esmaga os chips.
  scroll: { flexGrow: 0, flexShrink: 0 },
  row: { gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  iconBox: { alignItems: 'center', justifyContent: 'center' },
  dot: { width: 10, height: 10, borderRadius: radius.pill },
});
