import { mergeResolvers } from '@graphql-tools/merge';
import { eventResolvers } from './eventResolvers';
import { feedbackResolvers } from './feedbackResolvers';

export const resolvers = mergeResolvers([eventResolvers, feedbackResolvers]);
