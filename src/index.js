import React from 'react';
import { HashRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';
import { NotificationsProvider } from './components/MainPage/NotificationsContext';
import { NotificationsPopupProvider } from './components/MainPage/NotificationsPopupContext';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <NotificationsProvider>
        <NotificationsPopupProvider>
          <App />
        </NotificationsPopupProvider>
      </NotificationsProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
