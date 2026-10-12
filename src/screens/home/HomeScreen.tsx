import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CategoryCard } from '../../components/cards/CategoryCard';
import { CourseCard } from '../../components/cards/ContinueCard';
import { HeroBanner } from '../../components/cards/HeroBanner';
import { TutorialCard } from '../../components/cards/TutorialCard';
import { AppHeader } from '../../components/common/AppHeader';
import { Avatar } from '../../components/common/Avatar';
import { CircularProgress } from '../../components/common/CircularProgress';
import { IconButton } from '../../components/common/IconButton';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { useLearning } from '../../hooks/useLearning';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { surfaceStyle } from '../../theme/surfaces';
import type { Theme } from '../../theme/theme';
import type { TabScreenProps } from '../../app/navigation/types';
import { AppIcon } from '../../utils/icons';

type Props = TabScreenProps<'Home'>;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    stack: {
      gap: theme.spacing.xxl,
    },
    row: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    metric: {
      ...surfaceStyle(theme),
      flex: 1,
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
      minHeight: 148,
    },
    metricLabel: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    metricValue: {
      ...theme.typography.subtitle,
      color: theme.colors.text,
    },
    streakRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
  });

export function HomeScreen({ navigation }: Props) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const learning = useLearning();
  const tutorial = learning.continueTutorial;
  const progress = learning.progressFor(tutorial.id);
  const next = learning.nextLesson(tutorial.id);
  const popular = [...learning.tutorials]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 6);
  const goalPercent =
    (learning.dailyGoal.completed / learning.dailyGoal.target) * 100;

  const resume = () => {
    if (next) {
      navigation.navigate('LessonReader', {
        tutorialId: tutorial.id,
        lessonId: next.id,
      });
      return;
    }
    navigation.navigate('TutorialDetails', { tutorialId: tutorial.id });
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.stack}>
        <AppHeader
          title="Hey, Learner 👋"
          subtitle="Ready to build something intelligent?"
          large
          right={
            <>
              <IconButton
                icon="bell"
                label="Notifications"
                badge={learning.unreadCount > 0}
                onPress={() => navigation.navigate('Notifications')}
              />
              <Avatar name={learning.profile.name} />
            </>
          }
        />
        <HeroBanner onPress={resume} />
        <CourseCard
          title={tutorial.title}
          progress={progress}
          nextLessonTitle={next?.title}
          nextLessonMinutes={next?.estimatedMinutes}
          onResume={resume}
        />
        <View style={styles.row}>
          <View style={styles.metric}>
            <CircularProgress
              value={goalPercent}
              size={64}
              label={`${learning.dailyGoal.completed}/${learning.dailyGoal.target}`}
              accessibilityLabel="Daily learning goal"
            />
            <Text style={styles.metricLabel}>Daily goal</Text>
            <Text style={styles.metricValue}>
              {learning.dailyGoal.completed} of {learning.dailyGoal.target}{' '}
              lessons
            </Text>
          </View>
          <View style={styles.metric}>
            <View style={styles.streakRow}>
              <AppIcon name="flame" color={theme.colors.warning} size={22} />
              <Text style={styles.metricValue}>{learning.streakDays} days</Text>
            </View>
            <Text style={styles.metricLabel}>Learning streak</Text>
            <Text style={styles.metricValue}>Keep the chain going</Text>
          </View>
        </View>
        <View>
          <SectionHeader title="Categories" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {learning.categories.map(category => (
              <CategoryCard
                key={category.id}
                title={category.title}
                description={category.description}
                icon={category.icon}
                accent={theme.colors.category[category.id]}
                onPress={() =>
                  navigation.navigate('CategoryDetails', {
                    categoryId: category.id,
                  })
                }
              />
            ))}
          </ScrollView>
        </View>
        <View>
          <SectionHeader
            title="Popular tutorials"
            actionLabel="See all"
            onAction={() => navigation.navigate('Explore')}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popular.map(item => (
              <TutorialCard
                key={item.id}
                variant="compact"
                title={item.title}
                category={learning.getCategory(item.categoryId)?.title ?? ''}
                difficulty={item.difficulty}
                minutes={item.estimatedMinutes}
                lessonCount={item.lessonCount}
                icon={item.thumbnail.icon}
                accent={theme.colors.category[item.categoryId]}
                bookmarked={learning.isTutorialBookmarked(item.id)}
                onPress={() =>
                  navigation.navigate('TutorialDetails', {
                    tutorialId: item.id,
                  })
                }
                onToggleBookmark={() =>
                  learning.toggleTutorialBookmark(item.id)
                }
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </ScreenContainer>
  );
}
