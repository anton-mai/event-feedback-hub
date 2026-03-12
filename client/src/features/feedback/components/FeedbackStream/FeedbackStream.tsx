import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { EventsSelect } from '../../../events/components/EventsSelect';
import { useFeedback } from '../../hooks/useFeedback';
import { DEFAULT_PAGE_SIZE } from './FeedbackStream.constants';
import { FeedbackStreamItem } from './FeedbackStreamItem';

type TRatingFilter = 'all' | 1 | 2 | 3 | 4 | 5;

export const FeedbackStream = () => {
  const [eventId, setEventId] = useState('');
  const [ratingFilter, setRatingFilter] = useState<TRatingFilter>('all');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const numericRatingFilter = ratingFilter === 'all' ? null : ratingFilter;

  const { items, nextCursor, loading, error, loadMore } = useFeedback({
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

  return (
    <Card component="section" aria-label="Feedback stream">
      <CardHeader title="Live feedback stream" />
      <CardContent>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box flex={1}>
              <EventsSelect
                label="Filter by event"
                value={eventId}
                onChange={setEventId}
              />
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

          {hasSelectedEvent && (error || loadMoreError) && (
            <Typography color="error">
              {error?.message ??
                loadMoreError ??
                'Failed to load feedback. Please try again.'}
            </Typography>
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
      </CardContent>
    </Card>
  );
};
