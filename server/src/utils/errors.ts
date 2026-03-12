import { GraphQLError } from 'graphql';

/**
 * Error code for validation failures (e.g. invalid input).
 */
export const ERROR_CODE_BAD_USER_INPUT = 'BAD_USER_INPUT';

/**
 * Error code when a requested resource does not exist.
 */
export const ERROR_CODE_NOT_FOUND = 'NOT_FOUND';

/**
 * Creates a GraphQL error for validation/input failures.
 */
export function createValidationError(message: string): GraphQLError {
  return new GraphQLError(message, {
    extensions: { code: ERROR_CODE_BAD_USER_INPUT },
  });
}

/**
 * Creates a GraphQL error when a resource is not found.
 */
export function createNotFoundError(message: string): GraphQLError {
  return new GraphQLError(message, {
    extensions: { code: ERROR_CODE_NOT_FOUND },
  });
}
