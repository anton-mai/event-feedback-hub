import type { ErrorLike } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
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

type TGetFeedbackQueryResult = DocumentType<typeof feedbackDocumentNode>;

export type TUseFeedbackResult = {
  items: TGetFeedbackQueryResult['feedback']['items'];
  nextCursor: TGetFeedbackQueryResult['feedback']['nextCursor'];
  loading: boolean;
  error: ErrorLike | undefined;
  loadMore: () => Promise<void>;
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

  const { data, loading, error, fetchMore } = useQuery(feedbackDocumentNode, {
    variables: {
      eventId,
      rating: rating ?? undefined,
      cursor: undefined,
      limit,
    },
    skip: shouldSkipQuery,
    notifyOnNetworkStatusChange: true,
  });

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
  };
};
