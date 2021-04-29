import React from 'react';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/core';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import { AuthProvider } from './auth';
import { Theme } from '../constants/Theme';
import reducers from '../redux/reducers';


export const store = createStore(combineReducers({ app: reducers }));


const AppProvider: React.FC = ({ children }) => (
  <Provider store={store}>
    <AuthProvider>
      <ThemeProvider theme={Theme}>
        <SnackbarProvider>{children}</SnackbarProvider>
      </ThemeProvider>
    </AuthProvider>
    </Provider>
);

export default AppProvider;
