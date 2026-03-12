import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { FeedbackForm, FeedbackStream } from './features';

function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="h1">
            Event Feedback Hub
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ py: 3 }}>
        <Stack spacing={4}>
          <FeedbackForm />
          <FeedbackStream />
        </Stack>
      </Container>
    </>
  );
}

export default App;
