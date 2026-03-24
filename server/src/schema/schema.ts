import { makeExecutableSchema } from '@graphql-tools/schema';
import { readFileSync } from 'node:fs';
import { resolvers } from '../resolvers/index.js';

const typeDefs = readFileSync(
  new URL('./schema.graphql', import.meta.url),
  'utf-8',
);

export const schema = makeExecutableSchema({ typeDefs, resolvers });
