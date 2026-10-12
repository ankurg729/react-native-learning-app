import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CourseCard } from '../../components/cards/ContinueCard';
import { TutorialCard } from '../../components/cards/TutorialCard';
import { WeeklyBars } from '../../components/cards/WeeklyBars';
import { AppHeader } from '../../components/common/AppHeader';
import { CircularProgress } from '../../components/common/CircularProgress';
import { EmptyState } from '../../components/common/EmptyState';
import { SegmentedControl } from '../../components/common/SegmentedControl';
import { SectionHeader } from '../../components/common/SectionHeader';
import { useLearning } from '../../hooks/useLearning';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { surfaceStyle } from '../../theme/surfaces';
import type { Theme } from '../../theme/theme';
import type { Tutorial } from '../../types';
import type { TabScreenProps } from '../../app/navigation/types';
import { formatRelativeTime } from '../../utils/format';
import { AppIcon } from '../../utils/icons';

type Segment = 'progress' | 'completed' | 'bookmarks';
type Props = TabScreenProps<'MyLearning'>;

const OPTIONS = [
  { id: 'progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'bookmarks', label: 'Bookmarks' },
] as const;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      gap: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
    overview: {
      ...surfaceStyle(theme),
      padding: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.lg,
    },
    overviewCopy: {
      flex: 1,
      gap: 4,
    },
    overviewTitle: {
      ...theme.typography.subtitle,
      color: theme.colors.text,
    },
    overviewBody: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
    stats: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    stat: {
      ...surfaceStyle(theme),
      flex: 1,
      padding: theme.spacing.md,
      gap: 4,
    },
    statValue: {
      ...theme.typography.heading,
      color: theme.colors.text,
    },
    statLabel: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    activity: {
      gap: theme.spacing.sm,
    },
    activityRow: {
      ...surfaceStyle(theme),
      padding: theme.spacing.md,
      gap: 2,
    },
    activityTitle: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },
    activityMeta: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    quizRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    list: {
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.xxxl,
    },
  });

export function MyLearningScreen({ navigation }: Props) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const learning = useLearning();
  const insets = useSafeAreaInsets();
  const [segment, setSegment] = useState<Segment>('progress');
  const tutorial = learning.continueTutorial;
  const next = learning.nextLesson(tutorial.id);
  const overall =
    learning.totalLessonCount === 0
      ? 0
      : Math.round(
          (learning.completedLessonCount / learning.totalLessonCount) * 100,
        );

  const data: Tutorial[] =
    segment === 'completed'
      ? learning.completedTutorials
      : segment === 'bookmarks'
      ? learning.bookmarkedTutorials
      : learning.inProgressTutorials;

  const emptyCopy = {
    progress: {
      title: 'Nothing in progress',
      message: 'Open a tutorial from Explore to start a path.',
    },
    completed: {
      title: 'No completed tutorials yet',
      message: 'Finish every lesson in a course and it will land here.',
    },
    bookmarks: {
      title: 'No bookmarks yet',
      message: 'Save a tutorial from Explore and it will show up here.',
    },
  }[segment];

  return (
    <View style={styles.screen}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        extraData={learning.bookmarkedTutorials}
        contentContainerStyle={[
          styles.list,
          {
            paddingTop: insets.top + theme.spacing.md,
            paddingHorizontal: theme.spacing.xl,
          },
        ]}
        ListHeaderComponent={
          <View style={styles.header}>
            <AppHeader
              title="My Learning"
              subtitle="Progress, bookmarks, and recent practice."
            />
            <View style={styles.overview}>
              <CircularProgress
                value={overall}
                accessibilityLabel="Overall learning progress"
              />
              <View style={styles.overviewCopy}>
                <Text style={styles.overviewTitle}>Overall progress</Text>
                <Text style={styles.overviewBody}>
                  {learning.completedLessonCount} of {learning.totalLessonCount}{' '}
                  lessons completed
                </Text>
              </View>
            </View>
            <View style={styles.stats}>
              <View style={styles.stat}>
                <View style={styles.quizRow}>
                  <AppIcon
                    name="flame"
                    color={theme.colors.warning}
                    size={18}
                  />
                  <Text style={styles.statValue}>{learning.streakDays}</Text>
                </View>
                <Text style={styles.statLabel}>Day streak</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>
                  {learning.completedTutorials.length}
                </Text>
                <Text style={styles.statLabel}>Courses done</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>
                  {learning.weeklyStats.reduce(
                    (sum, item) => sum + item.minutes,
                    0,
                  )}
                </Text>
                <Text style={styles.statLabel}>Minutes this week</Text>
              </View>
            </View>
            <WeeklyBars stats={learning.weeklyStats} />
            <CourseCard
              title={tutorial.title}
              progress={learning.progressFor(tutorial.id)}
              nextLessonTitle={next?.title}
              nextLessonMinutes={next?.estimatedMinutes}
              onResume={() => {
                if (next) {
                  navigation.navigate('LessonReader', {
                    tutorialId: tutorial.id,
                    lessonId: next.id,
                  });
                  return;
                }
                navigation.navigate('TutorialDetails', {
                  tutorialId: tutorial.id,
                });
              }}
            />
            <View style={styles.activity}>
              <SectionHeader title="Quiz scores" />
              {learning.quizAttempts.map(attempt => (
                <View key={attempt.id} style={styles.activityRow}>
                  <Text style={styles.activityTitle}>
                    {attempt.score}/{attempt.total} correct
                  </Text>
                  <Text style={styles.activityMeta}>
                    AI Fundamentals Check ·{' '}
                    {formatRelativeTime(attempt.completedAt)}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.activity}>
              <SectionHeader title="Recent activity" />
              {learning.activity.slice(0, 3).map(item => (
                <View key={item.id} style={styles.activityRow}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activityMeta}>
                    {item.detail} · {formatRelativeTime(item.timestamp)}
                  </Text>
                </View>
              ))}
            </View>
            <SegmentedControl
              options={OPTIONS}
              value={segment}
              onChange={setSegment}
            />
          </View>
        }
        renderItem={({ item }) => (
          <TutorialCard
            title={item.title}
            description={item.shortDescription}
            category={learning.getCategory(item.categoryId)?.title ?? ''}
            difficulty={item.difficulty}
            minutes={item.estimatedMinutes}
            lessonCount={item.lessonCount}
            icon={item.thumbnail.icon}
            accent={theme.colors.category[item.categoryId]}
            bookmarked={learning.isTutorialBookmarked(item.id)}
            onPress={() =>
              navigation.navigate('TutorialDetails', { tutorialId: item.id })
            }
            onToggleBookmark={() => learning.toggleTutorialBookmark(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="book-open"
            title={emptyCopy.title}
            message={emptyCopy.message}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
