import type { ErrorLike } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type { DocumentType } from '../../../generated/gql';
import { graphql } from '../../../generated/gql';

const eventsDocumentNode = graphql(`
  query GetEvents {
    events {
      id
      name
    }
  }
`);

type TGetEventsQueryResult = DocumentType<typeof eventsDocumentNode>;

export type TUseEventsResult = {
  events: TGetEventsQueryResult['events'] | undefined;
  loading: boolean;
  error: ErrorLike | undefined; 
};

export const useEvents = (): TUseEventsResult => {
  const { data, loading, error } = useQuery(eventsDocumentNode);

  return {
    events: data?.events,
    loading,
    error,
  };
};
