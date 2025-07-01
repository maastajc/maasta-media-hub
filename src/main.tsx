
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { cacheManager } from './utils/cacheManager'

// Only initialize cache manager, don't force clear on every load
console.log('Initializing app with cache version:', cacheManager.getVersion());

// Add global error handler for chunk-related issues only
window.addEventListener('error', (event) => {
  if (event.message.includes('Loading chunk') || 
      event.message.includes('Loading CSS chunk') ||
      event.message.includes('ChunkLoadError')) {
    console.log('Chunk load error detected, clearing cache and reloading');
    cacheManager.bustCache();
    window.location.reload();
  }
});

// Handle unhandled promise rejections (chunk-related only)
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('Loading chunk') ||
      event.reason?.message?.includes('ChunkLoadError')) {
    console.log('Chunk load promise rejection, clearing cache and reloading');
    cacheManager.bustCache();
    window.location.reload();
  }
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
