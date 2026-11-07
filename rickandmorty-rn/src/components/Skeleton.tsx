import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, StyleSheet, View, type DimensionValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'react-native-paper';
import { radius } from '../theme/tokens';

export interface SkeletonProps {
  width: DimensionValue;
  height: number;
  /** Padrão: radius.sm. Use radius.pill para avatar redondo. */
  borderRadius?: number;
}

const SHIMMER_DURATION_MS = 1300;

/** Respeita "Reduzir movimento" do sistema: sem animação, só o bloco parado. */
function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => subscription.remove();
  }, []);
  return reduce;
}

/** Bloco no formato do conteúdo com uma faixa de brilho passando (shimmer), no lugar do spinner solto. */
export function Skeleton({ width, height, borderRadius = radius.sm }: SkeletonProps) {
  const { colors, dark } = useTheme();
  const reduceMotion = useReduceMotion();
  const [blockWidth, setBlockWidth] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion || blockWidth === 0) return;
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: SHIMMER_DURATION_MS,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: Platform.OS !== 'web',
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress, reduceMotion, blockWidth]);

  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [-blockWidth, blockWidth] });
  const shine = dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.55)';

  return (
    <View
      onLayout={(event) => setBlockWidth(event.nativeEvent.layout.width)}
      style={[styles.block, { width, height, borderRadius, backgroundColor: colors.surfaceVariant }]}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    >
      {!reduceMotion && blockWidth > 0 && (
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
          <LinearGradient
            colors={['transparent', shine, 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { overflow: 'hidden' },
});
