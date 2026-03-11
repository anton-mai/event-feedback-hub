/**
 * In-memory store. Data access only. No business logic.
 */

export {
  addFeedbackItem,
  getEventItemById,
  getEventItems,
  getFeedbackItems,
} from './store';
export type { TEventItem, TFeedbackItem } from './store.types';
