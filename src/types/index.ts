export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type CategoryId =
  | 'generative-ai'
  | 'prompt-engineering'
  | 'rag'
  | 'mcp-agents'
  | 'llm-fundamentals'
  | 'ai-projects';

export type CompletionStatus = 'not-started' | 'in-progress' | 'completed';

export type IconName =
  | 'sparkles'
  | 'compass'
  | 'book-open'
  | 'bot'
  | 'user'
  | 'bell'
  | 'bookmark'
  | 'clock'
  | 'layers'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-down'
  | 'search'
  | 'x'
  | 'play'
  | 'check'
  | 'circle-check'
  | 'flame'
  | 'target'
  | 'copy'
  | 'send'
  | 'trash'
  | 'settings'
  | 'moon'
  | 'sun'
  | 'monitor'
  | 'info'
  | 'shield'
  | 'log-out'
  | 'pencil'
  | 'trophy'
  | 'graduation'
  | 'database'
  | 'brain'
  | 'message'
  | 'rocket'
  | 'image'
  | 'terminal'
  | 'lightbulb'
  | 'alert'
  | 'sliders'
  | 'refresh'
  | 'home';

export type AppearancePreference = 'dark' | 'light' | 'system';

export type ColorMode = 'dark' | 'light';

export interface Category {
  id: CategoryId;
  title: string;
  description: string;
  icon: IconName;
}

export interface CourseModule {
  id: string;
  title: string;
  lessonIds: string[];
}

export interface Tutorial {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  categoryId: CategoryId;
  difficulty: Difficulty;
  estimatedMinutes: number;
  lessonCount: number;
  tags: string[];
  featured: boolean;
  popularity: number;
  thumbnail: {
    icon: IconName;
  };
  completionStatus: CompletionStatus;
  lessonIds: string[];
  outcomes: string[];
  modules: CourseModule[];
  addedAt: string;
}

export type CalloutTone = 'info' | 'tip' | 'warning';

export type LessonSection =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'callout'; tone: CalloutTone; title: string; text: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'output'; text: string };

export interface Lesson {
  id: string;
  tutorialId: string;
  title: string;
  estimatedMinutes: number;
  sections: LessonSection[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  tutorialId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  tutorialId: string;
  score: number;
  total: number;
  completedAt: string;
}

export interface UserProfile {
  name: string;
  level: string;
  email: string;
  bio: string;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  remindersEnabled: boolean;
}

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  kind: 'lesson' | 'quiz' | 'bookmark';
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
}

export interface WeeklyStat {
  label: string;
  minutes: number;
  isToday?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
}

export type TutorialSort = 'recommended' | 'popular' | 'recent';

export type DifficultyFilter = Difficulty | 'All';

export type CategoryFilter = CategoryId | 'All';
