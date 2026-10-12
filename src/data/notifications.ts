import type { AppNotification } from '../types';

export const notifications: AppNotification[] = [
  {
    id: 'n1',
    title: 'Daily goal is close',
    body: 'One more lesson completes today’s target of 3.',
    timestamp: '2026-10-12T08:30:00.000Z',
  },
  {
    id: 'n2',
    title: 'New in Explore',
    body: 'Ship a Small RAG App was added to AI Projects.',
    timestamp: '2026-10-11T16:10:00.000Z',
  },
  {
    id: 'n3',
    title: 'Streak still active',
    body: 'You have practiced 6 days in a row. Nice pace.',
    timestamp: '2026-10-11T07:45:00.000Z',
  },
];
