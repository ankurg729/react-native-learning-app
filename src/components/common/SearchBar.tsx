import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import { AppIcon } from '../../utils/icons';

interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    bar: {
      minHeight: 48,
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.input,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    input: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
      paddingVertical: theme.spacing.sm,
    },
    clear: {
      width: 28,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search tutorials',
}: SearchBarProps) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();

  return (
    <View style={styles.bar}>
      <AppIcon name="search" color={theme.colors.textSecondary} size={18} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        accessibilityLabel={placeholder}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        style={styles.input}
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          onPress={() => onChangeText('')}
          style={styles.clear}
        >
          <AppIcon name="x" color={theme.colors.textSecondary} size={16} />
        </Pressable>
      ) : null}
    </View>
  );
}
