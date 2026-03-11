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
