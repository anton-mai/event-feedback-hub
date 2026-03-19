import { getFeedbackCreatedChannel, pubsub } from '../pubsub.js';
import {
  createFeedback,
  getEventById,
  getFeedback,
} from '../services/index.js';
import {
  TCreateFeedbackInput,
  TFeedbackItem,
  TGetFeedbackParams,
} from '../types/index.js';

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
  event: (parent: TFeedbackItem) => getEventById(parent.eventId),
};

export const feedbackResolvers = {
  Query: feedbackQueryResolvers,
  Mutation: feedbackMutationResolvers,
  Subscription: feedbackSubscriptionResolvers,
  Feedback: feedbackTypeResolvers,
};
