import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { EventsSelect } from '../../../events/components/EventsSelect';
import { RATING_FILTER_OPTIONS } from './FeedbackStreamFilters.constants';

export type TFeedbackStreamFiltersProps = {
  eventId: string;
  onEventIdChange: (eventId: string) => void;
  ratingFilterValue: string;
  onRatingFilterChange: (event: SelectChangeEvent) => void;
};

export const FeedbackStreamFilters = ({
  eventId,
  onEventIdChange,
  ratingFilterValue,
  onRatingFilterChange,
}: TFeedbackStreamFiltersProps) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    spacing={2}
    alignItems={{ sm: 'center' }}
    component="section"
    aria-label="Feedback filters"
  >
    <Box flex={1}>
      <EventsSelect
        label="Event"
        value={eventId}
        onChange={onEventIdChange}
        includeAllEvents
      />
    </Box>

    <FormControl sx={{ minWidth: 160 }}>
      <InputLabel id="rating-filter-label">Rating</InputLabel>
      <Select
        labelId="rating-filter-label"
        label="Rating"
        value={ratingFilterValue}
        onChange={onRatingFilterChange}
      >
        {RATING_FILTER_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Stack>
);
