import { lessonsById } from '../src/data/lessons';
import { quizzes } from '../src/data/quizzes';
import { tutorials } from '../src/data/tutorials';
import { categories } from '../src/data/categories';
import {
  createInitialLearningState,
  learningReducer,
  progressForTutorial,
} from '../src/services/mockLearningService';
import { getMockTutorReply } from '../src/services/mockChatService';
import { filterTutorials } from '../src/utils/filterTutorials';

describe('catalog', () => {
  test('every tutorial lesson exists and counts match', () => {
    const categoryIds = new Set(categories.map(category => category.id));
    tutorials.forEach(tutorial => {
      expect(categoryIds.has(tutorial.categoryId)).toBe(true);
      expect(tutorial.lessonIds).toHaveLength(tutorial.lessonCount);
      const moduleIds = tutorial.modules.flatMap(module => module.lessonIds);
      expect(moduleIds).toEqual(tutorial.lessonIds);
      tutorial.lessonIds.forEach(lessonId => {
        expect(lessonsById[lessonId]?.tutorialId).toBe(tutorial.id);
      });
    });
    expect(tutorials.length).toBeGreaterThanOrEqual(10);
    expect(new Set(tutorials.map(tutorial => tutorial.categoryId)).size).toBe(
      6,
    );
  });

  test('the sample quiz has five questions', () => {
    expect(quizzes[0]?.questions).toHaveLength(5);
    quizzes[0]?.questions.forEach(question => {
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(question.options.length);
    });
  });
});

describe('learning state', () => {
  test('toggling a bookmark adds and removes it', () => {
    const start = createInitialLearningState();
    const added = learningReducer(start, {
      type: 'toggle-tutorial-bookmark',
      tutorialId: 'llm-basics',
    });
    expect(added.bookmarkedTutorialIds).toContain('llm-basics');
    const removed = learningReducer(added, {
      type: 'toggle-tutorial-bookmark',
      tutorialId: 'llm-basics',
    });
    expect(removed.bookmarkedTutorialIds).not.toContain('llm-basics');
  });

  test('completing a lesson is idempotent and moves the daily goal', () => {
    const start = createInitialLearningState();
    const once = learningReducer(start, {
      type: 'complete-lesson',
      lessonId: 'gen-3',
    });
    const twice = learningReducer(once, {
      type: 'complete-lesson',
      lessonId: 'gen-3',
    });
    expect(once.completedLessonIds.filter(id => id === 'gen-3')).toHaveLength(
      1,
    );
    expect(twice.completedLessonIds.filter(id => id === 'gen-3')).toHaveLength(
      1,
    );
    expect(once.dailyGoalCompleted).toBe(3);
    expect(twice.dailyGoalCompleted).toBe(3);
    const course = tutorials.find(item => item.id === 'gen-fundamentals');
    expect(course).toBeDefined();
    if (course) {
      expect(progressForTutorial(course, once.completedLessonIds)).toBe(50);
    }
  });
});

describe('explore filters', () => {
  test('search and difficulty narrow the catalog', () => {
    const matches = filterTutorials(tutorials, {
      query: 'embedding',
      categoryId: 'All',
      difficulty: 'Intermediate',
      sort: 'popular',
      categories,
    });
    expect(matches.map(item => item.id)).toContain('embeddings');
    expect(matches.every(item => item.difficulty === 'Intermediate')).toBe(
      true,
    );
  });
});

describe('practice tutor', () => {
  test('matches keywords and labels the reply as local', () => {
    expect(getMockTutorReply('Explain RAG in simple terms').text).toMatch(
      /retrieval/i,
    );
    expect(getMockTutorReply('What are embeddings?').text).toMatch(/numbers/i);
    expect(getMockTutorReply('Explain MCP with an example').text).toMatch(
      /tool/i,
    );
    expect(getMockTutorReply('Help me understand this code').source).toBe(
      'local-mock',
    );
    expect(
      getMockTutorReply(
        'Help me understand this lesson: Tokens',
      ).text.startsWith('About “Tokens”'),
    ).toBe(true);
  });
});
