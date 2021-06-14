import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';
import { NotificationsProvider } from './components/MainPage/NotificationsContext';
import { NotificationsPopupProvider } from './components/MainPage/NotificationsPopupContext';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <NotificationsProvider>
        <NotificationsPopupProvider>
          <App />
        </NotificationsPopupProvider>
      </NotificationsProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
