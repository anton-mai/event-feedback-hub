import type { SxProps, Theme } from '@mui/material/styles';

type TStyles = Record<string, SxProps<Theme>>;

export const styles = {
  card: (theme: Theme) => ({
    transition: theme.transitions.create(['box-shadow', 'transform'], {
      duration: theme.transitions.duration.shortest,
    }),

    '&:hover': {
      boxShadow: theme.shadows[1],
      transform: `translateY(-${theme.spacing(0.25)})`,
    },
  }),
} satisfies TStyles;
