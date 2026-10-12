import type {
  CompletionStatus,
  CourseModule,
  Difficulty,
  Tutorial,
} from '../types';
import type { CategoryId, IconName } from '../types';

interface TutorialDraft {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  categoryId: CategoryId;
  difficulty: Difficulty;
  estimatedMinutes: number;
  tags: string[];
  featured: boolean;
  popularity: number;
  icon: IconName;
  completionStatus: CompletionStatus;
  outcomes: string[];
  modules: CourseModule[];
  addedAt: string;
}

function tutorial(draft: TutorialDraft): Tutorial {
  const lessonIds = draft.modules.flatMap(module => module.lessonIds);
  return {
    id: draft.id,
    slug: draft.slug,
    title: draft.title,
    shortDescription: draft.shortDescription,
    description: draft.description,
    categoryId: draft.categoryId,
    difficulty: draft.difficulty,
    estimatedMinutes: draft.estimatedMinutes,
    lessonCount: lessonIds.length,
    tags: draft.tags,
    featured: draft.featured,
    popularity: draft.popularity,
    thumbnail: { icon: draft.icon },
    completionStatus: draft.completionStatus,
    lessonIds,
    outcomes: draft.outcomes,
    modules: draft.modules,
    addedAt: draft.addedAt,
  };
}

export const tutorials: Tutorial[] = [
  tutorial({
    id: 'gen-fundamentals',
    slug: 'generative-ai-fundamentals',
    title: 'Generative AI Fundamentals',
    shortDescription: 'See what a model actually does, then steer it.',
    description:
      'A practical tour of generative models: next-token prediction, prompts, temperature, and how to judge an answer before you ship it.',
    categoryId: 'generative-ai',
    difficulty: 'Beginner',
    estimatedMinutes: 49,
    tags: ['foundations', 'prompts', 'temperature'],
    featured: true,
    popularity: 98,
    icon: 'sparkles',
    completionStatus: 'in-progress',
    outcomes: [
      'Explain next-token prediction without the hype.',
      'Choose temperature and context with intent.',
      'Iterate a prompt and check the result.',
    ],
    modules: [
      {
        id: 'gen-m1',
        title: 'Foundations',
        lessonIds: ['gen-1', 'gen-2'],
      },
      {
        id: 'gen-m2',
        title: 'Controlling the model',
        lessonIds: ['gen-3', 'gen-4'],
      },
      {
        id: 'gen-m3',
        title: 'Practice',
        lessonIds: ['gen-5', 'gen-6'],
      },
    ],
    addedAt: '2026-08-01',
  }),
  tutorial({
    id: 'prompt-patterns',
    slug: 'prompt-patterns-that-work',
    title: 'Prompt Patterns That Work',
    shortDescription: 'Reusable structures for clearer instructions.',
    description:
      'Move past one-off prompts. Learn role, task, constraints, and examples so a teammate can reuse the same pattern.',
    categoryId: 'prompt-engineering',
    difficulty: 'Beginner',
    estimatedMinutes: 18,
    tags: ['prompts', 'patterns', 'examples'],
    featured: true,
    popularity: 93,
    icon: 'message',
    completionStatus: 'not-started',
    outcomes: [
      'Spot the four parts of a durable prompt.',
      'Add an example without overfitting the wording.',
    ],
    modules: [
      { id: 'pp-m1', title: 'Core ideas', lessonIds: ['prompt-patterns-l1'] },
      { id: 'pp-m2', title: 'Try it', lessonIds: ['prompt-patterns-l2'] },
    ],
    addedAt: '2026-09-12',
  }),
  tutorial({
    id: 'rag-essentials',
    slug: 'retrieval-augmented-generation',
    title: 'Retrieval-Augmented Generation',
    shortDescription: 'Answer from documents, not from memory alone.',
    description:
      'Follow a question from chunking to retrieval to a grounded draft, and learn what RAG does not magically fix.',
    categoryId: 'rag',
    difficulty: 'Intermediate',
    estimatedMinutes: 22,
    tags: ['rag', 'retrieval', 'grounding'],
    featured: true,
    popularity: 96,
    icon: 'database',
    completionStatus: 'not-started',
    outcomes: [
      'Describe the retrieve-then-generate loop.',
      'Name the failures that retrieval cannot hide.',
    ],
    modules: [
      {
        id: 'rag-m1',
        title: 'Why retrieval exists',
        lessonIds: ['rag-essentials-l1'],
      },
      {
        id: 'rag-m2',
        title: 'A small pipeline',
        lessonIds: ['rag-essentials-l2'],
      },
    ],
    addedAt: '2026-09-20',
  }),
  tutorial({
    id: 'vector-databases',
    slug: 'vector-databases-in-practice',
    title: 'Vector Databases in Practice',
    shortDescription: 'Store embeddings and search them on purpose.',
    description:
      'Learn what a vector index holds, how similarity is scored, and which knobs matter when the corpus grows.',
    categoryId: 'rag',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    tags: ['vectors', 'search', 'indexes'],
    featured: false,
    popularity: 82,
    icon: 'layers',
    completionStatus: 'not-started',
    outcomes: [
      'Explain what gets stored beside a vector.',
      'Pick a similarity metric you can defend.',
    ],
    modules: [
      {
        id: 'vec-m1',
        title: 'What is stored',
        lessonIds: ['vector-databases-l1'],
      },
      {
        id: 'vec-m2',
        title: 'Search choices',
        lessonIds: ['vector-databases-l2'],
      },
    ],
    addedAt: '2026-07-18',
  }),
  tutorial({
    id: 'mcp-intro',
    slug: 'introduction-to-mcp',
    title: 'Introduction to MCP',
    shortDescription: 'A practical look at the Model Context Protocol.',
    description:
      'See how an assistant discovers tools through MCP, calls one, and folds the result back into the conversation.',
    categoryId: 'mcp-agents',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    tags: ['mcp', 'tools', 'protocol'],
    featured: true,
    popularity: 90,
    icon: 'bot',
    completionStatus: 'not-started',
    outcomes: [
      'Describe a tool call without hand-waving.',
      'Read a small MCP tool definition.',
    ],
    modules: [
      { id: 'mcp-m1', title: 'The idea', lessonIds: ['mcp-intro-l1'] },
      { id: 'mcp-m2', title: 'A tool definition', lessonIds: ['mcp-intro-l2'] },
    ],
    addedAt: '2026-10-02',
  }),
  tutorial({
    id: 'ai-agents',
    slug: 'building-reliable-ai-agents',
    title: 'Building Reliable AI Agents',
    shortDescription: 'Loops, tools, and the places agents fail.',
    description:
      'An agent is a model in a loop with tools and a stop condition. Learn the loop, then the guardrails.',
    categoryId: 'mcp-agents',
    difficulty: 'Advanced',
    estimatedMinutes: 24,
    tags: ['agents', 'tools', 'evaluation'],
    featured: false,
    popularity: 86,
    icon: 'rocket',
    completionStatus: 'not-started',
    outcomes: [
      'Draw the agent loop from plan to observation.',
      'List three failure modes worth testing.',
    ],
    modules: [
      { id: 'ag-m1', title: 'The loop', lessonIds: ['ai-agents-l1'] },
      { id: 'ag-m2', title: 'Failure modes', lessonIds: ['ai-agents-l2'] },
    ],
    addedAt: '2026-09-28',
  }),
  tutorial({
    id: 'llm-basics',
    slug: 'how-large-language-models-work',
    title: 'How Large Language Models Work',
    shortDescription: 'Prediction, parameters, and useful limits.',
    description:
      'A clear model of what an LLM is doing when it writes, and which settings change style rather than knowledge.',
    categoryId: 'llm-fundamentals',
    difficulty: 'Beginner',
    estimatedMinutes: 18,
    tags: ['llm', 'tokens', 'sampling'],
    featured: true,
    popularity: 91,
    icon: 'brain',
    completionStatus: 'not-started',
    outcomes: [
      'Separate model knowledge from product logic.',
      'Name the settings that change a draft.',
    ],
    modules: [
      { id: 'llm-m1', title: 'Prediction', lessonIds: ['llm-basics-l1'] },
      { id: 'llm-m2', title: 'Settings', lessonIds: ['llm-basics-l2'] },
    ],
    addedAt: '2026-06-15',
  }),
  tutorial({
    id: 'context-windows',
    slug: 'tokens-and-context-windows',
    title: 'Tokens and Context Windows',
    shortDescription: 'Spend the context budget on purpose.',
    description:
      'The context window is a budget. Learn what belongs in it, what should be retrieved, and what should stay out.',
    categoryId: 'llm-fundamentals',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    tags: ['tokens', 'context', 'cost'],
    featured: false,
    popularity: 78,
    icon: 'layers',
    completionStatus: 'not-started',
    outcomes: [
      'Estimate whether a passage fits.',
      'Decide what not to paste into a prompt.',
    ],
    modules: [
      { id: 'ctx-m1', title: 'The budget', lessonIds: ['context-windows-l1'] },
      {
        id: 'ctx-m2',
        title: 'What to keep',
        lessonIds: ['context-windows-l2'],
      },
    ],
    addedAt: '2026-08-22',
  }),
  tutorial({
    id: 'embeddings',
    slug: 'embeddings-explained',
    title: 'Embeddings, Explained',
    shortDescription: 'Turn meaning into vectors you can search.',
    description:
      'See how text becomes a vector, why similar questions cluster, and how a tiny similarity check works.',
    categoryId: 'llm-fundamentals',
    difficulty: 'Intermediate',
    estimatedMinutes: 18,
    tags: ['embeddings', 'similarity', 'search'],
    featured: false,
    popularity: 88,
    icon: 'compass',
    completionStatus: 'not-started',
    outcomes: [
      'Explain embeddings without the math fog.',
      'Read a cosine similarity helper.',
    ],
    modules: [
      {
        id: 'emb-m1',
        title: 'Meaning as vectors',
        lessonIds: ['embeddings-l1'],
      },
      {
        id: 'emb-m2',
        title: 'A similarity check',
        lessonIds: ['embeddings-l2'],
      },
    ],
    addedAt: '2026-09-05',
  }),
  tutorial({
    id: 'chatbot-project',
    slug: 'build-a-support-chatbot',
    title: 'Build a Support Chatbot',
    shortDescription: 'Scope a small assistant and a reply policy.',
    description:
      'Design a support bot with a narrow job, a refusal policy, and a path to a human. No backend required to plan it well.',
    categoryId: 'ai-projects',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    tags: ['project', 'chat', 'policy'],
    featured: false,
    popularity: 84,
    icon: 'message',
    completionStatus: 'not-started',
    outcomes: [
      'Write a one-sentence product scope.',
      'Define when the bot should hand off.',
    ],
    modules: [
      { id: 'bot-m1', title: 'Scope', lessonIds: ['chatbot-project-l1'] },
      {
        id: 'bot-m2',
        title: 'Reply policy',
        lessonIds: ['chatbot-project-l2'],
      },
    ],
    addedAt: '2026-10-05',
  }),
  tutorial({
    id: 'rag-app-project',
    slug: 'ship-a-small-rag-app',
    title: 'Ship a Small RAG App',
    shortDescription: 'Trace one user question through a tiny product.',
    description:
      'Plan a documentation assistant: what you index, what you show as sources, and how you know an answer is weak.',
    categoryId: 'ai-projects',
    difficulty: 'Advanced',
    estimatedMinutes: 22,
    tags: ['project', 'rag', 'sources'],
    featured: false,
    popularity: 80,
    icon: 'rocket',
    completionStatus: 'not-started',
    outcomes: [
      'Slice a RAG product to one user journey.',
      'Decide how sources appear in the UI.',
    ],
    modules: [
      {
        id: 'rapp-m1',
        title: 'Slice the product',
        lessonIds: ['rag-app-project-l1'],
      },
      {
        id: 'rapp-m2',
        title: 'Trace a question',
        lessonIds: ['rag-app-project-l2'],
      },
    ],
    addedAt: '2026-09-30',
  }),
  tutorial({
    id: 'image-gen',
    slug: 'image-generation-basics',
    title: 'Image Generation Basics',
    shortDescription: 'Describe a picture with constraints that stick.',
    description:
      'Practice image prompts: subject, style, composition, and the edits that change one thing at a time.',
    categoryId: 'generative-ai',
    difficulty: 'Beginner',
    estimatedMinutes: 14,
    tags: ['images', 'prompts', 'iteration'],
    featured: false,
    popularity: 74,
    icon: 'image',
    completionStatus: 'completed',
    outcomes: [
      'Write an image prompt with four concrete parts.',
      'Change one constraint and predict the difference.',
    ],
    modules: [
      {
        id: 'img-m1',
        title: 'Describe the picture',
        lessonIds: ['image-gen-l1'],
      },
      { id: 'img-m2', title: 'Iterate', lessonIds: ['image-gen-l2'] },
    ],
    addedAt: '2026-07-02',
  }),
];

export const tutorialsById = Object.fromEntries(
  tutorials.map(item => [item.id, item]),
) as Record<string, Tutorial>;

export const ACTIVE_TUTORIAL_ID = 'gen-fundamentals';
