import { mergeResolvers } from '@graphql-tools/merge';
import { eventResolvers } from './eventResolvers.js';
import { feedbackResolvers } from './feedbackResolvers.js';

export const resolvers = mergeResolvers([eventResolvers, feedbackResolvers]);
