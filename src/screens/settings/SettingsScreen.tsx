import { StyleSheet, Switch, Text, View } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { SettingsRow } from '../../components/common/SettingsRow';
import { ThemeSelector } from '../../components/settings/ThemeSelector';
import { useLearning } from '../../hooks/useLearning';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { surfaceStyle } from '../../theme/surfaces';
import type { Theme } from '../../theme/theme';
import type { StackScreenProps } from '../../app/navigation/types';

type Props = StackScreenProps<'Settings'>;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    stack: {
      gap: theme.spacing.lg,
    },
    card: {
      ...surfaceStyle(theme),
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    title: {
      ...theme.typography.subtitle,
      color: theme.colors.text,
    },
    help: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    group: {
      ...surfaceStyle(theme),
      overflow: 'hidden',
    },
  });

export function SettingsScreen({ navigation }: Props) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const learning = useLearning();

  return (
    <ScreenContainer scroll includeBottomInset>
      <AppHeader title="Settings" onBack={() => navigation.goBack()} />
      <View style={styles.stack}>
        <View style={styles.card}>
          <Text style={styles.title}>Appearance</Text>
          <ThemeSelector />
          <Text style={styles.help}>
            Dark is the preset until you choose another look. System follows
            this device.
          </Text>
        </View>
        <View style={styles.group}>
          <SettingsRow
            icon="bell"
            title="Notifications"
            subtitle="Show the badge on Home"
            trailing={
              <Switch
                value={learning.settings.notificationsEnabled}
                onValueChange={value =>
                  learning.updateSettings({ notificationsEnabled: value })
                }
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                thumbColor={theme.colors.onPrimary}
                accessibilityLabel="Notifications"
              />
            }
          />
          <SettingsRow
            icon="clock"
            title="Learning reminder"
            subtitle={
              learning.settings.remindersEnabled
                ? 'Saved on this device. A 7:30 PM weekday reminder is noted for a later phase.'
                : 'Reminders are off. Nothing is scheduled in this preview.'
            }
            trailing={
              <Switch
                value={learning.settings.remindersEnabled}
                onValueChange={value =>
                  learning.updateSettings({ remindersEnabled: value })
                }
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                thumbColor={theme.colors.onPrimary}
                accessibilityLabel="Learning reminder"
              />
            }
          />
        </View>
        <View style={styles.group}>
          <SettingsRow
            icon="info"
            title="About the app"
            onPress={() => navigation.navigate('About')}
          />
          <SettingsRow
            icon="shield"
            title="Privacy"
            onPress={() => navigation.navigate('Privacy')}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
