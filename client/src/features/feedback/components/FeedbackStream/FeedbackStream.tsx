import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { EventsSelect } from '../../../events/components/EventsSelect';
import { useFeedback } from '../../hooks/useFeedback';
import { FeedbackStreamItem } from '../FeedbackStreamItem';
import { DEFAULT_PAGE_SIZE } from './FeedbackStream.constants';

type TRatingFilter = 'all' | 1 | 2 | 3 | 4 | 5;

export const FeedbackStream = () => {
  const [eventId, setEventId] = useState('');
  const [ratingFilter, setRatingFilter] = useState<TRatingFilter>('all');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [isErrorDismissed, setIsErrorDismissed] = useState(false);

  const numericRatingFilter = ratingFilter === 'all' ? null : ratingFilter;

  const { items, nextCursor, loading, error, loadMore, refetch } = useFeedback({
    eventId,
    rating: numericRatingFilter,
    limit: DEFAULT_PAGE_SIZE,
  });

  const handleRatingFilterChange = (event: SelectChangeEvent) => {
    const value = event.target.value;

    if (value === 'all') {
      setRatingFilter('all');
      return;
    }

    const parsedValue = Number.parseInt(value, 10) as TRatingFilter;
    setRatingFilter(parsedValue);
  };

  useEffect(() => {
    setIsErrorDismissed(false);
  }, [eventId, ratingFilter]);

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

  const hasSelectedEvent = Boolean(eventId);
  const hasItems = items.length > 0;
  const hasError = Boolean(error || loadMoreError) && !isErrorDismissed;
  const errorMessage =
    error?.message ??
    loadMoreError ??
    'Failed to load feedback. Please try again.';

  const headerTitle = hasSelectedEvent
    ? `Live feedback stream (${String(items.length)})`
    : 'Live feedback stream';

  return (
    <Stack component="section" aria-label="Feedback stream" gap={1}>
      <Typography variant="h6" component="h2" gutterBottom>
        {headerTitle}
      </Typography>
      <Stack spacing={1.5}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ sm: 'center' }}
          component="section"
          aria-label="Feedback filters"
        >
          <Box flex={1}>
            <EventsSelect label="Event" value={eventId} onChange={setEventId} />
          </Box>

          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel id="rating-filter-label">Rating</InputLabel>
            <Select
              labelId="rating-filter-label"
              label="Rating"
              value={String(ratingFilter)}
              onChange={handleRatingFilterChange}
            >
              <MenuItem value="all">All ratings</MenuItem>
              <MenuItem value="5">5 stars</MenuItem>
              <MenuItem value="4">4 stars</MenuItem>
              <MenuItem value="3">3 stars</MenuItem>
              <MenuItem value="2">2 stars</MenuItem>
              <MenuItem value="1">1 star</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {!hasSelectedEvent && (
          <Typography color="text.secondary">
            Select an event to see what others are saying in real time.
          </Typography>
        )}

        {hasSelectedEvent && loading && !hasItems && (
          <Stack spacing={1}>
            {Array.from({ length: DEFAULT_PAGE_SIZE }, (_, i) => (
              <Skeleton
                key={`feedback-skeleton-${String(i)}`}
                variant="rounded"
                height={80}
              />
            ))}
          </Stack>
        )}

        {hasSelectedEvent && hasError && (
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
          >
            {errorMessage}
          </Alert>
        )}

        {hasSelectedEvent && !loading && !error && !hasItems && (
          <Typography color="text.secondary">
            No feedback yet for this event
            {numericRatingFilter
              ? ` with a rating of ${String(numericRatingFilter)}`
              : ''}{' '}
            — be the first to share your thoughts!
          </Typography>
        )}

        {hasSelectedEvent && hasItems && (
          <Stack spacing={2}>
            {items.map((feedback) => (
              <FeedbackStreamItem key={feedback.id} feedback={feedback} />
            ))}
          </Stack>
        )}

        {hasSelectedEvent && nextCursor && (
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
