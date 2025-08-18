import { useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../contexts/AppContext';

// Focus management hook
export const useFocusManagement = () => {
  const focusableElementsSelector = 
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(focusableElementsSelector);
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const restoreFocus = useCallback((element: HTMLElement | null) => {
    if (element && element.focus) {
      element.focus();
    }
  }, []);

  return { trapFocus, restoreFocus };
};

// Announcement hook for screen readers
export const useAnnouncement = () => {
  const { currentLang } = useLanguage();
  const announcementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create announcement container if it doesn't exist
    if (!announcementRef.current) {
      const container = document.createElement('div');
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      container.className = 'sr-only';
      container.id = 'accessibility-announcements';
      document.body.appendChild(container);
      announcementRef.current = container;
    }

    return () => {
      if (announcementRef.current) {
        document.body.removeChild(announcementRef.current);
        announcementRef.current = null;
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcementRef.current) {
      announcementRef.current.setAttribute('aria-live', priority);
      announcementRef.current.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  const announceNavigation = useCallback((pageName: string) => {
    const message = currentLang === 'ar' 
      ? `تم الانتقال إلى صفحة ${pageName}`
      : `Navigated to ${pageName} page`;
    announce(message);
  }, [announce, currentLang]);

  const announceAction = useCallback((action: string) => {
    announce(action);
  }, [announce]);

  const announceError = useCallback((error: string) => {
    announce(error, 'assertive');
  }, [announce]);

  return { announce, announceNavigation, announceAction, announceError };
};

// Keyboard navigation hook
export const useKeyboardNavigation = () => {
  const handleKeyDown = useCallback((
    e: React.KeyboardEvent,
    callbacks: {
      onEnter?: () => void;
      onSpace?: () => void;
      onEscape?: () => void;
      onArrowUp?: () => void;
      onArrowDown?: () => void;
      onArrowLeft?: () => void;
      onArrowRight?: () => void;
    }
  ) => {
    switch (e.key) {
      case 'Enter':
        if (callbacks.onEnter) {
          e.preventDefault();
          callbacks.onEnter();
        }
        break;
      case ' ':
        if (callbacks.onSpace) {
          e.preventDefault();
          callbacks.onSpace();
        }
        break;
      case 'Escape':
        if (callbacks.onEscape) {
          e.preventDefault();
          callbacks.onEscape();
        }
        break;
      case 'ArrowUp':
        if (callbacks.onArrowUp) {
          e.preventDefault();
          callbacks.onArrowUp();
        }
        break;
      case 'ArrowDown':
        if (callbacks.onArrowDown) {
          e.preventDefault();
          callbacks.onArrowDown();
        }
        break;
      case 'ArrowLeft':
        if (callbacks.onArrowLeft) {
          e.preventDefault();
          callbacks.onArrowLeft();
        }
        break;
      case 'ArrowRight':
        if (callbacks.onArrowRight) {
          e.preventDefault();
          callbacks.onArrowRight();
        }
        break;
    }
  }, []);

  return { handleKeyDown };
};

// Skip links hook
export const useSkipLinks = () => {
  const { currentLang } = useLanguage();

  const skipLinks = [
    {
      href: '#main-content',
      label: currentLang === 'ar' ? 'تخطي إلى المحتوى الرئيسي' : 'Skip to main content'
    },
    {
      href: '#primary-navigation',
      label: currentLang === 'ar' ? 'تخطي إلى التنقل الرئيسي' : 'Skip to main navigation'
    },
    {
      href: '#footer',
      label: currentLang === 'ar' ? 'تخطي إلى التذييل' : 'Skip to footer'
    }
  ];

  return { skipLinks };
};

// ARIA attributes helper
export const useAriaAttributes = () => {
  const { currentLang } = useLanguage();

  const getAriaLabel = useCallback((key: string, fallback?: string) => {
    const labels: Record<string, Record<string, string>> = {
      ar: {
        close: 'إغلاق',
        open: 'فتح',
        menu: 'القائمة',
        search: 'البحث',
        loading: 'جاري التحميل',
        error: 'خطأ',
        success: 'نجح',
        warning: 'تحذير',
        info: 'معلومات',
        previous: 'السابق',
        next: 'التالي',
        home: 'الرئيسية',
        back: 'العودة',
        submit: 'إرسال',
        cancel: 'إلغاء',
        save: 'حفظ',
        edit: 'تعديل',
        delete: 'حذف',
        share: 'مشاركة',
        like: 'إعجاب',
        bookmark: 'إشارة مرجعية',
        download: 'تحميل',
        print: 'طباعة',
        expand: 'توسيع',
        collapse: 'طي',
        sortAscending: 'ترتيب تصاعدي',
        sortDescending: 'ترتيب تنازلي',
        filter: 'تصفية',
        clearFilter: 'مسح التصفية',
        selectAll: 'تحديد الكل',
        deselectAll: 'إلغاء تحديد الكل'
      },
      en: {
        close: 'Close',
        open: 'Open',
        menu: 'Menu',
        search: 'Search',
        loading: 'Loading',
        error: 'Error',
        success: 'Success',
        warning: 'Warning',
        info: 'Information',
        previous: 'Previous',
        next: 'Next',
        home: 'Home',
        back: 'Back',
        submit: 'Submit',
        cancel: 'Cancel',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        share: 'Share',
        like: 'Like',
        bookmark: 'Bookmark',
        download: 'Download',
        print: 'Print',
        expand: 'Expand',
        collapse: 'Collapse',
        sortAscending: 'Sort ascending',
        sortDescending: 'Sort descending',
        filter: 'Filter',
        clearFilter: 'Clear filter',
        selectAll: 'Select all',
        deselectAll: 'Deselect all'
      }
    };

    return labels[currentLang][key] || fallback || key;
  }, [currentLang]);

  const getAriaDescription = useCallback((key: string, fallback?: string) => {
    const descriptions: Record<string, Record<string, string>> = {
      ar: {
        navigationMenu: 'قائمة التنقل الرئيسية',
        languageToggle: 'تبديل اللغة بين العربية والإنجليزية',
        searchForm: 'نموذج البحث',
        loadingContent: 'جاري تحميل المحتوى',
        errorMessage: 'رسالة خطأ',
        successMessage: 'رسالة نجاح',
        cardLink: 'رابط إلى تفاصيل العنصر',
        externalLink: 'رابط خارجي، يفتح في نافذة جديدة',
        downloadLink: 'رابط تحميل الملف',
        socialLink: 'رابط وسائل التواصل الاجتماعي',
        pagination: 'التنقل بين الصفحات',
        breadcrumb: 'مسار التنقل',
        accordion: 'قائمة قابلة للطي والتوسيع',
        modal: 'نافذة منبثقة',
        tooltip: 'تلميح',
        dropdown: 'قائمة منسدلة'
      },
      en: {
        navigationMenu: 'Main navigation menu',
        languageToggle: 'Toggle language between Arabic and English',
        searchForm: 'Search form',
        loadingContent: 'Loading content',
        errorMessage: 'Error message',
        successMessage: 'Success message',
        cardLink: 'Link to item details',
        externalLink: 'External link, opens in new window',
        downloadLink: 'File download link',
        socialLink: 'Social media link',
        pagination: 'Page navigation',
        breadcrumb: 'Breadcrumb navigation',
        accordion: 'Collapsible and expandable list',
        modal: 'Modal dialog',
        tooltip: 'Tooltip',
        dropdown: 'Dropdown menu'
      }
    };

    return descriptions[currentLang][key] || fallback || '';
  }, [currentLang]);

  return { getAriaLabel, getAriaDescription };
};

// Reduced motion hook
export const useReducedMotion = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return { prefersReducedMotion };
};

// High contrast hook
export const useHighContrast = () => {
  const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
  
  return { prefersHighContrast };
};

// Color scheme hook
export const useColorScheme = () => {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  return { prefersDarkMode };
};

// Focus visible hook
export const useFocusVisible = () => {
  useEffect(() => {
    // Add focus-visible polyfill behavior
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-navigation');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
};

// Screen reader only text hook
export const useScreenReaderText = () => {
  const { currentLang } = useLanguage();

  const getScreenReaderText = useCallback((key: string, fallback?: string) => {
    const texts: Record<string, Record<string, string>> = {
      ar: {
        newWindow: '(يفتح في نافذة جديدة)',
        required: '(مطلوب)',
        optional: '(اختياري)',
        currentPage: '(الصفحة الحالية)',
        loading: '(جاري التحميل)',
        error: '(خطأ)',
        success: '(تم بنجاح)',
        expanded: '(موسع)',
        collapsed: '(مطوي)',
        selected: '(محدد)',
        unselected: '(غير محدد)',
        sortedAscending: '(مرتب تصاعدياً)',
        sortedDescending: '(مرتب تنازلياً)',
        hasSubmenu: '(يحتوي على قائمة فرعية)',
        pageOf: 'صفحة {current} من {total}',
        itemOf: 'عنصر {current} من {total}'
      },
      en: {
        newWindow: '(opens in new window)',
        required: '(required)',
        optional: '(optional)',
        currentPage: '(current page)',
        loading: '(loading)',
        error: '(error)',
        success: '(success)',
        expanded: '(expanded)',
        collapsed: '(collapsed)',
        selected: '(selected)',
        unselected: '(unselected)',
        sortedAscending: '(sorted ascending)',
        sortedDescending: '(sorted descending)',
        hasSubmenu: '(has submenu)',
        pageOf: 'Page {current} of {total}',
        itemOf: 'Item {current} of {total}'
      }
    };

    return texts[currentLang][key] || fallback || '';
  }, [currentLang]);

  return { getScreenReaderText };
};
