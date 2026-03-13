export function getFeedbackStreamEmptyMessage(
  isAllEvents: boolean,
  ratingFilter: number | null,
): string {
  const base = 'No feedback yet';
  const eventSuffix = isAllEvents ? '' : ' for this event';
  const ratingSuffix = ratingFilter
    ? ` with a rating of ${String(ratingFilter)}`
    : '';
  return `${base}${eventSuffix}${ratingSuffix} — be the first to share your thoughts!`;
}
