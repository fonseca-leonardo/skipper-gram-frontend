import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline, Container } from '@material-ui/core';

import Notifier from './hooks/Notifier';
import AppProvider from './hooks/AppProvider';

import Routes from './routes';

function App() {
  return (
    <AppProvider>
      <Notifier />
      <CssBaseline />
        <Container>
          <Router>
            <Routes />
          </Router>
        </Container>
    </AppProvider>
  );
}

export default App;
