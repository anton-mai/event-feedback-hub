import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Rating } from '../../../../shared/components/Rating';
import { EventsSelect } from '../../../events/components/EventsSelect';
import { useSubmitFeedback } from '../../hooks/useSubmitFeedback';
import { MAX_FEEDBACK_LENGTH } from './FeedbackForm.constants';

export const FeedbackForm = () => {
  const [eventId, setEventId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState<boolean>(false);

  const { submit, loading, error, reset } = useSubmitFeedback();

  const resetForm = () => {
    setEventId('');
    setDisplayName('');
    setFeedbackText('');
    setRating(null);
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitSuccessful(false);

    if (!eventId || !displayName || !feedbackText || !rating) {
      return;
    }

    try {
      await submit({
        eventId,
        createdBy: displayName,
        content: feedbackText,
        rating,
      });

      setIsSubmitSuccessful(true);
      resetForm();
    } catch {
      // No-op: The UI reacts to the 'error' object from the mutation hook
    }
  };

  const isFormInvalid = !eventId || !displayName || !feedbackText || !rating;

  const remainingCharacters = MAX_FEEDBACK_LENGTH - feedbackText.length;
  return (
    <Stack component="section" aria-label="Submit feedback form" gap={1}>
      <Typography variant="h6" component="h2" gutterBottom>
        Share your feedback
      </Typography>

      <Box component="form" onSubmit={(event) => void handleSubmit(event)}>
        <Stack spacing={1.5}>
          <EventsSelect
            label="Event"
            value={eventId}
            onChange={setEventId}
            required
          />

          <Stack direction="row" alignItems="center" gap={1}>
            <Typography component="span" variant="body2">
              How did you like the event? *
            </Typography>
            <Rating
              name="feedback-rating"
              value={rating}
              onChange={setRating}
            />
          </Stack>

          <TextField
            required
            label="Your name"
            value={displayName}
            onChange={(event) => {
              setDisplayName(event.target.value);
            }}
            fullWidth
          />

          <TextField
            required
            label="Your feedback"
            value={feedbackText}
            onChange={(event) => {
              const { value } = event.target;

              if (value.length <= MAX_FEEDBACK_LENGTH) {
                setFeedbackText(value);
              }
            }}
            fullWidth
            multiline
            minRows={2}
            slotProps={{
              htmlInput: { maxLength: MAX_FEEDBACK_LENGTH },
            }}
            helperText={`${String(remainingCharacters)} of ${String(MAX_FEEDBACK_LENGTH)} characters remaining`}
          />

          <Box display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isFormInvalid}
              loading={loading}
            >
              {loading ? 'Submitting...' : 'Submit feedback'}
            </Button>
          </Box>
        </Stack>
      </Box>

      <Snackbar
        open={Boolean(error?.message)}
        autoHideDuration={4000}
        onClose={reset}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transitionDuration={0}
      >
        <Alert
          severity="error"
          onClose={reset}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error?.message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={isSubmitSuccessful}
        autoHideDuration={4000}
        onClose={() => {
          setIsSubmitSuccessful(false);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transitionDuration={0}
      >
        <Alert
          severity="success"
          onClose={() => {
            setIsSubmitSuccessful(false);
          }}
          variant="filled"
          sx={{ width: '100%' }}
        >
          Thank you! Your feedback has been submitted.
        </Alert>
      </Snackbar>
    </Stack>
  );
};
