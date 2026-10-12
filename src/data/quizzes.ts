import type { Quiz } from '../types';

export const quizzes: Quiz[] = [
  {
    id: 'ai-fundamentals',
    tutorialId: 'gen-fundamentals',
    title: 'AI Fundamentals Check',
    questions: [
      {
        id: 'q1',
        prompt: 'What does a large language model directly predict?',
        options: [
          'The next token, given the tokens so far',
          'A verified fact from a private database',
          'The user’s intent with perfect accuracy',
          'The shortest possible answer every time',
        ],
        correctIndex: 0,
        explanation:
          'An LLM scores possible next tokens and samples one. Retrieval, tools, and product logic sit around that core behavior.',
      },
      {
        id: 'q2',
        prompt: 'What is a token?',
        options: [
          'A billed user account',
          'A chunk of text the model reads and writes',
          'A database row that stores a document',
          'A password for an API key',
        ],
        correctIndex: 1,
        explanation:
          'Tokens are the model’s text units. A word may be one token or several, and the context window is a token budget.',
      },
      {
        id: 'q3',
        prompt: 'What problem does retrieval-augmented generation address?',
        options: [
          'Models cannot be prompted',
          'Answers need grounding in source material the model was not trained on',
          'Embeddings replace the need for text',
          'Temperature must always be zero',
        ],
        correctIndex: 1,
        explanation:
          'RAG fetches relevant passages and places them in the prompt so the draft can follow those sources.',
      },
      {
        id: 'q4',
        prompt: 'What is an embedding?',
        options: [
          'A list of numbers that represents meaning for similarity search',
          'A hidden system prompt',
          'A compressed image thumbnail',
          'A quiz score stored on device',
        ],
        correctIndex: 0,
        explanation:
          'Embeddings place similar texts near each other in vector space so search can match ideas, not only exact words.',
      },
      {
        id: 'q5',
        prompt: 'What does a higher temperature usually do to generation?',
        options: [
          'It makes the same prompt more likely to vary',
          'It increases the context window',
          'It guarantees factual accuracy',
          'It disables tool calling',
        ],
        correctIndex: 0,
        explanation:
          'Temperature reshapes how sharply the model prefers its top token. Higher values explore more; they do not add knowledge.',
      },
    ],
  },
];

export const quizzesById = Object.fromEntries(
  quizzes.map(quiz => [quiz.id, quiz]),
) as Record<string, Quiz>;

export function quizForTutorial(tutorialId: string): Quiz | undefined {
  return quizzes.find(quiz => quiz.tutorialId === tutorialId);
}
