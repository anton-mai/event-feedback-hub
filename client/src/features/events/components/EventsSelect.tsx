import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEvents } from '../hooks/useEvents';

export type TEventsSelectProps = {
  label?: string;
  value: string;
  onChange: (eventId: string) => void;
  required?: boolean;
};

export const EventsSelect = ({
  label = 'Event',
  value,
  onChange,
  required = false,
}: TEventsSelectProps) => {
  const { events, loading, error, refetch } = useEvents();

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rounded" height={56} />
      </Box>
    );
  }

  if (error) {
    return (
      <Stack spacing={1} direction="row" alignItems="center">
        <Typography color="error">{error.message}</Typography>
        <Box>
          <Button
            type="button"
            variant="outlined"
            size="small"
            onClick={() => void refetch()}
          >
            Retry
          </Button>
        </Box>
      </Stack>
    );
  }

  if (!events || events.length === 0) {
    return <Typography>No events available.</Typography>;
  }

  return (
    <FormControl required={required} fullWidth>
      <InputLabel id="events-select-label">{label}</InputLabel>
      <Select
        labelId="events-select-label"
        value={value}
        label={label}
        onChange={handleChange}
      >
        {events.map((event) => (
          <MenuItem key={event.id} value={event.id}>
            {event.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
