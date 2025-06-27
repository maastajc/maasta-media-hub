
/**
 * Security utilities for input validation and sanitization
 */

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (input: string): string => {
  // Basic HTML sanitization - removes script tags and dangerous attributes
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<iframe/gi, '&lt;iframe')
    .replace(/<object/gi, '&lt;object')
    .replace(/<embed/gi, '&lt;embed');
};

/**
 * Validates and sanitizes URL inputs
 */
export const sanitizeUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return null;
    }
    
    return urlObj.toString();
  } catch {
    return null;
  }
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
};

/**
 * Sanitizes text input by removing potentially dangerous characters
 */
export const sanitizeText = (input: string, maxLength: number = 1000): string => {
  return input
    .trim()
    .substring(0, maxLength)
    .replace(/[<>]/g, ''); // Remove angle brackets
};

/**
 * Validates file upload based on type and size
 */
export const validateFileUpload = (
  file: File, 
  allowedTypes: string[], 
  maxSizeMB: number
): { isValid: boolean; error?: string } => {
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { isValid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type' };
  }
  
  // Check for empty files
  if (file.size === 0) {
    return { isValid: false, error: 'File is empty' };
  }
  
  // Check filename for dangerous extensions
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (dangerousExtensions.includes(fileExtension)) {
    return { isValid: false, error: 'File type not allowed for security reasons' };
  }
  
  return { isValid: true };
};

/**
 * Rate limiting helper (client-side basic implementation)
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  canProceed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);
    
    return true;
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

/**
 * Generic error message sanitizer
 */
export const sanitizeErrorMessage = (error: any): string => {
  // Return generic error messages to prevent information disclosure
  if (typeof error === 'string') {
    // Check for database-specific errors
    if (error.includes('duplicate key') || error.includes('constraint')) {
      return 'This information already exists in our system.';
    }
    
    if (error.includes('not found') || error.includes('NOT_FOUND')) {
      return 'The requested resource was not found.';
    }
    
    if (error.includes('permission') || error.includes('unauthorized')) {
      return 'You do not have permission to perform this action.';
    }
    
    if (error.includes('timeout') || error.includes('network')) {
      return 'Connection timeout. Please check your internet connection and try again.';
    }
  }
  
  // Default generic error message
  return 'An unexpected error occurred. Please try again later.';
};
