
// Global cache management system
class CacheManager {
  private static instance: CacheManager;
  private version: string;
  private cachePrefix = 'maasta_app_';

  private constructor() {
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
    const storedVersion = localStorage.getItem(`${this.cachePrefix}version`);
    const currentVersion = this.version;
    
    if (storedVersion !== currentVersion) {
      console.log('Cache version mismatch, clearing all caches');
      this.clearAllCaches();
      localStorage.setItem(`${this.cachePrefix}version`, currentVersion);
    }
  }

  clearAllCaches() {
    // Clear localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.cachePrefix)) {
        localStorage.removeItem(key);
      }
    });

    // Clear sessionStorage
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith(this.cachePrefix)) {
        sessionStorage.removeItem(key);
      }
    });

    // Clear browser cache programmatically
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }

    console.log('All caches cleared');
  }

  getCacheKey(key: string): string {
    return `${this.cachePrefix}${key}_${this.version}`;
  }

  invalidateCache(pattern?: string) {
    if (pattern) {
      Object.keys(localStorage).forEach(key => {
        if (key.includes(pattern)) {
          localStorage.removeItem(key);
        }
      });
    } else {
      this.clearAllCaches();
    }
  }

  getVersion(): string {
    return this.version;
  }

  updateVersion() {
    this.version = Date.now().toString();
    localStorage.setItem(`${this.cachePrefix}version`, this.version);
  }
}

export const cacheManager = CacheManager.getInstance();

// Add cache-busting headers to requests
export const getCacheBustingHeaders = () => ({
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  'X-Requested-With': 'XMLHttpRequest',
  'X-Cache-Version': cacheManager.getVersion(),
  'X-Timestamp': Date.now().toString()
});
