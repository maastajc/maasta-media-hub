
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { cacheManager } from './utils/cacheManager'

// Initialize cache manager without aggressive clearing
console.log('Initializing app with cache version:', cacheManager.getVersion());

// Only handle critical chunk-related errors
window.addEventListener('error', (event) => {
  if (event.message.includes('Loading chunk') || 
      event.message.includes('Loading CSS chunk') ||
      event.message.includes('ChunkLoadError')) {
    console.log('Chunk load error detected, clearing cache and reloading');
    cacheManager.bustCache();
    // Add a small delay to prevent rapid reload loops
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
});

// Handle unhandled promise rejections (chunk-related only)
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('Loading chunk') ||
      event.reason?.message?.includes('ChunkLoadError')) {
    console.log('Chunk load promise rejection, clearing cache and reloading');
    cacheManager.bustCache();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

