import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { surfaceStyle } from '../../theme/surfaces';
import type { Theme } from '../../theme/theme';
import type { IconName } from '../../types';
import { AppIcon } from '../../utils/icons';
import { PrimaryButton } from './PrimaryButton';

interface EmptyStateProps {
  icon: IconName;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    wrap: {
      ...surfaceStyle(theme),
      alignItems: 'center',
      padding: theme.spacing.xxl,
      gap: theme.spacing.sm,
    },
    iconWrap: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primaryMuted,
      marginBottom: theme.spacing.sm,
    },
    title: {
      ...theme.typography.subtitle,
      color: theme.colors.text,
      textAlign: 'center',
    },
    message: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    action: {
      alignSelf: 'stretch',
      marginTop: theme.spacing.md,
    },
  });

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <AppIcon name={icon} color={theme.colors.primary} size={26} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <PrimaryButton label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}
