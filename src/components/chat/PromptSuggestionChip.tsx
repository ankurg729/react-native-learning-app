import { Pressable, StyleSheet, Text } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';

interface PromptSuggestionChipProps {
  label: string;
  onPress: () => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    chip: {
      borderRadius: theme.radii.pill,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginRight: theme.spacing.sm,
    },
    pressed: {
      backgroundColor: theme.colors.primaryMuted,
    },
    label: {
      ...theme.typography.label,
      color: theme.colors.text,
    },
  });

export function PromptSuggestionChip({
  label,
  onPress,
}: PromptSuggestionChipProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
