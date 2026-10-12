import type { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';

interface ScreenContainerProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  includeBottomInset?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      paddingBottom: theme.spacing.xxl,
    },
    padded: {
      paddingHorizontal: theme.spacing.xl,
    },
  });

export function ScreenContainer({
  children,
  scroll = false,
  padded = true,
  includeBottomInset = false,
  style,
  contentStyle,
}: ScreenContainerProps) {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const paddingTop = insets.top;
  const paddingBottom = includeBottomInset ? insets.bottom : 0;

  if (scroll) {
    return (
      <ScrollView
        style={[styles.screen, style]}
        contentContainerStyle={[
          styles.content,
          padded && styles.padded,
          { paddingTop, paddingBottom: paddingBottom + 24 },
          contentStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        padded && styles.padded,
        { paddingTop, paddingBottom },
        style,
      ]}
    >
      {children}
    </View>
  );
}
