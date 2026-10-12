import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import type { Difficulty } from '../../types';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    badge: {
      alignSelf: 'flex-start',
      borderRadius: theme.radii.pill,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 3,
    },
    label: {
      ...theme.typography.caption,
      fontWeight: '700',
    },
  });

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const tone = theme.colors.difficulty[difficulty];

  return (
    <View style={[styles.badge, { backgroundColor: tone.background }]}>
      <Text style={[styles.label, { color: tone.text }]}>{difficulty}</Text>
    </View>
  );
}
