import { getAllEvents } from '../services';

export const eventResolvers = {
  Query: {
    events: () => getAllEvents(),
  },
};
