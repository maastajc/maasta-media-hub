
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
}

export const cacheManager = CacheManager.getInstance();

// Enhanced cache headers for API requests
export const getApiHeaders = () => ({
  'X-Requested-With': 'XMLHttpRequest',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
});
