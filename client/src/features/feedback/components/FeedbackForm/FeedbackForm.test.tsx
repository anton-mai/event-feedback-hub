import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSubmitFeedback } from '../../hooks/useSubmitFeedback';
import { FeedbackForm } from './FeedbackForm';
import { MAX_FEEDBACK_LENGTH } from './FeedbackForm.constants';

vi.mock('../../hooks/useSubmitFeedback');

vi.mock('../../../events/components/EventsSelect', () => ({
  EventsSelect: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <select
      data-testid="events-select"
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    >
      <option value="">Select event</option>
      <option value="event-1">Event 1</option>
    </select>
  ),
}));

const mockSubmit = vi.fn();
const useSubmitFeedbackMock = vi.mocked(useSubmitFeedback);

function setupMocks(
  overrides: {
    loading?: boolean;
    error?: Error | undefined;
  } = {},
) {
  useSubmitFeedbackMock.mockReturnValue({
    submit: mockSubmit,
    loading: overrides.loading ?? false,
    error: overrides.error,
  });
}

describe('FeedbackForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  it('renders the form with all fields and submit button', () => {
    render(<FeedbackForm />);

    expect(
      screen.getByRole('heading', { name: /share your feedback/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('events-select')).toBeInTheDocument();
    expect(screen.getByText(/how did you like the event/i)).toBeInTheDocument();
    expect(screen.getAllByRole('radio').length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your feedback/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /submit feedback/i }),
    ).toBeInTheDocument();
  });

  it('shows character count for feedback field', () => {
    render(<FeedbackForm />);

    expect(
      screen.getByText(
        `${String(MAX_FEEDBACK_LENGTH)} of ${String(MAX_FEEDBACK_LENGTH)} characters remaining`,
      ),
    ).toBeInTheDocument();
  });

  it('disables submit button when form is incomplete', () => {
    render(<FeedbackForm />);

    expect(
      screen.getByRole('button', { name: /submit feedback/i }),
    ).toBeDisabled();
  });

  it('enables submit button when all required fields are filled', async () => {
    const user = userEvent.setup();
    render(<FeedbackForm />);

    await user.selectOptions(screen.getByTestId('events-select'), 'event-1');
    await user.type(screen.getByLabelText(/your name/i), 'Jane');
    await user.type(screen.getByLabelText(/your feedback/i), 'Great workshop!');
    const stars = screen.getAllByRole('radio');
    fireEvent.click(stars[4]);

    expect(
      screen.getByRole('button', { name: /submit feedback/i }),
    ).toBeEnabled();
  });

  it('shows validation error when submitting with empty required fields', async () => {
    render(<FeedbackForm />);

    const form = screen
      .getByRole('region', { name: /submit feedback form/i })
      .querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(
      await screen.findByText(/please fill in all fields and select a rating/i),
    ).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('calls submit with correct payload when form is valid', async () => {
    mockSubmit.mockResolvedValue(null);
    const user = userEvent.setup();
    render(<FeedbackForm />);

    await user.selectOptions(screen.getByTestId('events-select'), 'event-1');
    await user.type(screen.getByLabelText(/your name/i), 'Jane');
    await user.type(screen.getByLabelText(/your feedback/i), 'Great workshop!');
    const stars = screen.getAllByRole('radio');
    fireEvent.click(stars[4]); // 5 stars

    await user.click(screen.getByRole('button', { name: /submit feedback/i }));

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith({
      eventId: 'event-1',
      createdBy: 'Jane',
      content: 'Great workshop!',
      rating: 5,
    });
  });

  it('shows success message and resets form after successful submit', async () => {
    mockSubmit.mockResolvedValue(null);
    const user = userEvent.setup();
    render(<FeedbackForm />);

    await user.selectOptions(screen.getByTestId('events-select'), 'event-1');
    await user.type(screen.getByLabelText(/your name/i), 'Jane');
    await user.type(screen.getByLabelText(/your feedback/i), 'Great!');
    const stars = screen.getAllByRole('radio');
    fireEvent.click(stars[4]);
    await user.click(screen.getByRole('button', { name: /submit feedback/i }));

    expect(
      await screen.findByText(/thank you! your feedback has been submitted/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toHaveValue('');
    expect(screen.getByLabelText(/your feedback/i)).toHaveValue('');
  });

  it('shows error message when submit throws', async () => {
    mockSubmit.mockRejectedValue(new Error('Network error'));
    const user = userEvent.setup();
    render(<FeedbackForm />);

    await user.selectOptions(screen.getByTestId('events-select'), 'event-1');
    await user.type(screen.getByLabelText(/your name/i), 'Jane');
    await user.type(screen.getByLabelText(/your feedback/i), 'Great!');
    const stars = screen.getAllByRole('radio');
    fireEvent.click(stars[4]);
    await user.click(screen.getByRole('button', { name: /submit feedback/i }));

    expect(
      await screen.findByText(
        /something went wrong while submitting your feedback/i,
      ),
    ).toBeInTheDocument();
  });

  it('shows hook error in snackbar when useSubmitFeedback returns error', () => {
    setupMocks({ error: new Error('GraphQL error') });
    render(<FeedbackForm />);

    expect(screen.getByText('GraphQL error')).toBeInTheDocument();
  });

  it('does not allow feedback text to exceed max length', async () => {
    const user = userEvent.setup();
    render(<FeedbackForm />);

    const feedbackInput = screen.getByLabelText(/your feedback/i);
    const longText = 'a'.repeat(MAX_FEEDBACK_LENGTH + 100);
    await user.type(feedbackInput, longText);

    expect(feedbackInput).toHaveValue('a'.repeat(MAX_FEEDBACK_LENGTH));
    expect(
      screen.getByText(
        `0 of ${String(MAX_FEEDBACK_LENGTH)} characters remaining`,
      ),
    ).toBeInTheDocument();
  });

  it('shows loading state on submit button when hook is loading', () => {
    setupMocks({ loading: true });
    render(<FeedbackForm />);

    expect(
      screen.getByRole('button', { name: /submitting/i }),
    ).toBeInTheDocument();
  });
});
