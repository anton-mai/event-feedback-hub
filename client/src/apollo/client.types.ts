import type { Reference } from '@apollo/client';

export type FeedbackPageCache = {
  __typename: 'FeedbackPage';
  items: Reference[];
  nextCursor?: string;
};
