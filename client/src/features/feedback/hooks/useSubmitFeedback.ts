import type { ErrorLike } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { graphql } from '../../../generated/gql';
import type {
  CreateFeedbackInput,
  CreateFeedbackMutation,
  CreateFeedbackMutationVariables,
} from '../../../generated/graphql';

const createFeedbackDocumentNode = graphql(`
  mutation CreateFeedback($input: CreateFeedbackInput!) {
    createFeedback(input: $input) {
      id
      content
      rating
      createdBy
      createdAt
      event {
        id
        name
      }
    }
  }
`);

export type TUseSubmitFeedbackResult = {
  submit: (
    input: CreateFeedbackInput,
  ) => Promise<CreateFeedbackMutation | null>;
  loading: boolean;
  error: ErrorLike | undefined;
  reset: () => void;
};

export const useSubmitFeedback = (): TUseSubmitFeedbackResult => {
  const [mutate, { loading, error, reset }] = useMutation<
    CreateFeedbackMutation,
    CreateFeedbackMutationVariables
  >(createFeedbackDocumentNode);

  const submit = async (input: CreateFeedbackInput) => {
    const result = await mutate({
      variables: { input },
    });

    return result.data ?? null;
  };

  return {
    submit,
    loading,
    error,
    reset,
  };
};
