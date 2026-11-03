import { View, type DimensionValue } from 'react-native';
import { useTheme } from 'react-native-paper';
import { radius } from '../theme/tokens';

export interface SkeletonProps {
  width: DimensionValue;
  height: number;
}

// TODO(F7 · Sesaque): shimmer animado. Por enquanto é um bloco parado.
export function Skeleton({ width, height }: SkeletonProps) {
  const { colors } = useTheme();
  return <View style={{ width, height, borderRadius: radius.sm, backgroundColor: colors.surfaceVariant }} />;
}
