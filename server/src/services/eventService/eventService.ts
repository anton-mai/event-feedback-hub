import { getEventItems, TEventItem } from '../../store';

export const getAllEvents = (): TEventItem[] => getEventItems();
