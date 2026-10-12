import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    wrap: {
      gap: theme.spacing.sm,
    },
    label: {
      ...theme.typography.label,
      color: theme.colors.textSecondary,
    },
    input: {
      minHeight: 48,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.input,
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      ...theme.typography.body,
    },
    multiline: {
      minHeight: 110,
      textAlignVertical: 'top',
    },
  });

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
}: TextFieldProps) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        accessibilityLabel={label}
        multiline={multiline}
        style={[styles.input, multiline && styles.multiline]}
      />
    </View>
  );
}
