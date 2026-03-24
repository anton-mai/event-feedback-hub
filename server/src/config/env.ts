const DEFAULT_PORT = 4000;

export const PORT = Number(process.env.PORT ?? DEFAULT_PORT);
export const GRAPHQL_PATH = process.env.GRAPHQL_PATH ?? '/graphql';
