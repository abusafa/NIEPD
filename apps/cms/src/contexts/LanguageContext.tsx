'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Language type
export type Language = 'ar' | 'en';

// Language context interface
interface LanguageContextType {
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isRTL: boolean;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation interface
interface Translation {
  [key: string]: string | Translation;
}

// Translations object
const translations: Record<Language, Translation> = {
  ar: {
    // Common
    loading: 'جاري التحميل...',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    create: 'إنشاء',
    update: 'تحديث',
    search: 'بحث',
    filter: 'تصفية',
    actions: 'الإجراءات',
    status: 'الحالة',
    active: 'نشط',
    inactive: 'غير نشط',
    yes: 'نعم',
    no: 'لا',
    confirm: 'تأكيد',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    close: 'إغلاق',
    view: 'عرض',
    download: 'تحميل',
    upload: 'رفع',
    language: 'اللغة',
    arabic: 'العربية',
    english: 'الإنجليزية',

    // Navigation & Layout
    dashboard: 'لوحة الإدارة',
    welcomeBack: 'مرحباً بك مجدداً',
    logout: 'تسجيل الخروج',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',

    // Main Navigation
    nav: {
      dashboard: 'الرئيسية',
      news: 'الأخبار',
      programs: 'البرامج',
      events: 'الفعاليات',
      pages: 'الصفحات',
      partners: 'الشركاء',
      faq: 'الأسئلة الشائعة',
      mediaLibrary: 'مكتبة الوسائط',
      organization: 'الهيكل التنظيمي',
      categories: 'التصنيفات',
      tags: 'العلامات',
      navigation: 'التنقل',
      contactInfo: 'معلومات التواصل',
      contactMessages: 'رسائل التواصل',
      users: 'المستخدمون',
      settings: 'الإعدادات'
    },

    // Dashboard
    dashboard_page: {
      title: 'لوحة التحكم الرئيسية',
      welcome: 'مرحباً بك في نظام إدارة المحتوى',
      overview: 'نظرة عامة',
      recentActivity: 'النشاط الأخير',
      quickActions: 'الإجراءات السريعة',
      statistics: 'الإحصائيات'
    },

    // Statistics Cards
    stats: {
      totalNews: 'إجمالي الأخبار',
      totalPrograms: 'إجمالي البرامج',
      totalEvents: 'إجمالي الفعاليات',
      totalUsers: 'إجمالي المستخدمين',
      totalViews: 'إجمالي المشاهدات',
      activeUsers: 'المستخدمون النشطون',
      publishedContent: 'المحتوى المنشور',
      draftContent: 'المحتوى المسودة'
    },

    // Content Management
    content: {
      title: 'العنوان',
      titleAr: 'العنوان بالعربية',
      titleEn: 'العنوان بالإنجليزية',
      description: 'الوصف',
      descriptionAr: 'الوصف بالعربية',
      descriptionEn: 'الوصف بالإنجليزية',
      content: 'المحتوى',
      contentAr: 'المحتوى بالعربية',
      contentEn: 'المحتوى بالإنجليزية',
      image: 'الصورة',
      featured: 'مميز',
      published: 'منشور',
      draft: 'مسودة',
      category: 'التصنيف',
      tags: 'العلامات',
      author: 'الكاتب',
      publishDate: 'تاريخ النشر',
      createdAt: 'تاريخ الإنشاء',
      updatedAt: 'تاريخ التحديث',
      slug: 'الرابط المخصص'
    },

    // News Management
    news: {
      title: 'إدارة الأخبار',
      createNew: 'إنشاء خبر جديد',
      editNews: 'تعديل الخبر',
      newsList: 'قائمة الأخبار',
      newsDetails: 'تفاصيل الخبر',
      addNews: 'إضافة خبر',
      deleteConfirm: 'هل أنت متأكد من حذف هذا الخبر؟',
      publishConfirm: 'هل تريد نشر هذا الخبر؟',
      summary: 'الملخص',
      summaryAr: 'الملخص بالعربية',
      summaryEn: 'الملخص بالإنجليزية'
    },

    // Programs Management
    programs: {
      title: 'إدارة البرامج',
      createNew: 'إنشاء برنامج جديد',
      editProgram: 'تعديل البرنامج',
      programsList: 'قائمة البرامج',
      programDetails: 'تفاصيل البرنامج',
      addProgram: 'إضافة برنامج',
      deleteConfirm: 'هل أنت متأكد من حذف هذا البرنامج؟',
      duration: 'المدة',
      startDate: 'تاريخ البداية',
      endDate: 'تاريخ النهاية',
      capacity: 'السعة',
      instructor: 'المدرب',
      price: 'السعر',
      prerequisites: 'المتطلبات المسبقة'
    },

    // Events Management
    events: {
      title: 'إدارة الفعاليات',
      createNew: 'إنشاء فعالية جديدة',
      editEvent: 'تعديل الفعالية',
      eventsList: 'قائمة الفعاليات',
      eventDetails: 'تفاصيل الفعالية',
      addEvent: 'إضافة فعالية',
      deleteConfirm: 'هل أنت متأكد من حذف هذه الفعالية؟',
      location: 'الموقع',
      locationAr: 'الموقع بالعربية',
      locationEn: 'الموقع بالإنجليزية',
      dateTime: 'التاريخ والوقت',
      registrationRequired: 'التسجيل مطلوب',
      maxAttendees: 'الحد الأقصى للحضور'
    },

    // User Management
    users: {
      title: 'إدارة المستخدمين',
      createNew: 'إنشاء مستخدم جديد',
      editUser: 'تعديل المستخدم',
      usersList: 'قائمة المستخدمين',
      userDetails: 'تفاصيل المستخدم',
      addUser: 'إضافة مستخدم',
      deleteConfirm: 'هل أنت متأكد من حذف هذا المستخدم؟',
      username: 'اسم المستخدم',
      email: 'البريد الإلكتروني',
      firstName: 'الاسم الأول',
      lastName: 'الاسم الأخير',
      role: 'الدور',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      lastLogin: 'آخر تسجيل دخول',
      roles: {
        SUPER_ADMIN: 'مدير عام',
        ADMIN: 'مدير',
        EDITOR: 'محرر',
        USER: 'مستخدم'
      }
    },

    // Authentication
    auth: {
      login: 'تسجيل الدخول',
      loginTitle: 'تسجيل الدخول إلى لوحة الإدارة',
      loginSubtitle: 'أدخل بياناتك للوصول إلى نظام إدارة المحتوى',
      usernameOrEmail: 'اسم المستخدم أو البريد الإلكتروني',
      password: 'كلمة المرور',
      rememberMe: 'تذكرني',
      forgotPassword: 'نسيت كلمة المرور؟',
      loginError: 'خطأ في تسجيل الدخول',
      invalidCredentials: 'بيانات الاعتماد غير صحيحة',
      logoutSuccess: 'تم تسجيل الخروج بنجاح'
    },

    // Forms
    form: {
      required: 'هذا الحقل مطلوب',
      invalidEmail: 'البريد الإلكتروني غير صحيح',
      passwordMismatch: 'كلمات المرور غير متطابقة',
      minLength: 'الحد الأدنى {min} أحرف',
      maxLength: 'الحد الأقصى {max} حرف',
      selectOption: 'اختر خياراً',
      uploadImage: 'رفع صورة',
      dragDropImage: 'اسحب وأفلت الصورة هنا أو انقر للاختيار'
    },

    // Messages
    messages: {
      success: 'تم بنجاح',
      error: 'حدث خطأ',
      createSuccess: 'تم الإنشاء بنجاح',
      updateSuccess: 'تم التحديث بنجاح',
      deleteSuccess: 'تم الحذف بنجاح',
      saveSuccess: 'تم الحفظ بنجاح',
      uploadSuccess: 'تم رفع الملف بنجاح',
      networkError: 'خطأ في الشبكة',
      serverError: 'خطأ في الخادم',
      notFound: 'لم يتم العثور على البيانات',
      unauthorized: 'غير مخول للوصول',
      forbidden: 'ممنوع الوصول'
    },

    // Media Library
    media: {
      title: 'مكتبة الوسائط',
      uploadFiles: 'رفع الملفات',
      selectFiles: 'اختيار الملفات',
      dragDrop: 'اسحب وأفلت الملفات هنا',
      supportedFormats: 'الصيغ المدعومة: JPG, PNG, GIF, PDF, DOC, DOCX',
      fileSize: 'حجم الملف',
      fileName: 'اسم الملف',
      fileType: 'نوع الملف',
      uploadDate: 'تاريخ الرفع',
      deleteFile: 'حذف الملف',
      copyUrl: 'نسخ الرابط'
    },

    // Theme
    theme: {
      light: 'فاتح',
      dark: 'داكن',
      system: 'النظام',
      toggle: 'تغيير المظهر'
    }
  },
  
  en: {
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    update: 'Update',
    search: 'Search',
    filter: 'Filter',
    actions: 'Actions',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    yes: 'Yes',
    no: 'No',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    view: 'View',
    download: 'Download',
    upload: 'Upload',
    language: 'Language',
    arabic: 'Arabic',
    english: 'English',

    // Navigation & Layout
    dashboard: 'Dashboard',
    welcomeBack: 'Welcome back',
    logout: 'Logout',
    settings: 'Settings',
    profile: 'Profile',

    // Main Navigation
    nav: {
      dashboard: 'Dashboard',
      news: 'News',
      programs: 'Programs',
      events: 'Events',
      pages: 'Pages',
      partners: 'Partners',
      faq: 'FAQ',
      mediaLibrary: 'Media Library',
      organization: 'Organization',
      categories: 'Categories',
      tags: 'Tags',
      navigation: 'Navigation',
      contactInfo: 'Contact Info',
      contactMessages: 'Contact Messages',
      users: 'Users',
      settings: 'Settings'
    },

    // Dashboard
    dashboard_page: {
      title: 'Main Dashboard',
      welcome: 'Welcome to Content Management System',
      overview: 'Overview',
      recentActivity: 'Recent Activity',
      quickActions: 'Quick Actions',
      statistics: 'Statistics'
    },

    // Statistics Cards
    stats: {
      totalNews: 'Total News',
      totalPrograms: 'Total Programs',
      totalEvents: 'Total Events',
      totalUsers: 'Total Users',
      totalViews: 'Total Views',
      activeUsers: 'Active Users',
      publishedContent: 'Published Content',
      draftContent: 'Draft Content'
    },

    // Content Management
    content: {
      title: 'Title',
      titleAr: 'Arabic Title',
      titleEn: 'English Title',
      description: 'Description',
      descriptionAr: 'Arabic Description',
      descriptionEn: 'English Description',
      content: 'Content',
      contentAr: 'Arabic Content',
      contentEn: 'English Content',
      image: 'Image',
      featured: 'Featured',
      published: 'Published',
      draft: 'Draft',
      category: 'Category',
      tags: 'Tags',
      author: 'Author',
      publishDate: 'Publish Date',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
      slug: 'Slug'
    },

    // News Management
    news: {
      title: 'News Management',
      createNew: 'Create New Article',
      editNews: 'Edit News',
      newsList: 'News List',
      newsDetails: 'News Details',
      addNews: 'Add News',
      deleteConfirm: 'Are you sure you want to delete this article?',
      publishConfirm: 'Do you want to publish this article?',
      summary: 'Summary',
      summaryAr: 'Arabic Summary',
      summaryEn: 'English Summary'
    },

    // Programs Management
    programs: {
      title: 'Programs Management',
      createNew: 'Create New Program',
      editProgram: 'Edit Program',
      programsList: 'Programs List',
      programDetails: 'Program Details',
      addProgram: 'Add Program',
      deleteConfirm: 'Are you sure you want to delete this program?',
      duration: 'Duration',
      startDate: 'Start Date',
      endDate: 'End Date',
      capacity: 'Capacity',
      instructor: 'Instructor',
      price: 'Price',
      prerequisites: 'Prerequisites'
    },

    // Events Management
    events: {
      title: 'Events Management',
      createNew: 'Create New Event',
      editEvent: 'Edit Event',
      eventsList: 'Events List',
      eventDetails: 'Event Details',
      addEvent: 'Add Event',
      deleteConfirm: 'Are you sure you want to delete this event?',
      location: 'Location',
      locationAr: 'Arabic Location',
      locationEn: 'English Location',
      dateTime: 'Date & Time',
      registrationRequired: 'Registration Required',
      maxAttendees: 'Max Attendees'
    },

    // User Management
    users: {
      title: 'User Management',
      createNew: 'Create New User',
      editUser: 'Edit User',
      usersList: 'Users List',
      userDetails: 'User Details',
      addUser: 'Add User',
      deleteConfirm: 'Are you sure you want to delete this user?',
      username: 'Username',
      email: 'Email',
      firstName: 'First Name',
      lastName: 'Last Name',
      role: 'Role',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      lastLogin: 'Last Login',
      roles: {
        SUPER_ADMIN: 'Super Admin',
        ADMIN: 'Admin',
        EDITOR: 'Editor',
        USER: 'User'
      }
    },

    // Authentication
    auth: {
      login: 'Login',
      loginTitle: 'Sign in to Admin Panel',
      loginSubtitle: 'Enter your credentials to access the content management system',
      usernameOrEmail: 'Username or Email',
      password: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      loginError: 'Login Error',
      invalidCredentials: 'Invalid credentials',
      logoutSuccess: 'Successfully logged out'
    },

    // Forms
    form: {
      required: 'This field is required',
      invalidEmail: 'Invalid email address',
      passwordMismatch: 'Passwords do not match',
      minLength: 'Minimum {min} characters',
      maxLength: 'Maximum {max} characters',
      selectOption: 'Select an option',
      uploadImage: 'Upload Image',
      dragDropImage: 'Drag and drop image here or click to select'
    },

    // Messages
    messages: {
      success: 'Success',
      error: 'Error occurred',
      createSuccess: 'Created successfully',
      updateSuccess: 'Updated successfully',
      deleteSuccess: 'Deleted successfully',
      saveSuccess: 'Saved successfully',
      uploadSuccess: 'File uploaded successfully',
      networkError: 'Network error',
      serverError: 'Server error',
      notFound: 'Data not found',
      unauthorized: 'Unauthorized access',
      forbidden: 'Access forbidden'
    },

    // Media Library
    media: {
      title: 'Media Library',
      uploadFiles: 'Upload Files',
      selectFiles: 'Select Files',
      dragDrop: 'Drag and drop files here',
      supportedFormats: 'Supported formats: JPG, PNG, GIF, PDF, DOC, DOCX',
      fileSize: 'File Size',
      fileName: 'File Name',
      fileType: 'File Type',
      uploadDate: 'Upload Date',
      deleteFile: 'Delete File',
      copyUrl: 'Copy URL'
    },

    // Theme
    theme: {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      toggle: 'Toggle theme'
    }
  }
};

// Helper function to get nested translation
const getNestedTranslation = (obj: Translation, path: string): string => {
  const keys = path.split('.');
  let current: any = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return path; // Return the key if translation not found
    }
  }
  
  return typeof current === 'string' ? current : path;
};

// Helper function to replace parameters in translation strings
const replaceParams = (str: string, params?: Record<string, string>): string => {
  if (!params) return str;
  
  return str.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] || match;
  });
};

// Language provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLang, setCurrentLang] = useState<Language>('ar');

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('cms-language') as Language;
    if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
      setCurrentLang(savedLang);
    }
  }, []);

  // Update document attributes and localStorage when language changes
  useEffect(() => {
    document.documentElement.setAttribute('lang', currentLang);
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('cms-language', currentLang);
  }, [currentLang]);

  const setLanguage = (lang: Language) => {
    setCurrentLang(lang);
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const translation = getNestedTranslation(translations[currentLang], key);
    return replaceParams(translation, params);
  };

  const isRTL = currentLang === 'ar';

  const value: LanguageContextType = {
    currentLang,
    setLanguage,
    t,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use language context
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Export language context for direct access if needed
export { LanguageContext };
