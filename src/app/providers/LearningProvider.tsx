import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { categories, categoriesById } from '../../data/categories';
import { notifications } from '../../data/notifications';
import { lessonsById } from '../../data/lessons';
import { quizForTutorial, quizzesById } from '../../data/quizzes';
import { tutorials, tutorialsById } from '../../data/tutorials';
import {
  createInitialLearningState,
  DAILY_GOAL_TARGET,
  learningReducer,
  mergeStoredState,
  nextLessonId,
  progressForTutorial,
  selectContinueTutorial,
  STREAK_DAYS,
  toPersistedState,
  weeklyStats,
  type LearningState,
} from '../../services/mockLearningService';
import type {
  ActivityItem,
  AppNotification,
  Category,
  CategoryId,
  Lesson,
  Quiz,
  QuizAttempt,
  Tutorial,
  UserProfile,
  UserSettings,
  WeeklyStat,
} from '../../types';
import { readStorage, STORAGE_KEYS, writeStorage } from '../../utils/storage';

export interface LearningContextValue {
  ready: boolean;
  profile: UserProfile;
  settings: UserSettings;
  tutorials: Tutorial[];
  categories: Category[];
  activity: ActivityItem[];
  quizAttempts: QuizAttempt[];
  notifications: AppNotification[];
  weeklyStats: WeeklyStat[];
  streakDays: number;
  dailyGoal: { target: number; completed: number };
  unreadCount: number;
  continueTutorial: Tutorial;
  inProgressTutorials: Tutorial[];
  completedTutorials: Tutorial[];
  bookmarkedTutorials: Tutorial[];
  completedLessonCount: number;
  totalLessonCount: number;
  getTutorial: (id: string) => Tutorial | undefined;
  getCategory: (id: CategoryId) => Category | undefined;
  getLesson: (id: string) => Lesson | undefined;
  getLessonsForTutorial: (tutorialId: string) => Lesson[];
  getQuiz: (quizId: string) => Quiz | undefined;
  getQuizForTutorial: (tutorialId: string) => Quiz | undefined;
  isLessonComplete: (lessonId: string) => boolean;
  isTutorialBookmarked: (tutorialId: string) => boolean;
  isLessonBookmarked: (lessonId: string) => boolean;
  progressFor: (tutorialId: string) => number;
  nextLesson: (tutorialId: string) => Lesson | undefined;
  toggleTutorialBookmark: (tutorialId: string) => void;
  toggleLessonBookmark: (lessonId: string) => void;
  markLessonComplete: (lessonId: string) => void;
  saveQuizAttempt: (attempt: QuizAttempt) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  updateSettings: (patch: Partial<UserSettings>) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  isNotificationRead: (notificationId: string) => boolean;
}

const LearningContext = createContext<LearningContextValue | undefined>(
  undefined,
);

function selectByProgress(
  state: LearningState,
  predicate: (progress: number) => boolean,
): Tutorial[] {
  return tutorials.filter(tutorial =>
    predicate(progressForTutorial(tutorial, state.completedLessonIds)),
  );
}

export function LearningProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    learningReducer,
    undefined,
    createInitialLearningState,
  );
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    let active = true;
    readStorage(STORAGE_KEYS.learning).then(raw => {
      if (!active) {
        return;
      }
      if (raw) {
        try {
          dispatch({
            type: 'hydrate',
            state: mergeStoredState(JSON.parse(raw)),
          });
        } catch {
          dispatch({ type: 'hydrate', state: createInitialLearningState() });
        }
      }
      hydrated.current = true;
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated.current) {
      return;
    }
    writeStorage(
      STORAGE_KEYS.learning,
      JSON.stringify(toPersistedState(state)),
    );
  }, [state]);

  const value = useMemo<LearningContextValue>(() => {
    const completedIds = new Set(state.completedLessonIds);
    const continueTutorial = selectContinueTutorial(state);
    const totalLessonCount = tutorials.reduce(
      (sum, tutorial) => sum + tutorial.lessonCount,
      0,
    );
    return {
      ready,
      profile: state.profile,
      settings: state.settings,
      tutorials,
      categories,
      activity: state.activity,
      quizAttempts: state.quizAttempts,
      notifications,
      weeklyStats,
      streakDays: STREAK_DAYS,
      dailyGoal: {
        target: DAILY_GOAL_TARGET,
        completed: state.dailyGoalCompleted,
      },
      unreadCount: state.settings.notificationsEnabled
        ? notifications.filter(
            item => !state.readNotificationIds.includes(item.id),
          ).length
        : 0,
      continueTutorial,
      inProgressTutorials: selectByProgress(
        state,
        progress => progress > 0 && progress < 100,
      ),
      completedTutorials: selectByProgress(state, progress => progress === 100),
      bookmarkedTutorials: tutorials.filter(tutorial =>
        state.bookmarkedTutorialIds.includes(tutorial.id),
      ),
      completedLessonCount: state.completedLessonIds.filter(id =>
        Boolean(lessonsById[id]),
      ).length,
      totalLessonCount,
      getTutorial: id => tutorialsById[id],
      getCategory: id => categoriesById[id],
      getLesson: id => lessonsById[id],
      getLessonsForTutorial: tutorialId =>
        (tutorialsById[tutorialId]?.lessonIds ?? [])
          .map(id => lessonsById[id])
          .filter((lesson): lesson is Lesson => Boolean(lesson)),
      getQuiz: id => quizzesById[id],
      getQuizForTutorial: quizForTutorial,
      isLessonComplete: lessonId => completedIds.has(lessonId),
      isTutorialBookmarked: tutorialId =>
        state.bookmarkedTutorialIds.includes(tutorialId),
      isLessonBookmarked: lessonId =>
        state.bookmarkedLessonIds.includes(lessonId),
      progressFor: tutorialId => {
        const tutorial = tutorialsById[tutorialId];
        return tutorial
          ? progressForTutorial(tutorial, state.completedLessonIds)
          : 0;
      },
      nextLesson: tutorialId => {
        const tutorial = tutorialsById[tutorialId];
        if (!tutorial) {
          return undefined;
        }
        const lessonId = nextLessonId(tutorial, state.completedLessonIds);
        return lessonId ? lessonsById[lessonId] : undefined;
      },
      toggleTutorialBookmark: tutorialId =>
        dispatch({ type: 'toggle-tutorial-bookmark', tutorialId }),
      toggleLessonBookmark: lessonId =>
        dispatch({ type: 'toggle-lesson-bookmark', lessonId }),
      markLessonComplete: lessonId =>
        dispatch({ type: 'complete-lesson', lessonId }),
      saveQuizAttempt: attempt => dispatch({ type: 'save-quiz', attempt }),
      updateProfile: patch => dispatch({ type: 'update-profile', patch }),
      updateSettings: patch => dispatch({ type: 'update-settings', patch }),
      markNotificationRead: notificationId =>
        dispatch({ type: 'mark-notification-read', notificationId }),
      markAllNotificationsRead: () =>
        dispatch({ type: 'mark-all-notifications-read' }),
      isNotificationRead: notificationId =>
        state.readNotificationIds.includes(notificationId),
    };
  }, [ready, state]);

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning(): LearningContextValue {
  const value = useContext(LearningContext);
  if (!value) {
    throw new Error('useLearning must be used within LearningProvider');
  }
  return value;
}
