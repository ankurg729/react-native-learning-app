import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { ProgressBar } from '../../components/common/ProgressBar';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { QuizOption } from '../../components/quiz/QuizOption';
import { useLearning } from '../../hooks/useLearning';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { surfaceStyle } from '../../theme/surfaces';
import type { Theme } from '../../theme/theme';
import type { StackScreenProps } from '../../app/navigation/types';

type Props = StackScreenProps<'Quiz'>;

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    stack: {
      gap: theme.spacing.lg,
    },
    meta: {
      ...theme.typography.label,
      color: theme.colors.textSecondary,
    },
    prompt: {
      ...theme.typography.heading,
      color: theme.colors.text,
    },
    options: {
      gap: theme.spacing.sm,
    },
    nav: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    navItem: {
      flex: 1,
    },
    score: {
      ...surfaceStyle(theme),
      padding: theme.spacing.xl,
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    scoreValue: {
      ...theme.typography.display,
      color: theme.colors.text,
    },
    scoreLabel: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    review: {
      ...surfaceStyle(theme),
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    reviewTitle: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },
    explanation: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
  });

export function QuizScreen({ navigation, route }: Props) {
  const styles = useThemedStyles(createStyles);
  const learning = useLearning();
  const quiz = learning.getQuiz(route.params.quizId);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [phase, setPhase] = useState<'quiz' | 'results'>('quiz');
  const [score, setScore] = useState(0);

  if (!quiz) {
    return (
      <ScreenContainer scroll includeBottomInset>
        <AppHeader title="Quiz" onBack={() => navigation.goBack()} />
        <EmptyState
          icon="trophy"
          title="Quiz unavailable"
          message="This knowledge check is not in the local catalog."
          actionLabel="Go back"
          onAction={() => navigation.goBack()}
        />
      </ScreenContainer>
    );
  }

  const selections =
    answers.length === quiz.questions.length
      ? answers
      : quiz.questions.map(() => null);
  const question = quiz.questions[index];
  const selected = selections[index];
  const progress = ((index + 1) / quiz.questions.length) * 100;

  const choose = (optionIndex: number) => {
    setAnswers(current => {
      const base =
        current.length === quiz.questions.length
          ? [...current]
          : quiz.questions.map(() => null);
      base[index] = optionIndex;
      return base;
    });
  };

  const finish = () => {
    const nextScore = quiz.questions.reduce(
      (sum, item, itemIndex) =>
        sum + (selections[itemIndex] === item.correctIndex ? 1 : 0),
      0,
    );
    setScore(nextScore);
    learning.saveQuizAttempt({
      id: `attempt-${Date.now()}`,
      quizId: quiz.id,
      tutorialId: quiz.tutorialId,
      score: nextScore,
      total: quiz.questions.length,
      completedAt: new Date().toISOString(),
    });
    setPhase('results');
  };

  const retake = () => {
    setAnswers(quiz.questions.map(() => null));
    setIndex(0);
    setScore(0);
    setPhase('quiz');
  };

  if (phase === 'results') {
    return (
      <ScreenContainer scroll includeBottomInset>
        <AppHeader title="Results" onBack={() => navigation.goBack()} />
        <View style={styles.stack}>
          <View style={styles.score}>
            <Text style={styles.scoreValue}>
              {score}/{quiz.questions.length}
            </Text>
            <Text style={styles.scoreLabel}>
              {score === quiz.questions.length
                ? 'Every question matched the prepared key.'
                : 'Review the notes below, then retake the check.'}
            </Text>
          </View>
          {quiz.questions.map((item, itemIndex) => {
            const chosen = selections[itemIndex];
            const correct = chosen === item.correctIndex;
            return (
              <View key={item.id} style={styles.review}>
                <Text style={styles.reviewTitle}>
                  {itemIndex + 1}. {item.prompt}
                </Text>
                <Text style={styles.explanation}>
                  Your answer:{' '}
                  {chosen === null ? 'Blank' : item.options[chosen]}
                </Text>
                <Text style={styles.explanation}>
                  {correct
                    ? 'Correct. '
                    : `Correct answer: ${item.options[item.correctIndex]}. `}
                  {item.explanation}
                </Text>
              </View>
            );
          })}
          <PrimaryButton label="Retake quiz" icon="refresh" onPress={retake} />
          <SecondaryButton
            label="Back to course"
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll includeBottomInset>
      <AppHeader
        title={quiz.title}
        subtitle={`Question ${index + 1} of ${quiz.questions.length}`}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.stack}>
        <ProgressBar value={progress} accessibilityLabel="Quiz progress" />
        <Text style={styles.prompt}>{question.prompt}</Text>
        <View style={styles.options}>
          {question.options.map((option, optionIndex) => (
            <QuizOption
              key={option}
              label={option}
              indexLabel={LETTERS[optionIndex] ?? String(optionIndex + 1)}
              selected={selected === optionIndex}
              onPress={() => choose(optionIndex)}
            />
          ))}
        </View>
        <View style={styles.nav}>
          <View style={styles.navItem}>
            <SecondaryButton
              label="Previous"
              disabled={index === 0}
              onPress={() => setIndex(current => Math.max(0, current - 1))}
            />
          </View>
          <View style={styles.navItem}>
            {index === quiz.questions.length - 1 ? (
              <PrimaryButton
                label="Finish"
                disabled={selected === null}
                onPress={finish}
              />
            ) : (
              <PrimaryButton
                label="Next"
                disabled={selected === null}
                onPress={() => setIndex(current => current + 1)}
              />
            )}
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
