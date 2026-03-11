import { getEventItems } from '../../store';
import { TEventItem } from '../../types';

export const getAllEvents = (): TEventItem[] => getEventItems();
