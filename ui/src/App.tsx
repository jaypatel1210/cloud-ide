import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import Routes from './Routes';
import ThemeProvider from './ThemeProvider';
import AuthProvider from './context/AuthProvider';
import config from './config/config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: config.reactQueryStaleTime,
    },
  },
});

const App = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routes />
          </AuthProvider>
        </BrowserRouter>

        <ReactQueryDevtools />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
