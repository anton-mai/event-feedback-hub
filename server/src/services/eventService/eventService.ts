import { getEventItems } from '../../store/eventStore.js';
import { TEventItem } from '../../types/index.js';

export const getAllEvents = (): TEventItem[] => getEventItems();
