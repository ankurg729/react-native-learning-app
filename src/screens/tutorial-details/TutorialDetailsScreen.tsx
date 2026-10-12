import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { DifficultyBadge } from '../../components/common/DifficultyBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { ProgressBar } from '../../components/common/ProgressBar';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { LessonListItem } from '../../components/tutorial/LessonListItem';
import { useLearning } from '../../hooks/useLearning';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { surfaceStyle } from '../../theme/surfaces';
import type { Theme } from '../../theme/theme';
import type { StackScreenProps } from '../../app/navigation/types';
import { formatMinutes } from '../../utils/format';
import { AppIcon } from '../../utils/icons';

type Props = StackScreenProps<'TutorialDetails'>;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    stack: {
      gap: theme.spacing.lg,
    },
    description: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
    meta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      alignItems: 'center',
    },
    metaText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    card: {
      ...surfaceStyle(theme),
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    heading: {
      ...theme.typography.subtitle,
      color: theme.colors.text,
    },
    outcome: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
    module: {
      ...surfaceStyle(theme),
      overflow: 'hidden',
    },
    moduleHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      padding: theme.spacing.lg,
    },
    moduleTitle: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
      flex: 1,
    },
    actions: {
      gap: theme.spacing.sm,
    },
  });

export function TutorialDetailsScreen({ navigation, route }: Props) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const learning = useLearning();
  const tutorial = learning.getTutorial(route.params.tutorialId);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});

  if (!tutorial) {
    return (
      <ScreenContainer scroll includeBottomInset>
        <AppHeader title="Tutorial" onBack={() => navigation.goBack()} />
        <EmptyState
          icon="search"
          title="Tutorial unavailable"
          message="This course is not in the local catalog."
          actionLabel="Go back"
          onAction={() => navigation.goBack()}
        />
      </ScreenContainer>
    );
  }

  const progress = learning.progressFor(tutorial.id);
  const next = learning.nextLesson(tutorial.id);
  const quiz = learning.getQuizForTutorial(tutorial.id);
  const latestAttempt = learning.quizAttempts.find(
    attempt => attempt.tutorialId === tutorial.id,
  );
  const category = learning.getCategory(tutorial.categoryId);
  const firstModuleId = tutorial.modules[0]?.id;
  const isOpen = (moduleId: string) =>
    openModules[moduleId] ?? moduleId === firstModuleId;

  const start = () => {
    const lesson = next ?? learning.getLessonsForTutorial(tutorial.id)[0];
    if (!lesson) {
      return;
    }
    navigation.navigate('LessonReader', {
      tutorialId: tutorial.id,
      lessonId: lesson.id,
    });
  };

  return (
    <ScreenContainer scroll includeBottomInset>
      <AppHeader
        title={tutorial.title}
        eyebrow={category?.title}
        onBack={() => navigation.goBack()}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              learning.isTutorialBookmarked(tutorial.id)
                ? 'Remove bookmark'
                : 'Bookmark tutorial'
            }
            onPress={() => learning.toggleTutorialBookmark(tutorial.id)}
          >
            <AppIcon
              name="bookmark"
              color={
                learning.isTutorialBookmarked(tutorial.id)
                  ? theme.colors.primary
                  : theme.colors.text
              }
              filled={learning.isTutorialBookmarked(tutorial.id)}
            />
          </Pressable>
        }
      />
      <View style={styles.stack}>
        <Text style={styles.description}>{tutorial.description}</Text>
        <View style={styles.meta}>
          <DifficultyBadge difficulty={tutorial.difficulty} />
          <Text style={styles.metaText}>
            {formatMinutes(tutorial.estimatedMinutes)}
          </Text>
          <Text style={styles.metaText}>{tutorial.lessonCount} lessons</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>{progress}% complete</Text>
          <ProgressBar value={progress} accessibilityLabel="Course progress" />
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>You’ll learn</Text>
          {tutorial.outcomes.map(outcome => (
            <Text key={outcome} style={styles.outcome}>
              • {outcome}
            </Text>
          ))}
        </View>
        <Text style={styles.heading}>Curriculum</Text>
        {tutorial.modules.map(module => {
          const expanded = isOpen(module.id);
          return (
            <View key={module.id} style={styles.module}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded }}
                accessibilityLabel={module.title}
                onPress={() =>
                  setOpenModules(current => ({
                    ...current,
                    [module.id]: !expanded,
                  }))
                }
                style={styles.moduleHeader}
              >
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <AppIcon
                  name="chevron-down"
                  color={theme.colors.textSecondary}
                  size={18}
                />
              </Pressable>
              {expanded
                ? module.lessonIds.map(lessonId => {
                    const lesson = learning.getLesson(lessonId);
                    if (!lesson) {
                      return null;
                    }
                    return (
                      <LessonListItem
                        key={lesson.id}
                        title={lesson.title}
                        minutes={lesson.estimatedMinutes}
                        completed={learning.isLessonComplete(lesson.id)}
                        onPress={() =>
                          navigation.navigate('LessonReader', {
                            tutorialId: tutorial.id,
                            lessonId: lesson.id,
                          })
                        }
                      />
                    );
                  })
                : null}
            </View>
          );
        })}
        <View style={styles.actions}>
          <PrimaryButton
            label={
              progress > 0 && progress < 100
                ? 'Resume Course'
                : progress === 100
                ? 'Review Course'
                : 'Start Course'
            }
            onPress={start}
            icon="play"
          />
          {quiz ? (
            <SecondaryButton
              label={
                latestAttempt
                  ? `Quiz score ${latestAttempt.score}/${latestAttempt.total}`
                  : 'Take knowledge check'
              }
              icon="trophy"
              onPress={() => navigation.navigate('Quiz', { quizId: quiz.id })}
            />
          ) : null}
        </View>
      </View>
    </ScreenContainer>
  );
}
