import type { ChatMessage } from '../types';

export const introMessage: ChatMessage = {
  id: 'intro',
  role: 'assistant',
  text: 'Hi — I am the practice tutor on this device. I answer with prepared examples so you can rehearse questions before a live model is connected. Try a suggestion, or open a lesson and ask about it.',
  createdAt: '2026-10-12T09:00:00.000Z',
};

export const suggestedPrompts = [
  'Explain RAG in simple terms',
  'What are embeddings?',
  'Explain MCP with an example',
  'Help me understand this code',
] as const;
