import { Pressable, StyleSheet, Text } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    chip: {
      borderRadius: theme.radii.pill,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    selected: {
      backgroundColor: theme.colors.primaryMuted,
      borderColor: theme.colors.primary,
    },
    pressed: {
      opacity: 0.75,
    },
    label: {
      ...theme.typography.label,
      color: theme.colors.textSecondary,
    },
    labelSelected: {
      color: theme.colors.primary,
    },
  });

export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}
