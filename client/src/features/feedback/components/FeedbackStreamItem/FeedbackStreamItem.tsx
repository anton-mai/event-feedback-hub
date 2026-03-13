import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { GetFeedbackQuery } from '../../../../generated/graphql';
import { Rating } from '../../../../shared/components/Rating';
import { styles } from './FeedbackStreamItem.styles';

type TFeedbackItem = GetFeedbackQuery['feedback']['items'][number];

export type TFeedbackStreamItemProps = {
  feedback: TFeedbackItem;
};

export const FeedbackStreamItem = ({
  feedback: { id, createdBy, event, rating, createdAt, content },
}: TFeedbackStreamItemProps) => (
  <Card variant="outlined" sx={styles.card}>
    <CardContent>
      <Stack spacing={0.75}>
        <Stack
          direction="row"
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1">{createdBy}</Typography>
          <Chip size="small" label={event.name} color="default" />
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Rating
            name={`feedback-rating-${id}`}
            value={rating}
            readOnly
            size="small"
          />
          <Typography variant="caption" color="text.secondary">
            {new Date(createdAt).toLocaleString()}
          </Typography>
        </Stack>

        <Typography variant="body2">{content}</Typography>
      </Stack>
    </CardContent>
  </Card>
);
