import type { ErrorLike } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { graphql } from '../../../generated/gql';
import type {
  GetEventsQuery,
  GetEventsQueryVariables,
} from '../../../generated/graphql';

const eventsDocumentNode = graphql(`
  query GetEvents {
    events {
      id
      name
    }
  }
`);

export type TUseEventsResult = {
  events: GetEventsQuery['events'] | undefined;
  loading: boolean;
  error: ErrorLike | undefined;
  refetch: () => Promise<unknown>;
};

export const useEvents = (): TUseEventsResult => {
  const { data, loading, error, refetch } = useQuery<
    GetEventsQuery,
    GetEventsQueryVariables
  >(eventsDocumentNode);

  return {
    events: data?.events,
    loading,
    error,
    refetch,
  };
};
