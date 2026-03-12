import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useEvents } from '../hooks/useEvents';

export type TEventsSelectProps = {
  label?: string;
  value: string;
  onChange: (eventId: string) => void;
};

export const EventsSelect = ({
  label = 'Event',
  value,
  onChange,
}: TEventsSelectProps) => {
  const { events, loading, error } = useEvents();

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
      <Typography color="error">
        Failed to load events. Please try again later.
      </Typography>
    );
  }

  if (!events || events.length === 0) {
    return <Typography>No events available.</Typography>;
  }

  return (
    <FormControl fullWidth>
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

