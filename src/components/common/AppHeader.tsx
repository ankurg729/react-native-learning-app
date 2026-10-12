import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import { AppIcon } from '../../utils/icons';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  onBack?: () => void;
  right?: ReactNode;
  large?: boolean;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    main: {
      flex: 1,
      gap: 4,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    back: {
      width: 36,
      height: 36,
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
    eyebrow: {
      ...theme.typography.overline,
      color: theme.colors.secondary,
    },
    title: {
      ...theme.typography.title,
      color: theme.colors.text,
      flexShrink: 1,
    },
    largeTitle: {
      ...theme.typography.display,
      color: theme.colors.text,
      flexShrink: 1,
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
  });

export function AppHeader({
  title,
  subtitle,
  eyebrow,
  onBack,
  right,
  large = false,
}: AppHeaderProps) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.main}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <View style={styles.titleRow}>
          {onBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={onBack}
              style={({ pressed }) => [styles.back, pressed && styles.pressed]}
            >
              <AppIcon
                name="chevron-left"
                color={theme.colors.text}
                size={20}
              />
            </Pressable>
          ) : null}
          <Text style={large ? styles.largeTitle : styles.title}>{title}</Text>
        </View>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}
