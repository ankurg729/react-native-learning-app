import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import { AppIcon } from '../../utils/icons';

interface QuizOptionProps {
  label: string;
  indexLabel: string;
  selected: boolean;
  state?: 'idle' | 'correct' | 'incorrect';
  disabled?: boolean;
  onPress: () => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    option: {
      borderRadius: theme.radii.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    selected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryMuted,
    },
    correct: {
      borderColor: theme.colors.success,
      backgroundColor: theme.colors.successMuted,
    },
    incorrect: {
      borderColor: theme.colors.danger,
      backgroundColor: theme.colors.dangerMuted,
    },
    marker: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.input,
    },
    markerText: {
      ...theme.typography.label,
      color: theme.colors.text,
    },
    label: {
      ...theme.typography.body,
      color: theme.colors.text,
      flex: 1,
    },
  });

export function QuizOption({
  label,
  indexLabel,
  selected,
  state = 'idle',
  disabled = false,
  onPress,
}: QuizOptionProps) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const toneStyle =
    state === 'correct'
      ? styles.correct
      : state === 'incorrect'
      ? styles.incorrect
      : selected
      ? styles.selected
      : undefined;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={[styles.option, toneStyle]}
    >
      <View style={styles.marker}>
        {state === 'correct' ? (
          <AppIcon name="check" color={theme.colors.success} size={16} />
        ) : (
          <Text style={styles.markerText}>{indexLabel}</Text>
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
