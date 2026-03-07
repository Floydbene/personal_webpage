import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Leva } from 'leva';
import { registerSW } from 'virtual:pwa-register';

import './index.css';

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Leva />
    <App />
  </React.StrictMode>
);
