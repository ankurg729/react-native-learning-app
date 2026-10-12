import { lessonsById } from '../data/lessons';
import { notifications } from '../data/notifications';
import {
  ACTIVE_TUTORIAL_ID,
  tutorials,
  tutorialsById,
} from '../data/tutorials';
import type {
  ActivityItem,
  QuizAttempt,
  Tutorial,
  UserProfile,
  UserSettings,
  WeeklyStat,
} from '../types';

export interface LearningState {
  completedLessonIds: string[];
  bookmarkedTutorialIds: string[];
  bookmarkedLessonIds: string[];
  quizAttempts: QuizAttempt[];
  profile: UserProfile;
  settings: UserSettings;
  readNotificationIds: string[];
  activity: ActivityItem[];
  dailyGoalCompleted: number;
}

export interface PersistedLearningState {
  completedLessonIds: string[];
  bookmarkedTutorialIds: string[];
  bookmarkedLessonIds: string[];
  quizAttempts: QuizAttempt[];
  profile: UserProfile;
  settings: UserSettings;
  readNotificationIds: string[];
  activity: ActivityItem[];
  dailyGoalCompleted: number;
}

export const DAILY_GOAL_TARGET = 3;
export const STREAK_DAYS = 6;

export const weeklyStats: WeeklyStat[] = [
  { label: 'Tue', minutes: 40 },
  { label: 'Wed', minutes: 15 },
  { label: 'Thu', minutes: 50 },
  { label: 'Fri', minutes: 35 },
  { label: 'Sat', minutes: 20 },
  { label: 'Sun', minutes: 30 },
  { label: 'Mon', minutes: 25, isToday: true },
];

export const initialProfile: UserProfile = {
  name: 'Alex Morgan',
  level: 'AI Explorer',
  email: 'alex.morgan@example.com',
  bio: 'Learning how modern AI systems are designed, prompted, and shipped.',
};

const initialActivity: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Completed “Tokens, Context, and Temperature”',
    detail: 'Generative AI Fundamentals',
    timestamp: '2026-10-11T18:20:00.000Z',
    kind: 'lesson',
  },
  {
    id: 'act-2',
    title: 'Scored 4/5 on AI Fundamentals Check',
    detail: 'Knowledge check',
    timestamp: '2026-10-10T12:00:00.000Z',
    kind: 'quiz',
  },
  {
    id: 'act-3',
    title: 'Saved Prompt Patterns That Work',
    detail: 'Bookmark',
    timestamp: '2026-10-09T09:15:00.000Z',
    kind: 'bookmark',
  },
];

export function createInitialLearningState(): LearningState {
  return {
    completedLessonIds: ['gen-1', 'gen-2', 'image-gen-l1', 'image-gen-l2'],
    bookmarkedTutorialIds: ['prompt-patterns', 'mcp-intro'],
    bookmarkedLessonIds: ['gen-3'],
    quizAttempts: [
      {
        id: 'attempt-seed',
        quizId: 'ai-fundamentals',
        tutorialId: 'gen-fundamentals',
        score: 4,
        total: 5,
        completedAt: '2026-10-10T12:00:00.000Z',
      },
    ],
    profile: initialProfile,
    settings: {
      notificationsEnabled: true,
      remindersEnabled: true,
    },
    readNotificationIds: ['n2'],
    activity: initialActivity,
    dailyGoalCompleted: 2,
  };
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

export function mergeStoredState(stored: unknown): LearningState {
  const base = createInitialLearningState();
  if (!stored || typeof stored !== 'object') {
    return base;
  }
  const record = stored as Partial<PersistedLearningState>;
  return {
    completedLessonIds: isStringArray(record.completedLessonIds)
      ? record.completedLessonIds
      : base.completedLessonIds,
    bookmarkedTutorialIds: isStringArray(record.bookmarkedTutorialIds)
      ? record.bookmarkedTutorialIds
      : base.bookmarkedTutorialIds,
    bookmarkedLessonIds: isStringArray(record.bookmarkedLessonIds)
      ? record.bookmarkedLessonIds
      : base.bookmarkedLessonIds,
    quizAttempts: Array.isArray(record.quizAttempts)
      ? record.quizAttempts
      : base.quizAttempts,
    profile: { ...base.profile, ...record.profile },
    settings: { ...base.settings, ...record.settings },
    readNotificationIds: isStringArray(record.readNotificationIds)
      ? record.readNotificationIds
      : base.readNotificationIds,
    activity: Array.isArray(record.activity) ? record.activity : base.activity,
    dailyGoalCompleted:
      typeof record.dailyGoalCompleted === 'number'
        ? record.dailyGoalCompleted
        : base.dailyGoalCompleted,
  };
}

export type LearningAction =
  | { type: 'hydrate'; state: LearningState }
  | { type: 'toggle-tutorial-bookmark'; tutorialId: string }
  | { type: 'toggle-lesson-bookmark'; lessonId: string }
  | { type: 'complete-lesson'; lessonId: string }
  | { type: 'save-quiz'; attempt: QuizAttempt }
  | { type: 'update-profile'; patch: Partial<UserProfile> }
  | { type: 'update-settings'; patch: Partial<UserSettings> }
  | { type: 'mark-notification-read'; notificationId: string }
  | { type: 'mark-all-notifications-read' };

function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id];
}

export function learningReducer(
  state: LearningState,
  action: LearningAction,
): LearningState {
  switch (action.type) {
    case 'hydrate':
      return action.state;
    case 'toggle-tutorial-bookmark':
      return {
        ...state,
        bookmarkedTutorialIds: toggleId(
          state.bookmarkedTutorialIds,
          action.tutorialId,
        ),
      };
    case 'toggle-lesson-bookmark':
      return {
        ...state,
        bookmarkedLessonIds: toggleId(
          state.bookmarkedLessonIds,
          action.lessonId,
        ),
      };
    case 'complete-lesson': {
      if (state.completedLessonIds.includes(action.lessonId)) {
        return state;
      }
      const lesson = lessonsById[action.lessonId];
      const tutorial = lesson ? tutorialsById[lesson.tutorialId] : undefined;
      const activity: ActivityItem = {
        id: `act-${action.lessonId}-${state.activity.length}`,
        title: `Completed “${lesson?.title ?? 'Lesson'}”`,
        detail: tutorial?.title ?? 'Lesson',
        timestamp: new Date().toISOString(),
        kind: 'lesson',
      };
      return {
        ...state,
        completedLessonIds: [...state.completedLessonIds, action.lessonId],
        dailyGoalCompleted: Math.min(
          DAILY_GOAL_TARGET,
          state.dailyGoalCompleted + 1,
        ),
        activity: [activity, ...state.activity].slice(0, 12),
      };
    }
    case 'save-quiz':
      return {
        ...state,
        quizAttempts: [
          action.attempt,
          ...state.quizAttempts.filter(
            attempt => attempt.quizId !== action.attempt.quizId,
          ),
        ],
        activity: (
          [
            {
              id: action.attempt.id,
              title: `Scored ${action.attempt.score}/${action.attempt.total} on AI Fundamentals Check`,
              detail: 'Knowledge check',
              timestamp: action.attempt.completedAt,
              kind: 'quiz',
            },
            ...state.activity,
          ] satisfies ActivityItem[]
        ).slice(0, 12),
      };
    case 'update-profile':
      return { ...state, profile: { ...state.profile, ...action.patch } };
    case 'update-settings':
      return { ...state, settings: { ...state.settings, ...action.patch } };
    case 'mark-notification-read':
      if (state.readNotificationIds.includes(action.notificationId)) {
        return state;
      }
      return {
        ...state,
        readNotificationIds: [
          ...state.readNotificationIds,
          action.notificationId,
        ],
      };
    case 'mark-all-notifications-read':
      return {
        ...state,
        readNotificationIds: notifications.map(item => item.id),
      };
    default:
      return state;
  }
}

export function orderedLessonIds(tutorial: Tutorial): string[] {
  return tutorial.modules.flatMap(module => module.lessonIds);
}

export function progressForTutorial(
  tutorial: Tutorial,
  completedLessonIds: readonly string[],
): number {
  const ids = orderedLessonIds(tutorial);
  if (ids.length === 0) {
    return 0;
  }
  const done = ids.filter(id => completedLessonIds.includes(id)).length;
  return Math.round((done / ids.length) * 100);
}

export function nextLessonId(
  tutorial: Tutorial,
  completedLessonIds: readonly string[],
): string | undefined {
  return orderedLessonIds(tutorial).find(
    id => !completedLessonIds.includes(id),
  );
}

export function selectContinueTutorial(state: LearningState): Tutorial {
  const active = tutorialsById[ACTIVE_TUTORIAL_ID] ?? tutorials[0];
  const inProgress = tutorials
    .map(tutorial => ({
      tutorial,
      progress: progressForTutorial(tutorial, state.completedLessonIds),
    }))
    .filter(item => item.progress > 0 && item.progress < 100)
    .sort((a, b) => b.progress - a.progress);
  return inProgress[0]?.tutorial ?? active;
}

export function toPersistedState(state: LearningState): PersistedLearningState {
  return {
    completedLessonIds: state.completedLessonIds,
    bookmarkedTutorialIds: state.bookmarkedTutorialIds,
    bookmarkedLessonIds: state.bookmarkedLessonIds,
    quizAttempts: state.quizAttempts,
    profile: state.profile,
    settings: state.settings,
    readNotificationIds: state.readNotificationIds,
    activity: state.activity,
    dailyGoalCompleted: state.dailyGoalCompleted,
  };
}
