import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [isErrorDismissed, setIsErrorDismissed] = useState(false);

  const { submit, loading, error } = useSubmitFeedback();

  const resetForm = () => {
    setEventId('');
    setDisplayName('');
    setFeedbackText('');
    setRating(null);
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsErrorDismissed(false);

    if (!eventId || !displayName || !feedbackText || !rating) {
      setSubmitError('Please fill in all fields and select a rating.');
      return;
    }

    try {
      await submit({
        eventId,
        createdBy: displayName,
        content: feedbackText,
        rating,
      });

      setSubmitSuccess(true);
      resetForm();
    } catch {
      setSubmitError('Something went wrong while submitting your feedback.');
    }
  };

  const isFormInvalid = !eventId || !displayName || !feedbackText || !rating;

  const remainingCharacters = MAX_FEEDBACK_LENGTH - feedbackText.length;

  const hasError = Boolean(error || submitError) && !isErrorDismissed;

  const errorMessage =
    error?.message ??
    submitError ??
    'Failed to submit feedback. Please try again.';

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

          <TextField
            required
            label="Your name"
            value={displayName}
            onChange={(event) => {
              setDisplayName(event.target.value);
            }}
            fullWidth
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

          {hasError && (
            <Alert
              severity="error"
              onClose={() => {
                setIsErrorDismissed(true);
              }}
            >
              {errorMessage}
            </Alert>
          )}

          {submitSuccess && (
            <Typography color="primary">
              Thank you! Your feedback has been submitted.
            </Typography>
          )}

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
    </Stack>
  );
};
