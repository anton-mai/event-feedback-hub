export const ALL_RATINGS_VALUE = 'ALL';

export const RATING_FILTER_OPTIONS = [
  { value: ALL_RATINGS_VALUE, label: 'All ratings' },
  { value: '5', label: '5 stars' },
  { value: '4', label: '4 stars' },
  { value: '3', label: '3 stars' },
  { value: '2', label: '2 stars' },
  { value: '1', label: '1 star' },
] as const;
