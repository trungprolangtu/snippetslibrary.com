import { z } from 'zod';

// Enhanced validation schemas
export const enhancedValidationSchemas = {
  // User input validation
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .refine((val) => !val.includes('admin'), 'Username cannot contain reserved words'),

  email: z.string()
    .email('Invalid email format')
    .max(254, 'Email must be less than 254 characters')
    .refine((val) => !val.includes('<script'), 'Invalid email format'),

  // Snippet validation
  snippetTitle: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim()
    .refine((val) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val), 'Script tags are not allowed'),

  snippetCode: z.string()
    .min(1, 'Code is required')
    .max(100000, 'Code must be less than 100KB')
    .refine((val) => {
      // Check for potentially dangerous patterns
      const dangerousPatterns = [
        /eval\s*\(/gi,
        /Function\s*\(/gi,
        /setTimeout\s*\(/gi,
        /setInterval\s*\(/gi,
        /document\.write/gi,
        /innerHTML\s*=/gi,
        /outerHTML\s*=/gi,
      ];
      
      return !dangerousPatterns.some(pattern => pattern.test(val));
    }, 'Code contains potentially dangerous patterns'),

  snippetDescription: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .trim()
    .optional()
    .nullable()
    .refine((val) => {
      if (!val) return true;
      return !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val);
    }, 'Script tags are not allowed'),

  language: z.string()
    .min(1, 'Language is required')
    .max(50, 'Language must be less than 50 characters')
    .regex(/^[a-z0-9+#-]+$/, 'Invalid language format')
    .refine((val) => {
      // Whitelist of allowed languages
      const allowedLanguages = [
        'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'csharp',
        'go', 'rust', 'php', 'ruby', 'html', 'css', 'scss', 'json',
        'markdown', 'bash', 'sql', 'xml', 'text', 'yaml', 'dockerfile',
        'kotlin', 'swift', 'dart', 'vue', 'react', 'angular'
      ];
      return allowedLanguages.includes(val.toLowerCase());
    }, 'Language not supported'),

  tags: z.array(z.string()
    .max(50, 'Tag must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Tags can only contain letters, numbers, spaces, and hyphens')
  ).max(10, 'Maximum 10 tags allowed').optional(),

  // Security validation
  url: z.string()
    .url('Invalid URL format')
    .max(2048, 'URL must be less than 2048 characters')
    .refine((val) => {
      // Only allow HTTPS in production
      if (process.env.NODE_ENV === 'production') {
        return val.startsWith('https://');
      }
      return val.startsWith('http://') || val.startsWith('https://');
    }, 'Only HTTPS URLs are allowed in production'),

  // ID validation
  uuid: z.string()
    .uuid('Invalid UUID format'),

  // Pagination validation
  page: z.coerce.number()
    .min(1, 'Page must be at least 1')
    .max(1000, 'Page must be less than 1000')
    .default(1),

  limit: z.coerce.number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must be less than 100')
    .default(20),

  // Search validation
  searchQuery: z.string()
    .max(200, 'Search query must be less than 200 characters')
    .optional()
    .refine((val) => {
      if (!val) return true;
      // Prevent SQL injection patterns
      const sqlPatterns = [
        /union\s+select/gi,
        /drop\s+table/gi,
        /delete\s+from/gi,
        /insert\s+into/gi,
        /update\s+set/gi,
        /--/g,
        /;/g
      ];
      return !sqlPatterns.some(pattern => pattern.test(val));
    }, 'Invalid search query'),
};

// Sanitization utilities
export const sanitizeInput = {
  // Remove HTML tags but keep content
  stripHtml: (input: string): string => {
    return input.replace(/<[^>]*>/g, '');
  },

  // Escape HTML entities (server-side)
  escapeHtml: (input: string): string => {
    const htmlEntities: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };
    return input.replace(/[&<>"'`=\/]/g, (s) => htmlEntities[s] || s);
  },

  // Sanitize for SQL (basic - ORM should handle this)
  sanitizeSql: (input: string): string => {
    return input.replace(/['"\\;]/g, '');
  },

  // Sanitize filename
  sanitizeFilename: (input: string): string => {
    return input.replace(/[^a-zA-Z0-9.-]/g, '_');
  },

  // Sanitize for use in URLs
  sanitizeUrl: (input: string): string => {
    return encodeURIComponent(input);
  },
};

// Rate limiting configuration
export const rateLimits = {
  // API endpoints
  createSnippet: { max: 10, windowMs: 60 * 1000 }, // 10 per minute
  updateSnippet: { max: 20, windowMs: 60 * 1000 }, // 20 per minute
  shareSnippet: { max: 5, windowMs: 60 * 60 * 1000 }, // 5 per hour
  login: { max: 5, windowMs: 15 * 60 * 1000 }, // 5 per 15 minutes
  
  // General API
  general: { max: 100, windowMs: 60 * 1000 }, // 100 per minute
  
  // User actions
  profileUpdate: { max: 5, windowMs: 60 * 1000 }, // 5 per minute
  imageUpload: { max: 3, windowMs: 60 * 1000 }, // 3 per minute
};

// Security utilities
export const securityUtils = {
  // Generate secure random string
  generateSecureRandom: (length: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Validate password strength
  validatePasswordStrength: (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  },

  // Check for common passwords
  isCommonPassword: (password: string): boolean => {
    const commonPasswords = [
      'password', '123456', 'password123', 'admin', 'qwerty',
      'letmein', 'welcome', 'monkey', '1234567890', 'abc123'
    ];
    return commonPasswords.includes(password.toLowerCase());
  },
};
