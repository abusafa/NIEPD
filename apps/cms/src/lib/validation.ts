export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export function validateField(value: unknown, rule: ValidationRule): string | null {
  // Required validation
  if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return 'This field is required';
  }

  // Skip other validations if field is empty and not required
  if (!value && !rule.required) {
    return null;
  }

  const stringValue = String(value);

  // Length validations
  if (rule.minLength && stringValue.length < rule.minLength) {
    return `Must be at least ${rule.minLength} characters`;
  }

  if (rule.maxLength && stringValue.length > rule.maxLength) {
    return `Must be no more than ${rule.maxLength} characters`;
  }

  // Pattern validation
  if (rule.pattern && !rule.pattern.test(stringValue)) {
    return 'Invalid format';
  }

  // Custom validation
  if (rule.custom) {
    return rule.custom(value);
  }

  return null;
}

export function validateObject(data: Record<string, unknown>, schema: ValidationSchema): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const [fieldName, rule] of Object.entries(schema)) {
    const error = validateField(data[fieldName], rule);
    if (error) {
      errors[fieldName] = error;
    }
  }

  return errors;
}

export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

// Common validation rules
export const commonRules = {
  required: { required: true },
  email: { 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address';
      }
      return null;
    }
  },
  url: {
    pattern: /^https?:\/\/.+$/,
    custom: (value: string) => {
      if (value && !/^https?:\/\/.+$/.test(value)) {
        return 'Please enter a valid URL (starting with http:// or https://)';
      }
      return null;
    }
  },
  slug: {
    pattern: /^[a-z0-9-]+$/,
    custom: (value: string) => {
      if (value && !/^[a-z0-9-]+$/.test(value)) {
        return 'Slug can only contain lowercase letters, numbers, and hyphens';
      }
      return null;
    }
  },
  phone: {
    pattern: /^\+?[\d\s\-\(\)]+$/,
    custom: (value: string) => {
      if (value && !/^\+?[\d\s\-\(\)]+$/.test(value)) {
        return 'Please enter a valid phone number';
      }
      return null;
    }
  },
  positiveNumber: {
    custom: (value: unknown) => {
      const num = Number(value);
      if (isNaN(num) || num < 0) {
        return 'Please enter a positive number';
      }
      return null;
    }
  },
};

// Helper to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Bilingual validation schema
export function createBilingualSchema(baseRules: ValidationSchema): ValidationSchema {
  const schema: ValidationSchema = {};
  
  for (const [field, rule] of Object.entries(baseRules)) {
    schema[`${field}Ar`] = rule;
    schema[`${field}En`] = rule;
  }
  
  return schema;
}
