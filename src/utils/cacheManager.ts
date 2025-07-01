
// Simplified and more stable cache management system
class CacheManager {
  private static instance: CacheManager;
  private version: string;
  private cachePrefix = 'maasta_app_';

  private constructor() {
    // Use a more stable version identifier that doesn't change on every load
    this.version = this.getAppVersion();
    this.initializeVersion();
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  private getAppVersion(): string {
    // Use a fixed version or date-based version that's more stable
    const storedVersion = localStorage.getItem(`${this.cachePrefix}app_version`);
    if (storedVersion) {
      return storedVersion;
    }
    
    // Only create new version if none exists
    const newVersion = Date.now().toString();
    localStorage.setItem(`${this.cachePrefix}app_version`, newVersion);
    return newVersion;
  }

  private initializeVersion() {
    const storedVersion = localStorage.getItem(`${this.cachePrefix}version`);
    
    // Only clear cache if there's a significant version difference (not on every load)
    if (storedVersion && Math.abs(parseInt(this.version) - parseInt(storedVersion)) > 86400000) { // 24 hours
      console.log('Significant version difference detected, clearing cache');
      this.clearAllCaches();
    }
    
    localStorage.setItem(`${this.cachePrefix}version`, this.version);
  }

  clearAllCaches() {
    // Clear only our app-specific cache, preserve auth tokens
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.cachePrefix) && !key.includes('supabase') && !key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });

    // Clear sessionStorage with our prefix, but preserve auth
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith(this.cachePrefix) && !key.includes('supabase') && !key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });

    // Clear browser cache if supported - but be more selective
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          // Only clear our specific app caches
          if (cacheName.includes('maasta') || cacheName.includes('workbox-precache')) {
            caches.delete(cacheName);
          }
        });
      });
    }

    console.log('App-specific caches cleared, auth tokens preserved');
  }

  // Clear cache for specific patterns only
  forceClearCache(pattern?: string) {
    if (pattern) {
      Object.keys(localStorage).forEach(key => {
        if (key.includes(pattern) && key.startsWith(this.cachePrefix) && !key.includes('supabase') && !key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      Object.keys(sessionStorage).forEach(key => {
        if (key.includes(pattern) && key.startsWith(this.cachePrefix) && !key.includes('supabase') && !key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
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

  // Less aggressive cache busting
  bustCache() {
    // Only clear specific caches, not everything
    this.forceClearCache('artists');
    this.forceClearCache('auditions');
  }

  // Much less aggressive timing for cache refresh
  shouldRefreshCache(): boolean {
    const lastClear = localStorage.getItem(`${this.cachePrefix}last_clear`);
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours instead of 6
    
    if (!lastClear || (now - parseInt(lastClear)) > twentyFourHours) {
      localStorage.setItem(`${this.cachePrefix}last_clear`, now.toString());
      return true;
    }
    
    return false;
  }

  // Add session validation
  isSessionValid(): boolean {
    try {
      const authData = localStorage.getItem('sb-jadphaypzbsxofowrjvy-auth-token');
      if (!authData) return false;
      
      const parsed = JSON.parse(authData);
      const expiresAt = parsed?.expires_at;
      
      if (!expiresAt) return false;
      
      return Date.now() < (expiresAt * 1000);
    } catch (error) {
      console.warn('Session validation failed:', error);
      return false;
    }
  }
}

export const cacheManager = CacheManager.getInstance();

// Simplified cache headers for API requests
export const getApiHeaders = () => ({
  'X-Requested-With': 'XMLHttpRequest',
  'Cache-Control': 'no-cache',
});

