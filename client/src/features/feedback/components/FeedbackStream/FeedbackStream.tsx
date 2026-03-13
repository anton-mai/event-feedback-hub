import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import type { SelectChangeEvent } from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { ALL_EVENTS_VALUE } from '../../../events/components/EventsSelect';
import { useFeedback } from '../../hooks/useFeedback';
import { FeedbackStreamFilters } from '../FeedbackStreamFilters';
import { ALL_RATINGS_VALUE } from '../FeedbackStreamFilters/FeedbackStreamFilters.constants';
import { FeedbackStreamItem } from '../FeedbackStreamItem';
import { DEFAULT_PAGE_SIZE } from './FeedbackStream.constants';
import { getFeedbackStreamEmptyMessage } from './FeedbackStream.utils';

type TRatingFilter = typeof ALL_RATINGS_VALUE | 1 | 2 | 3 | 4 | 5;

export const FeedbackStream = () => {
  const [eventId, setEventId] = useState(ALL_EVENTS_VALUE);
  const [rating, setRating] = useState<TRatingFilter>(ALL_RATINGS_VALUE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [isErrorDismissed, setIsErrorDismissed] = useState(false);

  const numericRating = rating === ALL_RATINGS_VALUE ? null : rating;

  const { items, nextCursor, loading, error, loadMore, refetch } = useFeedback({
    eventId,
    rating: numericRating,
    limit: DEFAULT_PAGE_SIZE,
  });

  const prevEventIdRef = useRef(eventId);
  const prevRatingRef = useRef(rating);

  useEffect(() => {
    const filterChanged =
      prevEventIdRef.current !== eventId || prevRatingRef.current !== rating;

    prevEventIdRef.current = eventId;
    prevRatingRef.current = rating;

    if (filterChanged) {
      void refetch();
    }
  }, [eventId, rating, refetch]);

  const handleRatingFilterChange = (event: SelectChangeEvent) => {
    const value = event.target.value;

    if (value === ALL_RATINGS_VALUE) {
      setRating(ALL_RATINGS_VALUE);
      return;
    }

    const parsedValue = Number.parseInt(value, 10) as TRatingFilter;
    setRating(parsedValue);
  };

  const handleLoadMore = async () => {
    if (!nextCursor) {
      return;
    }

    setIsLoadingMore(true);
    setLoadMoreError(null);

    try {
      await loadMore();
    } catch {
      setLoadMoreError('Failed to load more feedback.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const isAllEvents = eventId === ALL_EVENTS_VALUE;
  const hasItems = items.length > 0;
  const hasError = Boolean(error || loadMoreError) && !isErrorDismissed;
  const errorMessage =
    error?.message ??
    loadMoreError ??
    'Failed to load feedback. Please try again.';

  const headerTitle = 'Live feedback stream';

  return (
    <Stack component="section" aria-label="Feedback stream" gap={1}>
      <Typography variant="h6" component="h2" gutterBottom>
        {headerTitle}
      </Typography>
      <Stack spacing={1.5}>
        <FeedbackStreamFilters
          eventId={eventId}
          onEventIdChange={setEventId}
          ratingFilterValue={String(rating)}
          onRatingFilterChange={handleRatingFilterChange}
        />

        {loading && !hasItems && (
          <Stack spacing={1.5}>
            {Array.from({ length: DEFAULT_PAGE_SIZE }, (_, i) => (
              <Skeleton
                key={`feedback-skeleton-${String(i)}`}
                variant="rounded"
                height={80}
              />
            ))}
          </Stack>
        )}

        <Snackbar
          open={hasError}
          autoHideDuration={4000}
          onClose={() => {
            setIsErrorDismissed(true);
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity="error"
            action={
              <>
                <Button
                  type="button"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    void refetch();
                  }}
                >
                  Retry
                </Button>
                <IconButton
                  size="small"
                  aria-label="Dismiss error"
                  color="inherit"
                  onClick={() => {
                    setIsErrorDismissed(true);
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </>
            }
            variant="filled"
            sx={{ width: '100%' }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>

        {!loading && !error && !hasItems && (
          <Typography color="text.secondary">
            {getFeedbackStreamEmptyMessage(isAllEvents, numericRating)}
          </Typography>
        )}

        {hasItems && (
          <Stack spacing={1.5}>
            {items.map((feedback) => (
              <FeedbackStreamItem key={feedback.id} feedback={feedback} />
            ))}
          </Stack>
        )}

        {nextCursor && (
          <Box display="flex" justifyContent="center" mt={1}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                void handleLoadMore();
              }}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? 'Loading more...' : 'Load more'}
            </Button>
          </Box>
        )}
      </Stack>
    </Stack>
  );
};
