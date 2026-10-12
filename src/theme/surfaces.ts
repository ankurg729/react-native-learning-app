import type { ViewStyle } from 'react-native';
import type { Theme } from './theme';

export function surfaceStyle(theme: Theme): ViewStyle {
  return {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.soft,
  };
}
