import type { ErrorLike } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type { CreateFeedbackInput } from '../../../generated/graphql';
import type { DocumentType } from '../../../generated/gql';
import { graphql } from '../../../generated/gql';

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

type TCreateFeedbackMutationResult = DocumentType<typeof createFeedbackDocumentNode>;

export type TUseSubmitFeedbackResult = {
  submit: (input: CreateFeedbackInput) => Promise<TCreateFeedbackMutationResult | null>;
  loading: boolean;
  error: ErrorLike | undefined;
};

export const useSubmitFeedback = (): TUseSubmitFeedbackResult => {
  const [mutate, { loading, error }] = useMutation(createFeedbackDocumentNode);

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
  };
};

