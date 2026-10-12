import type { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'generative-ai',
    title: 'Generative AI',
    description: 'How models draft text, images, and code.',
    icon: 'sparkles',
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering',
    description: 'Patterns that make instructions reliable.',
    icon: 'message',
  },
  {
    id: 'rag',
    title: 'RAG & Vector Databases',
    description: 'Ground answers in your own documents.',
    icon: 'database',
  },
  {
    id: 'mcp-agents',
    title: 'MCP & AI Agents',
    description: 'Tools, protocols, and agent loops.',
    icon: 'bot',
  },
  {
    id: 'llm-fundamentals',
    title: 'LLM Fundamentals',
    description: 'Tokens, context, and model behavior.',
    icon: 'brain',
  },
  {
    id: 'ai-projects',
    title: 'AI Projects',
    description: 'Ship small products you can explain.',
    icon: 'rocket',
  },
];

export const categoriesById = Object.fromEntries(
  categories.map(category => [category.id, category]),
) as Record<Category['id'], Category>;
