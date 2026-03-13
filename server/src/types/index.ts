export type TEventItem = {
  id: string;
  name: string;
};

export type TFeedbackItem = {
  id: string;
  eventId: string;
  content: string;
  rating: number;
  createdBy: string;
  createdAt: string;
};

export type TGetFeedbackParams = {
  eventId?: string | null;
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
