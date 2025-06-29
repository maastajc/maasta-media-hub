
// Simplified cache management system
class CacheManager {
  private static instance: CacheManager;
  private version: string;
  private cachePrefix = 'maasta_app_';

  private constructor() {
    // Use app version instead of timestamp for better stability
    this.version = '1.0.0';
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
    
    // Only clear cache if version actually changed, not on every load
    if (storedVersion && storedVersion !== this.version) {
      console.log('App version changed, clearing caches');
      this.clearAllCaches();
      localStorage.setItem(`${this.cachePrefix}version`, this.version);
    } else if (!storedVersion) {
      localStorage.setItem(`${this.cachePrefix}version`, this.version);
    }
  }

  clearAllCaches() {
    // Clear localStorage with our prefix only
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.cachePrefix)) {
        localStorage.removeItem(key);
      }
    });

    // Clear sessionStorage with our prefix only
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith(this.cachePrefix)) {
        sessionStorage.removeItem(key);
      }
    });

    console.log('App caches cleared');
  }

  getCacheKey(key: string): string {
    return `${this.cachePrefix}${key}`;
  }

  invalidateCache(pattern?: string) {
    if (pattern) {
      Object.keys(localStorage).forEach(key => {
        if (key.includes(pattern) && key.startsWith(this.cachePrefix)) {
          localStorage.removeItem(key);
        }
      });
    }
  }

  getVersion(): string {
    return this.version;
  }
}

export const cacheManager = CacheManager.getInstance();

// Simplified cache headers for API requests only
export const getApiHeaders = () => ({
  'X-Requested-With': 'XMLHttpRequest',
  'Cache-Control': 'no-cache'
});
