import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { loadAppearance, saveAppearance } from './appearanceStorage';
import { buildTheme, type Theme } from './theme';
import type { AppearancePreference, ColorMode } from '../types';

interface ThemeContextValue {
  theme: Theme;
  appearance: AppearancePreference;
  setAppearance: (preference: AppearancePreference) => void;
  ready: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function resolveMode(
  appearance: AppearancePreference,
  systemScheme: ColorMode | null | undefined,
): ColorMode {
  if (appearance === 'system') {
    return systemScheme === 'light' ? 'light' : 'dark';
  }
  return appearance;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [appearance, setAppearanceState] =
    useState<AppearancePreference>('dark');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    loadAppearance().then(stored => {
      if (!active) {
        return;
      }
      setAppearanceState(stored);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const setAppearance = useCallback((preference: AppearancePreference) => {
    setAppearanceState(preference);
    saveAppearance(preference);
  }, []);

  const mode = resolveMode(appearance, systemScheme);
  const theme = useMemo(() => buildTheme(mode), [mode]);

  const value = useMemo(
    () => ({ theme, appearance, setAppearance, ready }),
    [theme, appearance, setAppearance, ready],
  );

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
      />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return value;
}
