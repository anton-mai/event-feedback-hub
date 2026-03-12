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
import type { FeedbackPage } from '../generated/graphql';

const HTTP_URI = 'http://localhost:4000/graphql';
const WS_URL = 'ws://localhost:4000/graphql';

const httpLink = new HttpLink({ uri: HTTP_URI });

const wsLink = new GraphQLWsLink(
  createClient({
    url: WS_URL,
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
          merge(
            existing: FeedbackPage | undefined,
            incoming: FeedbackPage,
            { args },
          ): FeedbackPage {
            if (!existing || !args?.cursor) {
              return incoming;
            }

            return {
              ...incoming,
              items: [...existing.items, ...incoming.items],
            };
          },
        },
      },
    },
  },
});

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache,
});
