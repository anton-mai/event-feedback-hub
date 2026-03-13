import { getFeedbackCreatedChannel, pubsub } from '../../pubsub.js';
import { getEventItemById } from '../../store/eventStore.js';
import {
  addFeedbackItem,
  getFeedbackItems,
} from '../../store/feedbackStore.js';
import {
  TCreateFeedbackInput,
  TFeedbackItem,
  TFeedbackPage,
  TGetFeedbackParams,
} from '../../types/index.js';
import {
  createNotFoundError,
  createValidationError,
} from '../../utils/errors.js';
import {
  DEFAULT_PAGE_SIZE,
  MAX_FEEDBACK_LENGTH,
  MAX_PAGE_SIZE,
  MAX_RATING,
  MIN_RATING,
} from './feedbackService.constants.js';
import { getFilteredFeedbackItems } from './feedbackService.utils.js';

export const getFeedback = ({
  eventId,
  rating,
  cursor,
  limit,
}: TGetFeedbackParams): TFeedbackPage => {
  const allFeedbackItems = getFeedbackItems().sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  const feedbackItemsAfterFilters = getFilteredFeedbackItems(
    allFeedbackItems,
    { eventId, rating, cursor },
  );

  const pageSize =
    typeof limit === 'number'
      ? Math.min(limit, MAX_PAGE_SIZE)
      : DEFAULT_PAGE_SIZE;

  const hasNextPage =
    feedbackItemsAfterFilters.slice(0, pageSize + 1).length > pageSize;

  const items = feedbackItemsAfterFilters.slice(0, pageSize);

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
    throw createNotFoundError(`Event with id "${eventId}" not found.`);
  }

  const trimmedContent = content.trim();

  if (!trimmedContent) {
    throw createValidationError('Feedback content must not be empty.');
  }

  if (trimmedContent.length > MAX_FEEDBACK_LENGTH) {
    throw createValidationError(
      `Feedback content must be no more than ${String(
        MAX_FEEDBACK_LENGTH,
      )} characters long.`,
    );
  }

  if (!Number.isInteger(rating) || rating < MIN_RATING || rating > MAX_RATING) {
    throw createValidationError(
      `Rating must be an integer between ${String(
        MIN_RATING,
      )} and ${String(MAX_RATING)}.`,
    );
  }

  const author = createdBy.trim();

  if (!author) {
    throw createValidationError('Author name must not be empty.');
  }

  const feedbackItem: TFeedbackItem = {
    id: crypto.randomUUID(),
    eventId,
    content: trimmedContent,
    rating,
    createdBy: author,
    createdAt: new Date().toISOString(),
  };

  const created = addFeedbackItem(feedbackItem);

  void pubsub.publish(getFeedbackCreatedChannel(eventId), {
    feedbackCreated: created,
  });

  void pubsub.publish(getFeedbackCreatedChannel(null), {
    feedbackCreated: created,
  });

  return created;
};
