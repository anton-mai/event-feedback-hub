import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();

const FEEDBACK_CREATED_PREFIX = 'FEEDBACK_CREATED_';

export const getFeedbackCreatedChannel = (
  eventId: string | null | undefined,
): string =>
  eventId
    ? `${FEEDBACK_CREATED_PREFIX}${eventId}`
    : `${FEEDBACK_CREATED_PREFIX}ALL`;
