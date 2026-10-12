import { useMemo } from 'react';
import type { Theme } from '../theme/theme';
import { useTheme } from './useTheme';

export function useThemedStyles<T>(factory: (theme: Theme) => T): T {
  const { theme } = useTheme();
  return useMemo(() => factory(theme), [factory, theme]);
}
