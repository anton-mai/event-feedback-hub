import { expressMiddleware } from '@as-integrations/express4';
import express from 'express';
import { createServer } from 'http';
import { createExpressApp } from './express/createExpressApp.js';
import { GRAPHQL_PATH, PORT } from './config/env.js';
import { createApolloServer } from './apollo/createApolloServer.js';
import { schema } from './schema/schema.js';
import { createWsServer } from './ws/createWsServer.js';

const app = createExpressApp();
const httpServer = createServer(app);

const { serverCleanup } = createWsServer({
  httpServer,
  graphqlPath: GRAPHQL_PATH,
  schema,
});

const apolloServer = createApolloServer({
  schema,
  httpServer,
  onDrain: async () => {
    await serverCleanup.dispose();
  },
});

await apolloServer.start();

app.use(GRAPHQL_PATH, express.json(), expressMiddleware(apolloServer));

httpServer.listen(PORT, () => {
  console.log(
    `Server ready at http://localhost:${String(PORT)}${GRAPHQL_PATH} (HTTP + WebSocket)`,
  );
});
