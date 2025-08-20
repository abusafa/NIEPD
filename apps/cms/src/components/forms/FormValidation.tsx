'use client';

import { useLanguage } from '@/contexts/LanguageContext';

// Form validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean;
  message?: string;
  messageAr?: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface FormField {
  name: string;
  rules?: ValidationRule[];
}

// Validation hook
export function useFormValidation(fields: FormField[]) {
  const { currentLang, t } = useLanguage();

  const validateField = (fieldName: string, value: unknown, rules: ValidationRule[] = []): string => {
    for (const rule of rules) {
      // Required validation
      if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        return rule.message || rule.messageAr || (currentLang === 'ar' ? 'هذا الحقل مطلوب' : t('form.required'));
      }

      // Skip other validations if value is empty and not required
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        continue;
      }

      // Min length validation
      if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
        const message = rule.message || rule.messageAr || 
          (currentLang === 'ar' ? `الحد الأدنى ${rule.minLength} أحرف` : t('form.minLength', { min: rule.minLength.toString() }));
        return message;
      }

      // Max length validation
      if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
        const message = rule.message || rule.messageAr || 
          (currentLang === 'ar' ? `الحد الأقصى ${rule.maxLength} حرف` : t('form.maxLength', { max: rule.maxLength.toString() }));
        return message;
      }

      // Pattern validation
      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        return rule.message || rule.messageAr || 
          (currentLang === 'ar' ? 'تنسيق غير صحيح' : 'Invalid format');
      }

      // Custom validation
      if (rule.custom && !rule.custom(value)) {
        return rule.message || rule.messageAr || 
          (currentLang === 'ar' ? 'قيمة غير صحيحة' : 'Invalid value');
      }
    }

    return '';
  };

  const validateForm = (formData: Record<string, unknown>): ValidationErrors => {
    const errors: ValidationErrors = {};

    fields.forEach(field => {
      const error = validateField(field.name, formData[field.name], field.rules);
      if (error) {
        errors[field.name] = error;
      }
    });

    return errors;
  };

  const isValidForm = (formData: Record<string, unknown>): boolean => {
    const errors = validateForm(formData);
    return Object.keys(errors).length === 0;
  };

  return {
    validateField,
    validateForm,
    isValidForm,
  };
}

// Validation error component
interface ValidationErrorProps {
  error?: string;
  className?: string;
}

export function ValidationError({ error, className = '' }: ValidationErrorProps) {
  const { isRTL } = useLanguage();

  if (!error) return null;

  return (
    <div className={`text-sm text-red-600 mt-1 font-readex ${isRTL ? 'text-right' : 'text-left'} ${className}`}>
      {error}
    </div>
  );
}

// Form field wrapper with validation
interface FormFieldWrapperProps {
  children: React.ReactNode;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export function FormFieldWrapper({ children, error, label, required, className = '' }: FormFieldWrapperProps) {
  const { isRTL } = useLanguage();

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className={`text-sm font-medium text-gray-700 font-readex ${isRTL ? 'text-right' : 'text-left'} block`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      <ValidationError error={error} />
    </div>
  );
}

// Common validation rules
export const commonValidationRules = {
  required: { required: true },
  
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
    messageAr: 'يرجى إدخال عنوان بريد إلكتروني صحيح'
  },
  
  phone: {
    pattern: /^(\+966|0)?5\d{8}$/,
    message: 'Please enter a valid Saudi phone number',
    messageAr: 'يرجى إدخال رقم هاتف سعودي صحيح'
  },
  
  url: {
    pattern: /^https?:\/\/.+/,
    message: 'Please enter a valid URL',
    messageAr: 'يرجى إدخال رابط صحيح'
  },
  
  minLength: (length: number) => ({
    minLength: length,
    message: `Minimum ${length} characters required`,
    messageAr: `الحد الأدنى ${length} أحرف مطلوب`
  }),
  
  maxLength: (length: number) => ({
    maxLength: length,
    message: `Maximum ${length} characters allowed`,
    messageAr: `الحد الأقصى ${length} حرف مسموح`
  }),
  
  strongPassword: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
    messageAr: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل مع أحرف كبيرة وصغيرة ورقم ورمز خاص'
  }
};

// Pre-defined field configurations for common use cases
export const fieldConfigurations = {
  // Basic fields
  titleEn: {
    name: 'titleEn',
    rules: [commonValidationRules.required, commonValidationRules.minLength(3), commonValidationRules.maxLength(200)]
  },
  
  titleAr: {
    name: 'titleAr',
    rules: [commonValidationRules.required, commonValidationRules.minLength(3), commonValidationRules.maxLength(200)]
  },
  
  email: {
    name: 'email',
    rules: [commonValidationRules.required, commonValidationRules.email]
  },
  
  phone: {
    name: 'phone',
    rules: [commonValidationRules.phone]
  },
  
  password: {
    name: 'password',
    rules: [commonValidationRules.required, commonValidationRules.strongPassword]
  },
  
  // Content fields
  summaryEn: {
    name: 'summaryEn',
    rules: [commonValidationRules.maxLength(500)]
  },
  
  summaryAr: {
    name: 'summaryAr',
    rules: [commonValidationRules.maxLength(500)]
  },
  
  contentEn: {
    name: 'contentEn',
    rules: [commonValidationRules.required, commonValidationRules.minLength(10)]
  },
  
  contentAr: {
    name: 'contentAr',
    rules: [commonValidationRules.required, commonValidationRules.minLength(10)]
  },
  
  // URL and media fields
  imageUrl: {
    name: 'imageUrl',
    rules: [commonValidationRules.url]
  },
  
  websiteUrl: {
    name: 'websiteUrl',
    rules: [commonValidationRules.url]
  }
};
