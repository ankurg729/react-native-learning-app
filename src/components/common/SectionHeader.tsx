import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import { AppIcon } from '../../utils/icons';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
      gap: theme.spacing.md,
    },
    title: {
      ...theme.typography.heading,
      color: theme.colors.text,
      flex: 1,
    },
    action: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    actionLabel: {
      ...theme.typography.label,
      color: theme.colors.primary,
    },
  });

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();

  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onAction}
          style={styles.action}
        >
          <Text style={styles.actionLabel}>{actionLabel}</Text>
          <AppIcon
            name="chevron-right"
            color={theme.colors.primary}
            size={16}
          />
        </Pressable>
      ) : null}
    </View>
  );
}
