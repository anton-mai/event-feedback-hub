import type { TEventItem, TFeedbackItem } from './store.types';

const eventStore: TEventItem[] = [
  { id: '1', name: 'React Workshop 2025' },
  { id: '2', name: 'GraphQL Deep Dive' },
  { id: '3', name: 'TypeScript Best Practices' },
  { id: '4', name: 'Node.js Backend Patterns' },
  { id: '5', name: 'Full-Stack Conference' },
];

const feedbackStore: TFeedbackItem[] = [
  {
    id: 'fb-1',
    eventId: '1',
    content: 'Great workshop, learned a lot about hooks and context.',
    rating: 5,
    createdBy: 'Alex',
    createdAt: new Date('2026-03-11 10:12:20').toISOString(),
  },
  {
    id: 'fb-2',
    eventId: '1',
    content: 'Solid intro to React. Would have liked more time on testing.',
    rating: 4,
    createdBy: 'Sam',
    createdAt: new Date('2026-03-08 11:34:04').toISOString(),
  },
];

export const getEventItems = (): TEventItem[] => [...eventStore];

export const getEventItemById = (id: string): TEventItem | undefined =>
  eventStore.find((event) => event.id === id);

export const getFeedbackItems = (): TFeedbackItem[] => [...feedbackStore];

export const addFeedbackItem = (record: TFeedbackItem): TFeedbackItem => {
  feedbackStore.push(record);

  return record;
};
