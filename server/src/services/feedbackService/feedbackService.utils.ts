import { getEventItemById } from '../../store/eventStore.js';
import type { TFeedbackItem } from '../../types/index.js';
import { createNotFoundError } from '../../utils/errors.js';

function filterByEventId(
  items: TFeedbackItem[],
  eventId: string,
): TFeedbackItem[] {
  const event = getEventItemById(eventId);

  if (!event) {
    throw createNotFoundError(`Event with id "${eventId}" not found.`);
  }

  return items.filter((feedback) => feedback.eventId === eventId);
}

export function getFilteredFeedbackItems(
  allItems: TFeedbackItem[],
  options: {
    eventId?: string | null;
    rating?: number | null;
    cursor?: string | null;
  },
): TFeedbackItem[] {
  const { eventId, rating, cursor } = options;

  const afterEvent = eventId ? filterByEventId(allItems, eventId) : allItems;

  const afterRating = rating
    ? afterEvent.filter((item) => item.rating === rating)
    : afterEvent;

  const afterCursor = cursor
    ? afterRating.filter((item) => item.createdAt < cursor)
    : afterRating;

  return afterCursor;
}
