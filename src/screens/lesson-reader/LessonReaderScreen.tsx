import { useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/common/AppHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { ProgressBar } from '../../components/common/ProgressBar';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { LessonContent } from '../../components/tutorial/LessonContent';
import { useLearning } from '../../hooks/useLearning';
import { useTheme } from '../../hooks/useTheme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import type { StackScreenProps } from '../../app/navigation/types';
import { clampPercent, formatMinutes } from '../../utils/format';
import { AppIcon } from '../../utils/icons';

type Props = StackScreenProps<'LessonReader'>;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    progress: {
      paddingHorizontal: theme.spacing.xl,
      marginBottom: theme.spacing.sm,
    },
    content: {
      paddingHorizontal: theme.spacing.xl,
      paddingBottom: theme.spacing.xl,
      gap: theme.spacing.lg,
    },
    meta: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.md,
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.background,
    },
    navRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    navButton: {
      flex: 1,
    },
  });

export function LessonReaderScreen({ navigation, route }: Props) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const learning = useLearning();
  const insets = useSafeAreaInsets();
  const [readingProgress, setReadingProgress] = useState(0);
  const tutorial = learning.getTutorial(route.params.tutorialId);
  const lesson = learning.getLesson(route.params.lessonId);

  if (!tutorial || !lesson || lesson.tutorialId !== tutorial.id) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.content}>
          <AppHeader title="Lesson" onBack={() => navigation.goBack()} />
          <EmptyState
            icon="book-open"
            title="Lesson unavailable"
            message="This lesson is not in the local catalog."
            actionLabel="Go back"
            onAction={() => navigation.goBack()}
          />
        </View>
      </View>
    );
  }

  const lessonIds = tutorial.lessonIds;
  const index = lessonIds.indexOf(lesson.id);
  const previousId = index > 0 ? lessonIds[index - 1] : undefined;
  const nextId =
    index >= 0 && index < lessonIds.length - 1
      ? lessonIds[index + 1]
      : undefined;
  const completed = learning.isLessonComplete(lesson.id);
  const bookmarked = learning.isLessonBookmarked(lesson.id);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const max = contentSize.height - layoutMeasurement.height;
    if (max <= 0) {
      setReadingProgress(100);
      return;
    }
    setReadingProgress(clampPercent((contentOffset.y / max) * 100));
  };

  const openLesson = (lessonId: string) => {
    navigation.replace('LessonReader', {
      tutorialId: tutorial.id,
      lessonId,
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: insets.top + theme.spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <AppHeader
            title={lesson.title}
            subtitle={tutorial.title}
            onBack={() => navigation.goBack()}
            right={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  bookmarked ? 'Remove lesson bookmark' : 'Bookmark lesson'
                }
                onPress={() => learning.toggleLessonBookmark(lesson.id)}
              >
                <AppIcon
                  name="bookmark"
                  color={bookmarked ? theme.colors.primary : theme.colors.text}
                  filled={bookmarked}
                />
              </Pressable>
            }
          />
          <Text style={styles.meta}>
            {formatMinutes(lesson.estimatedMinutes)}
          </Text>
        </View>
        <View style={styles.progress}>
          <ProgressBar
            value={readingProgress}
            height={4}
            accessibilityLabel="Reading progress"
          />
        </View>
        <View style={styles.content}>
          <LessonContent sections={lesson.sections} />
        </View>
      </ScrollView>
      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}
      >
        <SecondaryButton
          label="Ask AI Tutor about this lesson"
          icon="sparkles"
          onPress={() =>
            navigation.navigate('MainTabs', {
              screen: 'AITutor',
              params: {
                prefill: `Help me understand this lesson: ${lesson.title}`,
              },
            })
          }
        />
        <PrimaryButton
          label={completed ? 'Completed' : 'Mark as Completed'}
          icon={completed ? 'check' : undefined}
          disabled={completed}
          onPress={() => learning.markLessonComplete(lesson.id)}
        />
        <View style={styles.navRow}>
          <View style={styles.navButton}>
            <SecondaryButton
              label="Previous"
              icon="chevron-left"
              disabled={!previousId}
              onPress={() => previousId && openLesson(previousId)}
            />
          </View>
          <View style={styles.navButton}>
            <SecondaryButton
              label="Next"
              disabled={!nextId}
              onPress={() => nextId && openLesson(nextId)}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
