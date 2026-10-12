import { StyleSheet, Text } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import type { StackScreenProps } from '../../app/navigation/types';

type Props = StackScreenProps<'About'>;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    title: {
      ...theme.typography.heading,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    body: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.lg,
    },
  });

export function AboutScreen({ navigation }: Props) {
  const styles = useThemedStyles(createStyles);

  return (
    <ScreenContainer scroll includeBottomInset>
      <AppHeader title="About" onBack={() => navigation.goBack()} />
      <Text style={styles.title}>AI Learning Hub</Text>
      <Text style={styles.body}>Version 0.0.1 · Phase 1 preview</Text>
      <Text style={styles.body}>
        A mobile place to study artificial intelligence through tutorials,
        lessons, a sample quiz, and a practice tutor. Content and progress live
        on this device.
      </Text>
      <Text style={styles.body}>
        The AI Tutor uses prepared replies chosen by keyword. It is not
        connected to a live model, and this preview does not include accounts,
        payments, or subscriptions.
      </Text>
    </ScreenContainer>
  );
}
