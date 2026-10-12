import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../components/common/Avatar';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { SettingsRow } from '../../components/common/SettingsRow';
import { useLearning } from '../../hooks/useLearning';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { surfaceStyle } from '../../theme/surfaces';
import type { Theme } from '../../theme/theme';
import type { TabScreenProps } from '../../app/navigation/types';

type Props = TabScreenProps<'Profile'>;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    hero: {
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xl,
    },
    name: {
      ...theme.typography.title,
      color: theme.colors.text,
      marginTop: theme.spacing.sm,
    },
    level: {
      ...theme.typography.label,
      color: theme.colors.primary,
      backgroundColor: theme.colors.primaryMuted,
      overflow: 'hidden',
      borderRadius: theme.radii.pill,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
    },
    bio: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    stats: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    stat: {
      ...surfaceStyle(theme),
      flex: 1,
      padding: theme.spacing.md,
      alignItems: 'center',
      gap: 4,
    },
    statValue: {
      ...theme.typography.heading,
      color: theme.colors.text,
    },
    statLabel: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    group: {
      ...surfaceStyle(theme),
      overflow: 'hidden',
      marginBottom: theme.spacing.lg,
    },
    edit: {
      alignSelf: 'stretch',
      marginBottom: theme.spacing.lg,
    },
  });

export function ProfileScreen({ navigation }: Props) {
  const styles = useThemedStyles(createStyles);
  const learning = useLearning();
  const [signOutOpen, setSignOutOpen] = useState(false);

  return (
    <ScreenContainer scroll>
      <View style={styles.hero}>
        <Avatar name={learning.profile.name} size={84} />
        <Text style={styles.name}>{learning.profile.name}</Text>
        <Text style={styles.level}>{learning.profile.level}</Text>
        <Text style={styles.bio}>{learning.profile.bio}</Text>
      </View>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{learning.completedLessonCount}</Text>
          <Text style={styles.statLabel}>Lessons</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {learning.completedTutorials.length}
          </Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{learning.streakDays}</Text>
          <Text style={styles.statLabel}>Day streak</Text>
        </View>
      </View>
      <View style={styles.edit}>
        <SecondaryButton
          label="Edit profile"
          icon="pencil"
          onPress={() => navigation.navigate('EditProfile')}
        />
      </View>
      <View style={styles.group}>
        <SettingsRow
          icon="settings"
          title="Settings"
          subtitle="Appearance, reminders, and about"
          onPress={() => navigation.navigate('Settings')}
        />
        <SettingsRow
          icon="info"
          title="About"
          subtitle="What this preview includes"
          onPress={() => navigation.navigate('About')}
        />
        <SettingsRow
          icon="shield"
          title="Privacy"
          subtitle="How local data is stored"
          onPress={() => navigation.navigate('Privacy')}
        />
      </View>
      <View style={styles.group}>
        <SettingsRow
          icon="log-out"
          title="Sign out"
          subtitle="Placeholder · no account is connected"
          destructive
          onPress={() => setSignOutOpen(true)}
        />
      </View>
      <ConfirmDialog
        visible={signOutOpen}
        title="Sign out"
        message="There is no account session in this preview. Sign-out will be connected when authentication is added. Your lessons stay on this device."
        confirmLabel="Got it"
        cancelLabel="Close"
        onConfirm={() => setSignOutOpen(false)}
        onCancel={() => setSignOutOpen(false)}
      />
    </ScreenContainer>
  );
}
