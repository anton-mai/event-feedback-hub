import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql';
import { createClient } from 'graphql-ws';
import { getEnvString } from '../utils';
import { setWsStatus } from '../ws';
import { mergeFeedbackPage } from './client.utils';

const HTTP_URL = getEnvString(
  import.meta.env.VITE_GRAPHQL_HTTP_URL,
  'http://localhost:4000/graphql',
);

const WS_URL = getEnvString(
  import.meta.env.VITE_GRAPHQL_WS_URL,
  'ws://localhost:4000/graphql',
);

const httpLink = new HttpLink({ uri: HTTP_URL });

const wsLink = new GraphQLWsLink(
  createClient({
    url: WS_URL,
    on: {
      connecting: (isRetry) => {
        setWsStatus(isRetry ? 'reconnecting' : 'connecting');
      },
      connected: () => {
        setWsStatus('connected');
      },
      closed: () => {
        setWsStatus('disconnected');
      },
      error: () => {
        setWsStatus('disconnected');
      },
    },
  }),
);

const splitLink = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === Kind.OPERATION_DEFINITION &&
      definition.operation === OperationTypeNode.SUBSCRIPTION
    );
  },
  wsLink,
  httpLink,
);

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        feedback: {
          keyArgs: ['eventId', 'rating'],
          merge: mergeFeedbackPage,
        },
      },
    },
  },
});

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache,
});
