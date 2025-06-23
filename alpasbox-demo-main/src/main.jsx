import React from 'react';
import { createRoot } from 'react-dom/client'; // Use react-dom/client for createRoot
import { Provider } from 'react-redux';
import './index.css';
import App from './App.jsx';
import { store } from './rtk/store';

// Ensure the root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Render the application
createRoot(rootElement).render(
  <Provider store={store}>
    <App />
  </Provider>
);