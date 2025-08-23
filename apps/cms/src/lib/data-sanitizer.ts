/**
 * Data sanitization utilities to prevent Prisma schema conflicts
 * 
 * This utility helps filter out invalid fields that don't match the Prisma schema
 * and provides field mapping for common UI-to-DB field name differences.
 */

// Common field mappings between frontend and database schemas
const FIELD_MAPPINGS = {
  // News model mappings
  news: {
    // Remove authorAr/authorEn as they don't exist in schema (uses authorId relation)
    authorAr: null,
    authorEn: null,
  },
  
  // Program model mappings  
  programs: {
    // Map prerequisitesAr/En to single prerequisites field
    prerequisitesAr: 'prerequisites',
    prerequisitesEn: 'prerequisites',
  },
  
  // Event model mappings (events API already handles fields correctly)
  events: {},
  
  // Add more models as needed
} as const;

/**
 * Sanitizes request data by removing invalid fields and mapping field names
 * @param data - Raw request data
 * @param modelName - Prisma model name (e.g., 'news', 'programs', 'events')
 * @returns Sanitized data object
 */
export function sanitizeData(data: Record<string, any>, modelName: keyof typeof FIELD_MAPPINGS) {
  const mappings = FIELD_MAPPINGS[modelName] || {};
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    const mapping = mappings[key as keyof typeof mappings];
    
    if (mapping === null) {
      // Field should be removed (e.g., authorAr, authorEn)
      continue;
    } else if (mapping && typeof mapping === 'string') {
      // Field should be mapped to different name
      if (!sanitized[mapping]) {
        sanitized[mapping] = value;
      }
    } else {
      // Field passes through unchanged
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Extracts and sanitizes common fields from request body
 * @param body - Request body
 * @param modelName - Prisma model name
 * @returns Object with sanitized data and extracted special fields
 */
export function extractAndSanitize(body: any, modelName: keyof typeof FIELD_MAPPINGS) {
  const { tagIds, categoryId, ...restData } = body;
  const sanitizedData = sanitizeData(restData, modelName);
  
  return {
    data: sanitizedData,
    tagIds: tagIds || [],
    categoryId: categoryId && categoryId !== '' ? categoryId : null,
  };
}

/**
 * Common field validation patterns
 */
export const VALIDATION_PATTERNS = {
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  url: /^https?:\/\/.+/,
} as const;

/**
 * Sanitizes DateTime fields by converting empty strings to null
 * @param data - Data object
 * @param dateTimeFields - Array of field names that should be DateTime or null
 * @returns Sanitized data object
 */
export function sanitizeDateTimeFields(data: Record<string, any>, dateTimeFields: string[]): Record<string, any> {
  const sanitized = { ...data };
  
  for (const field of dateTimeFields) {
    if (sanitized[field] === '' || (typeof sanitized[field] === 'string' && sanitized[field].trim() === '')) {
      sanitized[field] = null;
    } else if (sanitized[field] && typeof sanitized[field] === 'string') {
      try {
        // Validate that it's a valid date string
        const date = new Date(sanitized[field]);
        if (isNaN(date.getTime())) {
          sanitized[field] = null;
        }
      } catch {
        sanitized[field] = null;
      }
    }
  }
  
  return sanitized;
}

/**
 * Validates field values against common patterns
 * @param data - Data object to validate
 * @param validations - Object mapping field names to validation patterns
 * @returns Validation errors or empty array if all valid
 */
export function validateFields(
  data: Record<string, any>, 
  validations: Partial<Record<string, RegExp>>
): string[] {
  const errors: string[] = [];
  
  for (const [field, pattern] of Object.entries(validations)) {
    const value = data[field];
    if (value && typeof value === 'string' && !pattern.test(value)) {
      errors.push(`Invalid ${field} format`);
    }
  }
  
  return errors;
}
