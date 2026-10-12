import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import type { IconName } from '../../types';
import { AppIcon } from '../../utils/icons';

interface SettingsRowProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  destructive?: boolean;
  trailing?: ReactNode;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
    pressed: {
      backgroundColor: theme.colors.primaryMuted,
    },
    iconWrap: {
      width: 36,
      height: 36,
      borderRadius: theme.radii.sm,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primaryMuted,
    },
    copy: {
      flex: 1,
      gap: 2,
    },
    title: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },
    destructive: {
      color: theme.colors.danger,
    },
    subtitle: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
  });

export function SettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  destructive = false,
  trailing,
}: SettingsRowProps) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const color = destructive ? theme.colors.danger : theme.colors.primary;

  const content = (
    <>
      <View style={styles.iconWrap}>
        <AppIcon name={icon} color={color} size={18} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, destructive && styles.destructive]}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {trailing ??
        (onPress ? (
          <AppIcon
            name="chevron-right"
            color={theme.colors.textMuted}
            size={18}
          />
        ) : null)}
    </>
  );

  if (!onPress) {
    return <View style={styles.row}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}
