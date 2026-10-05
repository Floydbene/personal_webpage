import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

import './index.css';

const clearLocalPwaState = async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }

  if ('caches' in window) {
    const cacheNames = await window.caches.keys();
    await Promise.all(
      cacheNames
        .filter((cacheName) => /workbox|precache|pwa/i.test(cacheName))
        .map((cacheName) => window.caches.delete(cacheName))
    );
  }
};

if (import.meta.env.DEV) {
  clearLocalPwaState().catch(() => {});
} else {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      updateSW(true);
    },
    onRegisteredSW(_swScriptUrl, registration) {
      registration?.update();
    },
  });
}

console.log(
  '%cfloyd ~ $%c explore the CV: press ` and type help',
  'font: 600 13px ui-monospace, monospace; color: #e8a33d;',
  'font: 13px ui-monospace, monospace; color: #9a8d7d;'
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
