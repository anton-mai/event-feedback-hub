import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import type { GraphQLSchema } from 'graphql';
import type { Server } from 'http';

type TCreateApolloServerArgs = {
  schema: GraphQLSchema;
  httpServer: Server;
  onDrain: () => Promise<void>;
};

export const createApolloServer = ({
  schema,
  httpServer,
  onDrain,
}: TCreateApolloServerArgs) =>
  new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        serverWillStart() {
          return Promise.resolve({
            async drainServer() {
              await onDrain();
            },
          });
        },
      },
    ],
  });
