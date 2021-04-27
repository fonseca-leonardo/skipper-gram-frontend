import React from 'react';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/core';

import { AuthProvider } from './auth';
import { Theme } from '../constants/Theme';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ThemeProvider theme={Theme}>
      <SnackbarProvider>{children}</SnackbarProvider>
    </ThemeProvider>
  </AuthProvider>
);

export default AppProvider;
