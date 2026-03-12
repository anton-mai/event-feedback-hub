import { getAllEvents } from '../services/index.js';

export const eventResolvers = {
  Query: {
    events: () => getAllEvents(),
  },
};
