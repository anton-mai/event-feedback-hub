import type { SxProps, Theme } from '@mui/material/styles';

type TStyles = Record<string, SxProps<Theme>>;

export const styles = {
  root: {
    bgcolor: 'grey.50',
    minHeight: '100vh',
  },

  main: {
    py: { xs: 2, md: 4 },
    px: { xs: 2, sm: 3 },
  },
} satisfies TStyles;
