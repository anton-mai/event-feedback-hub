import type { TEventItem } from '../types/index.js';

const eventStore: TEventItem[] = [
  { id: '1', name: 'React Workshop 2025' },
  { id: '2', name: 'GraphQL Deep Dive' },
  { id: '3', name: 'TypeScript Best Practices' },
  { id: '4', name: 'Node.js Backend Patterns' },
  { id: '5', name: 'Full-Stack Conference' },
];

export const getEventItems = (): TEventItem[] => [...eventStore];

export const getEventItemById = (id: string): TEventItem | undefined =>
  eventStore.find((event) => event.id === id);
