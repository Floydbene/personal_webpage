import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import { Leva } from 'leva';
import { registerSW } from 'virtual:pwa-register';

import './index.css';
import { ToastContainer } from 'react-toastify';

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Leva />
    <ToastContainer position='top-center' autoClose={2000} />
    <App />
  </React.StrictMode>
);
