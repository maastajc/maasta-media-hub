
// Refined cache management system - less aggressive approach
class CacheManager {
  private static instance: CacheManager;
  private version: string;
  private cachePrefix = 'maasta_app_';

  private constructor() {
    // Use a more stable version identifier
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
    // Try to get version from package.json or use date-based fallback
    return localStorage.getItem(`${this.cachePrefix}app_version`) || Date.now().toString();
  }

  private initializeVersion() {
    const storedVersion = localStorage.getItem(`${this.cachePrefix}version`);
    
    // Only clear cache if there's a version mismatch (actual app update)
    if (storedVersion && storedVersion !== this.version) {
      console.log('App version mismatch detected, clearing cache');
      this.clearAllCaches();
    }
    
    localStorage.setItem(`${this.cachePrefix}version`, this.version);
  }

  clearAllCaches() {
    // Clear only our app-specific cache, preserve auth tokens
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.cachePrefix) && !key.includes('supabase')) {
        localStorage.removeItem(key);
      }
    });

    // Clear sessionStorage with our prefix, but preserve auth
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith(this.cachePrefix) && !key.includes('supabase')) {
        sessionStorage.removeItem(key);
      }
    });

    // Clear browser cache if supported
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          // Only clear our app caches, not system caches
          if (cacheName.includes('maasta') || cacheName.includes('workbox')) {
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
        if (key.includes(pattern) && key.startsWith(this.cachePrefix) && !key.includes('supabase')) {
          localStorage.removeItem(key);
        }
      });
      
      Object.keys(sessionStorage).forEach(key => {
        if (key.includes(pattern) && key.startsWith(this.cachePrefix) && !key.includes('supabase')) {
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

  // Only bust cache when there's a real version change
  bustCache() {
    // Don't generate new version automatically, only on actual updates
    this.clearAllCaches();
  }

  // Check if cache should be refreshed (less aggressive timing)
  shouldRefreshCache(): boolean {
    const lastClear = localStorage.getItem(`${this.cachePrefix}last_clear`);
    const now = Date.now();
    const sixHours = 6 * 60 * 60 * 1000; // Increased from 1 hour to 6 hours
    
    if (!lastClear || (now - parseInt(lastClear)) > sixHours) {
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

// Simplified cache headers for API requests (less aggressive)
export const getApiHeaders = () => ({
  'X-Requested-With': 'XMLHttpRequest',
  'Cache-Control': 'no-cache', // Simplified cache control
});

// Remove the global fetch interceptor - let React Query handle caching
// The original aggressive fetch override is removed
