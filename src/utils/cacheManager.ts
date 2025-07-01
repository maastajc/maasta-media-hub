
// Enhanced cache management system with aggressive cache clearing
class CacheManager {
  private static instance: CacheManager;
  private version: string;
  private cachePrefix = 'maasta_app_';

  private constructor() {
    // Use timestamp for aggressive cache busting
    this.version = Date.now().toString();
    this.initializeVersion();
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  private initializeVersion() {
    // Always clear cache on app initialization
    console.log('Initializing cache manager - clearing all caches');
    this.clearAllCaches();
    localStorage.setItem(`${this.cachePrefix}version`, this.version);
    
    // Force refresh on version mismatch
    this.checkVersionMismatch();
  }

  private checkVersionMismatch() {
    const storedVersion = localStorage.getItem(`${this.cachePrefix}version`);
    if (storedVersion && storedVersion !== this.version) {
      console.log('Version mismatch detected, forcing cache clear');
      this.bustCache();
      window.location.reload();
    }
  }

  clearAllCaches() {
    // Clear localStorage with our prefix
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.cachePrefix)) {
        localStorage.removeItem(key);
      }
    });

    // Clear sessionStorage with our prefix
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith(this.cachePrefix)) {
        sessionStorage.removeItem(key);
      }
    });

    // Clear browser cache if supported
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }

    // Clear service worker cache if exists
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
        });
      });
    }

    console.log('All app caches cleared');
  }

  // Force clear cache for specific patterns
  forceClearCache(pattern?: string) {
    if (pattern) {
      Object.keys(localStorage).forEach(key => {
        if (key.includes(pattern) || key.startsWith(this.cachePrefix)) {
          localStorage.removeItem(key);
        }
      });
      
      Object.keys(sessionStorage).forEach(key => {
        if (key.includes(pattern) || key.startsWith(this.cachePrefix)) {
          sessionStorage.removeItem(key);
        }
      });
    } else {
      this.clearAllCaches();
    }
  }

  getCacheKey(key: string): string {
    return `${this.cachePrefix}${key}_${this.version}`;
  }

  invalidateCache(pattern?: string) {
    this.forceClearCache(pattern);
  }

  getVersion(): string {
    return this.version;
  }

  // Generate new version to bust cache
  bustCache() {
    this.version = Date.now().toString();
    localStorage.setItem(`${this.cachePrefix}version`, this.version);
    this.clearAllCaches();
  }

  // Add method to check if cache should be refreshed
  shouldRefreshCache(): boolean {
    const lastClear = localStorage.getItem(`${this.cachePrefix}last_clear`);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    if (!lastClear || (now - parseInt(lastClear)) > oneHour) {
      localStorage.setItem(`${this.cachePrefix}last_clear`, now.toString());
      return true;
    }
    
    return false;
  }
}

export const cacheManager = CacheManager.getInstance();

// Enhanced cache headers for API requests
export const getApiHeaders = () => ({
  'X-Requested-With': 'XMLHttpRequest',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  'X-Cache-Bust': Date.now().toString()
});

// Add global cache buster for all fetch requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const url = args[0] as string;
  if (typeof url === 'string' && !url.includes('?')) {
    args[0] = `${url}?_cb=${Date.now()}`;
  } else if (typeof url === 'string') {
    args[0] = `${url}&_cb=${Date.now()}`;
  }
  return originalFetch.apply(this, args);
};
