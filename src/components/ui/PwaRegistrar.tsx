'use client';

import { useEffect } from 'react';

export const PwaRegistrar = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[APEXX PWA] ServiceWorker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.warn('[APEXX PWA] ServiceWorker registration failed:', error);
          });
      });
    }
  }, []);

  return null;
};

export default PwaRegistrar;
