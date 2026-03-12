import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();

const FEEDBACK_CREATED_PREFIX = 'FEEDBACK_CREATED_';

export const getFeedbackCreatedChannel = (eventId: string): string =>
  `${FEEDBACK_CREATED_PREFIX}${eventId}`;
