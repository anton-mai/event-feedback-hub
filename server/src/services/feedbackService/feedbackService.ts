import {
  addFeedbackItem,
  getEventItemById,
  getFeedbackItems,
} from '../../store';
import {
  TCreateFeedbackInput,
  TFeedbackItem,
  TFeedbackPage,
  TGetFeedbackParams,
} from '../../types';
import {
  DEFAULT_PAGE_SIZE,
  MAX_FEEDBACK_LENGTH,
  MAX_PAGE_SIZE,
  MAX_RATING,
  MIN_RATING,
} from './feedbackService.constants';

export const getFeedback = ({
  eventId,
  rating,
  cursor,
  limit,
}: TGetFeedbackParams): TFeedbackPage => {
  const event = getEventItemById(eventId);

  if (!event) {
    throw new Error(`Event with id "${eventId}" not found.`);
  }

  const feedbackItemsForEvent = getFeedbackItems()
    .filter((feedback) => feedback.eventId === eventId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const feedbackItemsFilteredByRating =
    typeof rating === 'number'
      ? feedbackItemsForEvent.filter((item) => item.rating === rating)
      : feedbackItemsForEvent;

  const feedbackItemsAfterCursor = cursor
    ? feedbackItemsFilteredByRating.filter((item) => item.createdAt < cursor)
    : feedbackItemsFilteredByRating;

  const pageSize =
    typeof limit === 'number'
      ? Math.min(limit, MAX_PAGE_SIZE)
      : DEFAULT_PAGE_SIZE;

  const hasNextPage =
    feedbackItemsAfterCursor.slice(0, pageSize + 1).length > pageSize;

  const items = feedbackItemsAfterCursor.slice(0, pageSize);

  const nextCursor = hasNextPage ? items[items.length - 1].createdAt : null;

  return {
    items,
    nextCursor,
  };
};

export const createFeedback = ({
  eventId,
  content,
  rating,
  createdBy,
}: TCreateFeedbackInput): TFeedbackItem => {
  const event = getEventItemById(eventId);

  if (!event) {
    throw new Error(`Event with id "${eventId}" not found.`);
  }

  const trimmedContent = content.trim();

  if (!trimmedContent) {
    throw new Error('Feedback content must not be empty.');
  }

  if (trimmedContent.length > MAX_FEEDBACK_LENGTH) {
    throw new Error(
      `Feedback content must be no more than ${String(
        MAX_FEEDBACK_LENGTH,
      )} characters long.`,
    );
  }

  if (!Number.isInteger(rating) || rating < MIN_RATING || rating > MAX_RATING) {
    throw new Error(
      `Rating must be an integer between ${String(
        MIN_RATING,
      )} and ${String(MAX_RATING)}.`,
    );
  }

  const author = createdBy.trim();

  if (!author) {
    throw new Error('Author name must not be empty.');
  }

  const feedbackItem: TFeedbackItem = {
    id: crypto.randomUUID(),
    eventId,
    content: trimmedContent,
    rating,
    createdBy: author,
    createdAt: new Date().toISOString(),
  };

  return addFeedbackItem(feedbackItem);
};
