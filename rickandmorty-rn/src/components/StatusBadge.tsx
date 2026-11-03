import { Text } from 'react-native-paper';
import type { CharacterStatus } from '../domain/character';
import { statusColors } from '../theme/tokens';

// TODO(F7 · Sesaque): visual de badge (bolinha + texto) e rótulo traduzido.
export function StatusBadge({ status }: { status: CharacterStatus }) {
  return <Text style={{ color: statusColors[status] }}>{status}</Text>;
}
