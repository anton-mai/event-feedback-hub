import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styles } from './App.styles';
import { FeedbackForm, FeedbackStream } from './features';

function App() {
  return (
    <Box sx={styles.root}>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="h1">
            Event Feedback Hub
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={styles.main} maxWidth="xl">
        <Grid
          container
          spacing={{ xs: 2, md: 4, xl: 6 }}
          alignItems="flex-start"
        >
          <Grid size={{ xs: 12, md: 4 }}>
            <FeedbackForm />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <FeedbackStream />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;
