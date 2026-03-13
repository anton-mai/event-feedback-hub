import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MuiRating from '@mui/material/Rating';
import type { ComponentProps } from 'react';
import { MAX_RATING } from './Rating.constants';
import { ratingStyles } from './Rating.styles';

export type TRatingProps = {
  /** Current rating value (1 to max) */
  value: number | null;
  /** Called when user changes the rating (omit for read-only) */
  onChange?: (value: number | null) => void;
  /** When true, rating is not editable */
  readOnly?: boolean;
  /** Unique name for the input (required for forms) */
  name?: string;
  /** Size of the icons */
  size?: ComponentProps<typeof MuiRating>['size'];
  /** Maximum rating value */
  max?: number;
};

export const Rating = ({
  value,
  onChange,
  readOnly = false,
  name,
  size = 'medium',
  max = MAX_RATING,
}: TRatingProps) => (
  <MuiRating
    name={name}
    value={value}
    onChange={
      onChange
        ? (_event, newValue) => {
            onChange(newValue ?? null);
          }
        : undefined
    }
    max={max}
    icon={<FavoriteIcon fontSize="inherit" />}
    emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
    sx={ratingStyles}
    readOnly={readOnly}
    size={size}
  />
);
