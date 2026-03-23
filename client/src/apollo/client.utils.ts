import type { FieldMergeFunction } from '@apollo/client';
import type { FeedbackPageCache } from './client.types';

export const mergeFeedbackPage: FieldMergeFunction<FeedbackPageCache> = (
  existing,
  incoming,
  { args, readField },
) => {
  if (!existing || !args?.cursor) {
    return incoming;
  }

  const existingIds = new Set(
    existing.items.map((item) => readField('id', item)),
  );

  const incomingItems = incoming.items.filter(
    (item) => !existingIds.has(readField('id', item)),
  );

  return {
    ...existing,
    ...incoming,
    items: [...existing.items, ...incomingItems],
  };
};
