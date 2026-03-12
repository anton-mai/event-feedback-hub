import { ApolloProvider } from '@apollo/client/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { apolloClient } from './apollo/client';
import { theme } from './theme';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </ApolloProvider>
    </StrictMode>,
  );
} else {
  throw new Error('Root element not found');
}
