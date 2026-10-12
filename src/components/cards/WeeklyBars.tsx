import { StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { surfaceStyle } from '../../theme/surfaces';
import type { Theme } from '../../theme/theme';
import type { WeeklyStat } from '../../types';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      ...surfaceStyle(theme),
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    title: {
      ...theme.typography.subtitle,
      color: theme.colors.text,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      height: 96,
      gap: theme.spacing.sm,
    },
    column: {
      flex: 1,
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    track: {
      height: 72,
      width: '100%',
      justifyContent: 'flex-end',
      backgroundColor: theme.colors.primaryMuted,
      borderRadius: theme.radii.sm,
      overflow: 'hidden',
    },
    fill: {
      width: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radii.sm,
    },
    today: {
      backgroundColor: theme.colors.secondary,
    },
    label: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    todayLabel: {
      color: theme.colors.text,
      fontWeight: '700',
    },
  });

export function WeeklyBars({ stats }: { stats: WeeklyStat[] }) {
  const styles = useThemedStyles(createStyles);
  const max = Math.max(...stats.map(item => item.minutes), 1);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>This week</Text>
      <View style={styles.row}>
        {stats.map(item => (
          <View key={item.label} style={styles.column}>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  item.isToday && styles.today,
                  { height: `${Math.max(8, (item.minutes / max) * 100)}%` },
                ]}
                accessibilityLabel={`${item.label}, ${item.minutes} minutes`}
              />
            </View>
            <Text style={[styles.label, item.isToday && styles.todayLabel]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
