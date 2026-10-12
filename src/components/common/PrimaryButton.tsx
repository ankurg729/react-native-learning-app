import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import type { IconName } from '../../types';
import { AppIcon } from '../../utils/icons';

interface ButtonProps {
  label: string;
  onPress: () => void;
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  tone?: 'primary' | 'danger';
  accessibilityLabel?: string;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      minHeight: 48,
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
    },
    danger: {
      backgroundColor: theme.colors.danger,
    },
    pressed: {
      backgroundColor: theme.colors.primaryPressed,
    },
    disabled: {
      opacity: 0.45,
    },
    label: {
      ...theme.typography.bodyStrong,
      color: theme.colors.onPrimary,
    },
  });

export function PrimaryButton({
  label,
  onPress,
  icon,
  disabled = false,
  loading = false,
  tone = 'primary',
  accessibilityLabel,
}: ButtonProps) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: inactive }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        tone === 'danger' && styles.danger,
        pressed && !inactive && styles.pressed,
        inactive && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.onPrimary} />
      ) : (
        <>
          {icon ? (
            <AppIcon name={icon} color={theme.colors.onPrimary} size={18} />
          ) : null}
          <Text style={styles.label}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}
