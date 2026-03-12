import { getFeedbackCreatedChannel, pubsub } from '../pubsub';
import { createFeedback, getFeedback } from '../services';
import { getEventItemById } from '../store';
import {
  TCreateFeedbackInput,
  TFeedbackItem,
  TGetFeedbackParams,
} from '../types';
import { createNotFoundError } from '../utils/errors';

const feedbackQueryResolvers = {
  feedback: (_: unknown, args: TGetFeedbackParams) => getFeedback(args),
};

const feedbackMutationResolvers = {
  createFeedback: (_: unknown, { input }: { input: TCreateFeedbackInput }) =>
    createFeedback(input),
};

const feedbackSubscriptionResolvers = {
  feedbackCreated: {
    subscribe: (_: unknown, { eventId }: { eventId: string }) =>
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
