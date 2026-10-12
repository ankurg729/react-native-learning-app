import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import { clampPercent } from '../../utils/format';

interface ProgressBarProps {
  value: number;
  tint?: string;
  height?: number;
  accessibilityLabel?: string;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    track: {
      width: '100%',
      backgroundColor: theme.colors.primaryMuted,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: theme.radii.pill,
    },
  });

export function ProgressBar({
  value,
  tint,
  height = 8,
  accessibilityLabel = 'Progress',
}: ProgressBarProps) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const percent = clampPercent(value);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      style={[styles.track, { height, borderRadius: height }]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${percent}%`,
            backgroundColor: tint ?? theme.colors.primary,
          },
        ]}
      />
    </View>
  );
}
