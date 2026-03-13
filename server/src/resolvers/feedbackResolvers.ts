import { getFeedbackCreatedChannel, pubsub } from '../pubsub.js';
import { createFeedback, getFeedback } from '../services/index.js';
import { getEventItemById } from '../store/eventStore.js';
import {
  TCreateFeedbackInput,
  TFeedbackItem,
  TGetFeedbackParams,
} from '../types/index.js';
import { createNotFoundError } from '../utils/errors.js';

const feedbackQueryResolvers = {
  feedback: (_: unknown, args: TGetFeedbackParams) => getFeedback(args),
};

const feedbackMutationResolvers = {
  createFeedback: (_: unknown, { input }: { input: TCreateFeedbackInput }) =>
    createFeedback(input),
};

const feedbackSubscriptionResolvers = {
  feedbackCreated: {
    subscribe: (_: unknown, { eventId }: { eventId?: string | null }) =>
      pubsub.asyncIterableIterator<{ feedbackCreated: TFeedbackItem }>([
        getFeedbackCreatedChannel(eventId),
      ]),
  },
};

const feedbackTypeResolvers = {
  event: (parent: TFeedbackItem) => {
    const event = getEventItemById(parent.eventId);

    if (!event) {
      throw createNotFoundError(`Event with id "${parent.eventId}" not found.`);
    }

    return event;
  },
};

export const feedbackResolvers = {
  Query: feedbackQueryResolvers,
  Mutation: feedbackMutationResolvers,
  Subscription: feedbackSubscriptionResolvers,
  Feedback: feedbackTypeResolvers,
};
