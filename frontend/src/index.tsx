import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App.js';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
      <StrictMode>
        <App />
      </StrictMode>
  </Provider>,
);
