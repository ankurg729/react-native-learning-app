import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/common/AppHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { useLearning } from '../../hooks/useLearning';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { surfaceStyle } from '../../theme/surfaces';
import type { Theme } from '../../theme/theme';
import type { StackScreenProps } from '../../app/navigation/types';
import { formatRelativeTime } from '../../utils/format';

type Props = StackScreenProps<'Notifications'>;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    card: {
      ...surfaceStyle(theme),
      padding: theme.spacing.lg,
      gap: theme.spacing.xs,
    },
    unread: {
      borderColor: theme.colors.primary,
    },
    title: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },
    body: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
    time: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },
    note: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
    },
    list: {
      paddingHorizontal: theme.spacing.xl,
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.xxxl,
    },
  });

export function NotificationsScreen({ navigation }: Props) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const learning = useLearning();
  const insets = useSafeAreaInsets();
  const enabled = learning.settings.notificationsEnabled;

  return (
    <View style={styles.screen}>
      <FlatList
        data={learning.notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingTop: insets.top + theme.spacing.md },
        ]}
        ListHeaderComponent={
          <View>
            <AppHeader
              title="Notifications"
              onBack={() => navigation.goBack()}
              right={
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Mark all notifications read"
                  onPress={learning.markAllNotificationsRead}
                >
                  <Text style={styles.time}>Mark all read</Text>
                </Pressable>
              }
            />
            {enabled ? null : (
              <Text style={styles.note}>
                Notifications are off in Settings. You can still read this list.
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => {
          const unread = enabled && !learning.isNotificationRead(item.id);
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item.title}
              onPress={() => learning.markNotificationRead(item.id)}
              style={[styles.card, unread && styles.unread]}
            >
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
              <Text style={styles.time}>
                {formatRelativeTime(item.timestamp)}
              </Text>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="bell"
            title="No notifications"
            message="New practice reminders will show up here."
          />
        }
      />
    </View>
  );
}
