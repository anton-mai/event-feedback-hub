import type { GraphQLSchema } from 'graphql';
import { useServer } from 'graphql-ws/use/ws';
import type { Server } from 'http';
import { WebSocketServer } from 'ws';

type TCreateWsServerArgs = {
  httpServer: Server;
  graphqlPath: string;
  schema: GraphQLSchema;
};

export const createWsServer = ({
  httpServer,
  graphqlPath,
  schema,
}: TCreateWsServerArgs) => {
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: graphqlPath,
  });

  wsServer.on('error', (error: Error) => {
    console.error('[WebSocket] Server error:', error.message);
  });

  const serverCleanup = useServer({ schema }, wsServer);

  return { wsServer, serverCleanup };
};
