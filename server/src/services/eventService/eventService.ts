import { getEventItemById, getEventItems } from '../../store/eventStore.js';
import { TEventItem } from '../../types/index.js';
import { createNotFoundError } from '../../utils/errors.js';

export const getAllEvents = (): TEventItem[] => getEventItems();

export const getEventById = (id: string): TEventItem => {
  const event = getEventItemById(id);

  if (!event) {
    throw createNotFoundError(`Event with id "${id}" not found.`);
  }

  return event;
};
