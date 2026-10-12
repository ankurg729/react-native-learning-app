import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../common/PrimaryButton';
import { ProgressBar } from '../common/ProgressBar';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { surfaceStyle } from '../../theme/surfaces';
import type { Theme } from '../../theme/theme';
import { formatMinutes } from '../../utils/format';

interface ContinueCardProps {
  title: string;
  progress: number;
  nextLessonTitle?: string;
  nextLessonMinutes?: number;
  onResume: () => void;
  ctaLabel?: string;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      ...surfaceStyle(theme),
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    eyebrow: {
      ...theme.typography.overline,
      color: theme.colors.secondary,
    },
    title: {
      ...theme.typography.heading,
      color: theme.colors.text,
    },
    progressLabel: {
      ...theme.typography.label,
      color: theme.colors.textSecondary,
    },
    next: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
  });

export function CourseCard({
  title,
  progress,
  nextLessonTitle,
  nextLessonMinutes,
  onResume,
  ctaLabel = 'Resume Learning',
}: ContinueCardProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>Continue learning</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.progressLabel}>{progress}% complete</Text>
      <ProgressBar value={progress} accessibilityLabel={`${title} progress`} />
      {nextLessonTitle ? (
        <Text style={styles.next}>
          Next: {nextLessonTitle}
          {nextLessonMinutes ? ` · ${formatMinutes(nextLessonMinutes)}` : ''}
        </Text>
      ) : (
        <Text style={styles.next}>
          You finished every lesson in this course.
        </Text>
      )}
      <PrimaryButton label={ctaLabel} onPress={onResume} icon="play" />
    </View>
  );
}
