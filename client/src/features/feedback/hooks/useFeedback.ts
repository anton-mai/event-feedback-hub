import type { ErrorLike } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useEffect } from 'react';
import type { DocumentType } from '../../../generated/gql';
import { graphql } from '../../../generated/gql';

const feedbackDocumentNode = graphql(`
  query GetFeedback($eventId: ID!, $rating: Int, $cursor: String, $limit: Int) {
    feedback(
      eventId: $eventId
      rating: $rating
      cursor: $cursor
      limit: $limit
    ) {
      items {
        id
        content
        rating
        createdBy
        createdAt
        event {
          id
          name
        }
      }
      nextCursor
    }
  }
`);

const feedbackCreatedDocumentNode = graphql(`
  subscription FeedbackCreated($eventId: ID!) {
    feedbackCreated(eventId: $eventId) {
      id
      content
      rating
      createdBy
      createdAt
      event {
        id
        name
      }
    }
  }
`);

type TGetFeedbackQueryResult = DocumentType<typeof feedbackDocumentNode>;

export type TUseFeedbackResult = {
  items: TGetFeedbackQueryResult['feedback']['items'];
  nextCursor: TGetFeedbackQueryResult['feedback']['nextCursor'];
  loading: boolean;
  error: ErrorLike | undefined;
  loadMore: () => Promise<void>;
  refetch: () => Promise<unknown>;
};

type TUseFeedbackArgs = {
  eventId: string;
  rating?: number | null;
  limit?: number;
};

export const useFeedback = ({
  eventId,
  rating,
  limit = 10,
}: TUseFeedbackArgs): TUseFeedbackResult => {
  const shouldSkipQuery = !eventId;

  const { data, loading, error, fetchMore, refetch, subscribeToMore } =
    useQuery(feedbackDocumentNode, {
      variables: {
        eventId,
        rating: rating ?? undefined,
        cursor: undefined,
        limit,
      },
      skip: shouldSkipQuery,
      notifyOnNetworkStatusChange: true,
    });

  useEffect(() => {
    if (shouldSkipQuery || !data?.feedback) {
      return;
    }

    const unsubscribe = subscribeToMore({
      document: feedbackCreatedDocumentNode,
      variables: { eventId },
      updateQuery: (
        _unsafePrev,
        { subscriptionData, previousData, complete },
      ) => {
        const newFeedback = subscriptionData.data.feedbackCreated;

        if (!complete) {
          return;
        }

        if (rating && newFeedback.rating !== rating) {
          return previousData;
        }

        const existingItems = previousData.feedback.items;

        const alreadyExists = existingItems.some(
          (item) => item.id === newFeedback.id,
        );

        if (alreadyExists) {
          return previousData;
        }

        return {
          ...previousData,
          feedback: {
            ...previousData.feedback,
            items: [newFeedback, ...existingItems],
          },
        };
      },
    });

    return () => {
      unsubscribe();
    };
  }, [eventId, rating, shouldSkipQuery, data?.feedback, subscribeToMore]);

  const loadMore = async () => {
    if (!data?.feedback.nextCursor || shouldSkipQuery) {
      return;
    }

    await fetchMore({
      variables: {
        eventId,
        rating: rating ?? undefined,
        cursor: data.feedback.nextCursor,
        limit,
      },
    });
  };

  return {
    items: data?.feedback.items ?? [],
    nextCursor: data?.feedback.nextCursor ?? null,
    loading,
    error,
    loadMore,
    refetch,
  };
};
