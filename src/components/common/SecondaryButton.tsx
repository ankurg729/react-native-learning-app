import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import type { IconName } from '../../types';
import { AppIcon } from '../../utils/icons';

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: IconName;
  disabled?: boolean;
  accessibilityLabel?: string;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      minHeight: 48,
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
    },
    pressed: {
      backgroundColor: theme.colors.primaryMuted,
    },
    disabled: {
      opacity: 0.45,
    },
    label: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },
  });

export function SecondaryButton({
  label,
  onPress,
  icon,
  disabled = false,
  accessibilityLabel,
}: SecondaryButtonProps) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {icon ? (
        <AppIcon name={icon} color={theme.colors.text} size={18} />
      ) : null}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
