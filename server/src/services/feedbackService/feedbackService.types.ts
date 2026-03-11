import { type TFeedbackItem } from '../../store';

export type TGetFeedbackParams = {
  eventId: string;
  rating?: number | null;
  cursor?: string | null;
  limit?: number | null;
};

export type TFeedbackPage = {
  items: TFeedbackItem[];
  nextCursor: string | null;
};

export type TCreateFeedbackInput = {
  eventId: string;
  content: string;
  rating: number;
  createdBy: string;
};
