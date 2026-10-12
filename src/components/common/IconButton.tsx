import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import type { IconName } from '../../types';
import { AppIcon } from '../../utils/icons';

interface IconButtonProps {
  icon: IconName;
  label: string;
  onPress: () => void;
  badge?: boolean;
  active?: boolean;
  filled?: boolean;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      width: 40,
      height: 40,
      borderRadius: theme.radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    pressed: {
      opacity: 0.72,
    },
    badge: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.secondary,
      borderWidth: 1.5,
      borderColor: theme.colors.surface,
    },
  });

export function IconButton({
  icon,
  label,
  onPress,
  badge = false,
  active = false,
  filled = false,
}: IconButtonProps) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const color = active ? theme.colors.primary : theme.colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <AppIcon name={icon} color={color} size={18} filled={filled || active} />
      {badge ? <View style={styles.badge} /> : null}
    </Pressable>
  );
}
