import type { ValidationRule } from 'shared';

// Common validation rules
export const ValidationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    test: (value: string) => value.trim().length > 0,
    message,
  }),
  
  minLength: (min: number, message?: string): ValidationRule => ({
    test: (value: string) => value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),
  
  maxLength: (max: number, message?: string): ValidationRule => ({
    test: (value: string) => value.length <= max,
    message: message || `Must be no more than ${max} characters`,
  }),
  
  noScript: (message = 'Script tags are not allowed'): ValidationRule => ({
    test: (value: string) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value),
    message,
  }),
  
  safeChars: (message = 'Contains invalid characters'): ValidationRule => ({
    test: (value: string) => !/[<>'"&]/.test(value),
    message,
  }),
  
  languageFormat: (message = 'Invalid language format'): ValidationRule => ({
    test: (value: string) => /^[a-z0-9+#-]+$/.test(value),
    message,
  }),
};
