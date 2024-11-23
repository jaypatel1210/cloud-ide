import { FC, ReactNode } from 'react';
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

type ThemeProvider = {
  children: ReactNode;
};

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
});

const ThemeProvider: FC<ThemeProvider> = ({ children }) => {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};

export default ThemeProvider;
