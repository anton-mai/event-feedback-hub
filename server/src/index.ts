import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { resolvers } from './resolvers';

const typeDefs = fs.readFileSync(
  path.join(import.meta.dirname, 'schema', 'schema.graphql'),
  'utf-8',
);

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

const DEFAULT_PORT = 4000;
const PORT = Number(process.env.PORT ?? DEFAULT_PORT);

const app = express();

app.use(cors());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/graphql', express.json(), expressMiddleware(server));

app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${String(PORT)}/graphql`);
});
