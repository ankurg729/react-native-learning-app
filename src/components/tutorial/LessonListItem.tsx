import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import { formatMinutes } from '../../utils/format';
import { AppIcon } from '../../utils/icons';

interface LessonListItemProps {
  title: string;
  minutes: number;
  completed: boolean;
  onPress: () => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
    pressed: {
      backgroundColor: theme.colors.primaryMuted,
    },
    copy: {
      flex: 1,
      gap: 2,
    },
    title: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },
    meta: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
  });

export function LessonListItem({
  title,
  minutes,
  completed,
  onPress,
}: LessonListItemProps) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${
        completed ? 'completed' : 'not completed'
      }`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <AppIcon
        name={completed ? 'circle-check' : 'play'}
        color={completed ? theme.colors.success : theme.colors.textSecondary}
        size={18}
      />
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>{formatMinutes(minutes)}</Text>
      </View>
      <AppIcon name="chevron-right" color={theme.colors.textMuted} size={16} />
    </Pressable>
  );
}
