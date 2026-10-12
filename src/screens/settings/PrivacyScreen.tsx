import { StyleSheet, Text } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import type { StackScreenProps } from '../../app/navigation/types';

type Props = StackScreenProps<'Privacy'>;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    body: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.lg,
    },
    heading: {
      ...theme.typography.subtitle,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
  });

export function PrivacyScreen({ navigation }: Props) {
  const styles = useThemedStyles(createStyles);

  return (
    <ScreenContainer scroll includeBottomInset>
      <AppHeader title="Privacy" onBack={() => navigation.goBack()} />
      <Text style={styles.heading}>Stored on this device</Text>
      <Text style={styles.body}>
        Appearance, profile edits, bookmarks, lesson progress, quiz scores, and
        notification preferences are saved locally with AsyncStorage. This
        preview does not create an account and does not send that data to a
        server.
      </Text>
      <Text style={styles.heading}>Practice tutor</Text>
      <Text style={styles.body}>
        Messages stay in memory for the current visit unless you clear them.
        Replies are prepared examples bundled with the app.
      </Text>
      <Text style={styles.heading}>Placeholder</Text>
      <Text style={styles.body}>
        A full privacy policy will replace this note when accounts and a backend
        exist. Nothing in Phase 1 is sold, shared, or used for advertising.
      </Text>
    </ScreenContainer>
  );
}
