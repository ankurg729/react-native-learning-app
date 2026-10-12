import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { LoadingIndicator } from '../../components/common/LoadingIndicator';
import { useLearning } from '../../hooks/useLearning';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { LearningProvider } from './LearningProvider';
import { ThemeProvider } from '../../theme/ThemeProvider';
import type { Theme } from '../../theme/theme';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    boot: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

function BootGate({ children }: { children: ReactNode }) {
  const styles = useThemedStyles(createStyles);
  const { ready: themeReady } = useTheme();
  const learning = useLearning();

  if (!themeReady || !learning.ready) {
    return (
      <View style={styles.boot}>
        <LoadingIndicator label="Opening AI Learning Hub" />
      </View>
    );
  }

  return children;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LearningProvider>
        <BootGate>{children}</BootGate>
      </LearningProvider>
    </ThemeProvider>
  );
}
