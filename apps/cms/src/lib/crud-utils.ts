/**
 * Reusable utility functions for CRUD operations across admin pages
 */

// Common validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  phone: /^[+]?[0-9\s\-()]+$/,
};

// Common form field types
export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'number' | 'email' | 'url' | 'tel' | 'bilingual';
  required?: boolean;
  placeholder?: {
    en?: string;
    ar?: string;
  };
  options?: Array<{ value: string; label: string; }>;
  validation?: (value: unknown) => string | null;
}

// Common status options for content
export const contentStatuses = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'REVIEW', label: 'Under Review' },
  { value: 'PUBLISHED', label: 'Published' },
];

// Common validation functions
export const validators = {
  required: (value: unknown, fieldName: string) => 
    !value || (typeof value === 'string' && !value.trim()) 
      ? `${fieldName} is required` 
      : null,

  email: (value: string) => 
    value && !validationPatterns.email.test(value) 
      ? 'Please enter a valid email address' 
      : null,

  url: (value: string) => 
    value && !validationPatterns.url.test(value) 
      ? 'Please enter a valid URL (starting with http:// or https://)' 
      : null,

  minNumber: (min: number) => (value: number) => 
    value < min ? `Value must be at least ${min}` : null,

  maxLength: (max: number) => (value: string) => 
    value && value.length > max 
      ? `Must be ${max} characters or less` 
      : null,
};

// Helper to validate entire form based on field definitions
export const validateForm = (
  formData: Record<string, unknown>, 
  fields: FormField[]
): Record<string, string> => {
  const errors: Record<string, string> = {};

  fields.forEach(field => {
    const value = formData[field.key];

    // Required field validation
    if (field.required) {
      const requiredError = validators.required(value, field.label);
      if (requiredError) {
        errors[field.key] = requiredError;
        return;
      }
    }

    // Skip other validations if field is empty and not required
    if (!value) return;

    // Type-specific validations
    if (field.type === 'email') {
      const emailError = validators.email(value);
      if (emailError) errors[field.key] = emailError;
    }

    if (field.type === 'url') {
      const urlError = validators.url(value);
      if (urlError) errors[field.key] = urlError;
    }

    if (field.type === 'number') {
      const minError = validators.minNumber(0)(value);
      if (minError) errors[field.key] = minError;
    }

    // Custom validation
    if (field.validation) {
      const customError = field.validation(value);
      if (customError) errors[field.key] = customError;
    }

    // Bilingual field validation
    if (field.type === 'bilingual') {
      if (field.required) {
        const enError = validators.required(value.en, `${field.label} (English)`);
        const arError = validators.required(value.ar, `${field.label} (Arabic)`);
        
        if (enError) errors[`${field.key}En`] = enError;
        if (arError) errors[`${field.key}Ar`] = arError;
      }
    }
  });

  return errors;
};

// Helper to make API calls with proper auth headers
export const apiCall = async (
  url: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: unknown
) => {
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  };

  if (method !== 'GET' && data) {
    headers['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (method !== 'GET' && data) {
    config.body = JSON.stringify(data);
  }

  return fetch(url, config);
};

// Common CRUD operation handlers
export const crudHandlers = {
  create: async <T>(endpoint: string, data: Partial<T>, resourceName: string) => {
    const response = await apiCall(endpoint, 'POST', data);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to create ${resourceName}`);
    }

    return response.json();
  },

  update: async <T>(endpoint: string, id: string, data: Partial<T>, resourceName: string) => {
    const response = await apiCall(`${endpoint}/${id}`, 'PUT', data);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to update ${resourceName}`);
    }

    return response.json();
  },

  fetch: async <T>(endpoint: string, id: string, resourceName: string): Promise<T> => {
    const response = await apiCall(`${endpoint}/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to load ${resourceName}`);
    }

    return response.json();
  },

  delete: async (endpoint: string, id: string, resourceName: string) => {
    const response = await apiCall(`${endpoint}/${id}`, 'DELETE');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to delete ${resourceName}`);
    }

    return true;
  },
};

// Helper to generate form sections with consistent styling
export const createFormSection = (title: string, color: string) => ({
  title,
  colorClasses: {
    'blue': 'bg-blue-500',
    'green': 'bg-green-500', 
    'purple': 'bg-purple-500',
    'orange': 'bg-orange-500',
    'red': 'bg-red-500',
    'gray': 'bg-gray-500',
  }[color] || 'bg-blue-500',
});

// Standard form sections used across admin pages
export const formSections = {
  content: createFormSection('Content', 'blue'),
  settings: createFormSection('Settings', 'purple'),
  contact: createFormSection('Contact Information', 'green'),
  metadata: createFormSection('Information', 'gray'),
};
