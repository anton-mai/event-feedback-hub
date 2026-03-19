import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import { useServer } from 'graphql-ws/use/ws';
import { createServer } from 'http';
import path from 'path';
import { WebSocketServer } from 'ws';
import { resolvers } from './resolvers/index.js';

const typeDefs = fs.readFileSync(
  path.join(import.meta.dirname, 'schema', 'schema.graphql'),
  'utf-8',
);

const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer({ schema });
await apolloServer.start();

const DEFAULT_PORT = 4000;
const PORT = Number(process.env.PORT ?? DEFAULT_PORT);
const GRAPHQL_PATH = process.env.GRAPHQL_PATH ?? '/graphql';

const app = express();

app.use(cors());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(GRAPHQL_PATH, express.json(), expressMiddleware(apolloServer));

const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: GRAPHQL_PATH,
});

wsServer.on('error', (error: Error) => {
  console.error('[WebSocket] Server error:', error.message);
});

useServer({ schema }, wsServer);

httpServer.listen(PORT, () => {
  console.log(
    `Server ready at http://localhost:${String(PORT)}${GRAPHQL_PATH} (HTTP + WebSocket)`,
  );
});
