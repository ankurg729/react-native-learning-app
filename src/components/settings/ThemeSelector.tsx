import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import type { AppearancePreference, IconName } from '../../types';
import { AppIcon } from '../../utils/icons';

const OPTIONS: Array<{
  id: AppearancePreference;
  label: string;
  icon: IconName;
}> = [
  { id: 'dark', label: 'Dark', icon: 'moon' },
  { id: 'light', label: 'Light', icon: 'sun' },
  { id: 'system', label: 'System', icon: 'monitor' },
];

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    option: {
      flex: 1,
      minHeight: 84,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      padding: theme.spacing.sm,
    },
    selected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryMuted,
    },
    label: {
      ...theme.typography.label,
      color: theme.colors.textSecondary,
    },
    labelSelected: {
      color: theme.colors.primary,
    },
  });

export function ThemeSelector() {
  const styles = useThemedStyles(createStyles);
  const { theme, appearance, setAppearance } = useTheme();

  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {OPTIONS.map(option => {
        const selected = appearance === option.id;
        return (
          <Pressable
            key={option.id}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`${option.label} appearance`}
            onPress={() => setAppearance(option.id)}
            style={[styles.option, selected && styles.selected]}
          >
            <AppIcon
              name={option.icon}
              color={
                selected ? theme.colors.primary : theme.colors.textSecondary
              }
              size={20}
            />
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
