import { createFeedback, getFeedback } from '../services';
import { getEventItemById } from '../store';
import {
  TCreateFeedbackInput,
  TFeedbackItem,
  TGetFeedbackParams,
} from '../types';

const feedbackQueryResolvers = {
  feedback: (_: unknown, args: TGetFeedbackParams) => getFeedback(args),
};

const feedbackMutationResolvers = {
  createFeedback: (_: unknown, args: { input: TCreateFeedbackInput }) =>
    createFeedback(args.input),
};

const feedbackTypeResolvers = {
  event: (parent: TFeedbackItem) => {
    const event = getEventItemById(parent.eventId);

    if (!event) {
      throw new Error(`Event with id "${parent.eventId}" not found.`);
    }

    return event;
  },
};

export const feedbackResolvers = {
  Query: feedbackQueryResolvers,
  Mutation: feedbackMutationResolvers,
  Feedback: feedbackTypeResolvers,
};
