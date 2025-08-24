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
      description: 'إدارة المقالات الإخبارية والإعلانات',
      createNew: 'مقال جديد',
      editNews: 'تعديل الخبر',
      newsList: 'قائمة الأخبار',
      newsDetails: 'تفاصيل الخبر',
      addNews: 'إضافة خبر',
      deleteConfirm: 'هل أنت متأكد من حذف هذا الخبر؟',
      publishConfirm: 'هل تريد نشر هذا الخبر؟',
      summary: 'الملخص',
      summaryAr: 'الملخص بالعربية',
      summaryEn: 'الملخص بالإنجليزية',
      // Enhanced features
      publish: 'نشر',
      unpublish: 'إلغاء النشر',
      submitForReview: 'إرسال للمراجعة',
      publishSuccess: 'تم نشر المقال بنجاح',
      unpublishSuccess: 'تم إلغاء نشر المقال بنجاح',
      submitReviewSuccess: 'تم إرسال المقال للمراجعة بنجاح',
      publishError: 'فشل في نشر المقال',
      unpublishError: 'فشل في إلغاء نشر المقال',
      submitReviewError: 'فشل في إرسال المقال للمراجعة',
      searchPlaceholder: 'البحث في المقالات...',
      emptyMessage: 'لم يتم العثور على مقالات',
      emptyDescription: 'أنشئ أول مقال إخباري',
      // Status
      published: 'منشور',
      draft: 'مسودة',
      underReview: 'تحت المراجعة',
      // Statistics
      totalArticles: 'إجمالي المقالات',
      totalCount: 'العدد الإجمالي',
      publishedArticles: 'مقالات منشورة',
      featuredArticles: 'مقالات مميزة',
      // Filters
      statusFilter: 'الحالة',
      featuredFilter: 'المميزة',
      categoryFilter: 'التصنيف',
      featuredOnly: 'المميزة فقط',
      nonFeatured: 'غير مميزة'
    },

    // Programs Management
    programs: {
      title: 'إدارة البرامج',
      description: 'إدارة البرامج التدريبية والدورات',
      createNew: 'برنامج جديد',
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
      prerequisites: 'المتطلبات المسبقة',
      // Enhanced features
      publish: 'نشر',
      unpublish: 'إلغاء النشر',
      submitForReview: 'إرسال للمراجعة',
      publishSuccess: 'تم نشر البرنامج بنجاح',
      unpublishSuccess: 'تم إلغاء نشر البرنامج بنجاح',
      submitReviewSuccess: 'تم إرسال البرنامج للمراجعة بنجاح',
      publishError: 'فشل في نشر البرنامج',
      unpublishError: 'فشل في إلغاء نشر البرنامج',
      submitReviewError: 'فشل في إرسال البرنامج للمراجعة',
      searchPlaceholder: 'البحث في البرامج...',
      emptyMessage: 'لم يتم العثور على برامج',
      emptyDescription: 'أنشئ أول برنامج تدريبي',
      // Program specific
      level: 'المستوى',
      participants: 'المشاركون',
      free: 'مجاني',
      certified: 'معتمد',
      // Levels
      beginner: 'مبتدئ',
      intermediate: 'متوسط',
      advanced: 'متقدم',
      expert: 'خبير',
      // Duration types
      hours: 'ساعة',
      days: 'يوم',
      weeks: 'أسبوع',
      months: 'شهر',
      // Statistics
      totalPrograms: 'إجمالي البرامج',
      publishedPrograms: 'برامج منشورة',
      featuredPrograms: 'برامج مميزة',
      freePrograms: 'برامج مجانية',
      // Filters
      levelFilter: 'المستوى',
      typeFilter: 'النوع',
      certificationFilter: 'الشهادة',
      freeFilter: 'البرامج المجانية',
      paidFilter: 'البرامج المدفوعة',
      certifiedFilter: 'معتمد',
      nonCertifiedFilter: 'غير معتمد'
    },

    // Events Management
    events: {
      title: 'إدارة الفعاليات',
      description: 'إدارة ورش العمل والمؤتمرات والندوات',
      createNew: 'فعالية جديدة',
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
      maxAttendees: 'الحد الأقصى للحضور',
      // Enhanced features
      publish: 'نشر',
      unpublish: 'إلغاء النشر',
      submitForReview: 'إرسال للمراجعة',
      publishSuccess: 'تم نشر الفعالية بنجاح',
      unpublishSuccess: 'تم إلغاء نشر الفعالية بنجاح',
      submitReviewSuccess: 'تم إرسال الفعالية للمراجعة بنجاح',
      publishError: 'فشل في نشر الفعالية',
      unpublishError: 'فشل في إلغاء نشر الفعالية',
      submitReviewError: 'فشل في إرسال الفعالية للمراجعة',
      searchPlaceholder: 'البحث في الفعاليات...',
      emptyMessage: 'لم يتم العثور على فعاليات',
      emptyDescription: 'أنشئ أول فعالية',
      // Event specific
      venue: 'المكان',
      venueAr: 'المكان بالعربية',
      venueEn: 'المكان بالإنجليزية',
      eventType: 'نوع الفعالية',
      eventTypeAr: 'نوع الفعالية بالعربية',
      eventTypeEn: 'نوع الفعالية بالإنجليزية',
      capacity: 'السعة',
      noLimit: 'بدون حد',
      // Event Status
      eventStatus: 'حالة الفعالية',
      publishStatus: 'حالة النشر',
      upcoming: 'قادم',
      ongoing: 'جاري',
      past: 'سابق',
      cancelled: 'ملغي',
      // Statistics
      totalEvents: 'إجمالي الفعاليات',
      upcomingEvents: 'فعاليات قادمة',
      futureEvents: 'فعاليات مستقبلية',
      publishedEvents: 'فعاليات منشورة',
      featuredEvents: 'فعاليات مميزة',
      // Filters
      eventStatusFilter: 'حالة الفعالية',
      publishStatusFilter: 'حالة النشر'
    },

    // User Management
    users: {
      title: 'إدارة المستخدمين',
      description: 'إدارة مستخدمي النظام وصلاحياتهم',
      createNew: 'مستخدم جديد',
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
      // Enhanced features
      user: 'المستخدم',
      toggleStatus: 'تغيير الحالة',
      activateSuccess: 'تم تفعيل المستخدم بنجاح',
      deactivateSuccess: 'تم إلغاء تفعيل المستخدم بنجاح',
      toggleStatusError: 'فشل في تغيير حالة المستخدم',
      cannotDeleteSuperAdmin: 'لا يمكن حذف المدير العام',
      searchPlaceholder: 'البحث في المستخدمين...',
      emptyMessage: 'لم يتم العثور على مستخدمين',
      emptyDescription: 'أنشئ أول حساب مستخدم',
      unknown: 'غير معروف',
      // Status
      active: 'نشط',
      inactive: 'غير نشط',
      created: 'تاريخ الإنشاء',
      lastUpdated: 'آخر تحديث',
      // Roles
      roles: {
        SUPER_ADMIN: 'مدير عام',
        ADMIN: 'مدير',
        EDITOR: 'محرر',
        AUTHOR: 'كاتب',
        VIEWER: 'مشاهد',
        USER: 'مستخدم'
      },
      // Statistics
      totalUsers: 'إجمالي المستخدمين',
      activeUsers: 'المستخدمون النشطون',
      activeAccounts: 'حسابات نشطة',
      administrators: 'المدراء',
      systemAdministrators: 'مدراء النظام',
      contentCreators: 'منشئو المحتوى',
      authorsAndEditors: 'كتاب ومحررون',
      // Filters
      roleFilter: 'الدور',
      statusFilter: 'الحالة'
    },

    // Categories Management
    categories: {
      title: 'إدارة التصنيفات',
      description: 'تنظيم المحتوى باستخدام التصنيفات والتصنيفات الفرعية',
      createNew: 'تصنيف جديد',
      editCategory: 'تعديل التصنيف',
      categoriesList: 'قائمة التصنيفات',
      categoryDetails: 'تفاصيل التصنيف',
      addCategory: 'إضافة تصنيف',
      deleteConfirm: 'هل أنت متأكد من حذف هذا التصنيف؟',
      searchPlaceholder: 'البحث في التصنيفات...',
      emptyMessage: 'لم يتم العثور على تصنيفات',
      emptyDescription: 'أنشئ أول تصنيف لتنظيم المحتوى',
      cannotDeleteWithContent: 'لا يمكن حذف تصنيف يحتوي على تصنيفات فرعية أو محتوى',
      // Category specific
      category: 'التصنيف',
      type: 'النوع',
      slug: 'الرابط المختصر',
      usage: 'الاستخدام',
      items: 'عناصر',
      subcategories: 'الفئات الفرعية',
      parent: 'الوالد',
      noCategory: 'بدون تصنيف',
      // Types
      types: {
        NEWS: 'الأخبار',
        PROGRAMS: 'البرامج',
        EVENTS: 'الفعاليات',
        PAGES: 'الصفحات',
        GENERAL: 'عام'
      },
      // Usage breakdown
      newsCount: 'أخبار',
      programsCount: 'برامج',
      eventsCount: 'فعاليات',
      pagesCount: 'صفحات',
      // Statistics
      totalCategories: 'إجمالي التصنيفات',
      newsCategories: 'تصنيفات الأخبار',
      organizeNews: 'لتنظيم الأخبار',
      programCategories: 'تصنيفات البرامج',
      organizePrograms: 'لتنظيم البرامج',
      parentCategories: 'التصنيفات الرئيسية',
      withoutParent: 'بدون تصنيف والد',
      // Filters
      typeFilter: 'النوع',
      hierarchyFilter: 'التسلسل الهرمي',
      parentCategoriesFilter: 'التصنيفات الرئيسية',
      subcategoriesFilter: 'التصنيفات الفرعية'
    },

    // Pages Management
    pages: {
      title: 'إدارة الصفحات',
      description: 'إدارة الصفحات الثابتة والسياسات والمحتوى الإعلامي',
      createNew: 'صفحة جديدة',
      editPage: 'تعديل الصفحة',
      pagesList: 'قائمة الصفحات',
      pageDetails: 'تفاصيل الصفحة',
      addPage: 'إضافة صفحة',
      deleteConfirm: 'هل أنت متأكد من حذف هذه الصفحة؟',
      searchPlaceholder: 'البحث في الصفحات...',
      emptyMessage: 'لم يتم العثور على صفحات',
      emptyDescription: 'أنشئ أول صفحة ثابتة',
      // Enhanced features
      publish: 'نشر',
      unpublish: 'إلغاء النشر',
      submitForReview: 'إرسال للمراجعة',
      publishSuccess: 'تم نشر الصفحة بنجاح',
      unpublishSuccess: 'تم إلغاء نشر الصفحة بنجاح',
      submitReviewSuccess: 'تم إرسال الصفحة للمراجعة بنجاح',
      publishError: 'فشل في نشر الصفحة',
      unpublishError: 'فشل في إلغاء نشر الصفحة',
      submitReviewError: 'فشل في إرسال الصفحة للمراجعة',
      // Page specific
      page: 'الصفحة',
      template: 'القالب',
      visibility: 'الرؤية',
      pageType: 'نوع الصفحة',
      // Templates
      default: 'افتراضي',
      landing: 'صفحة هبوط',
      policy: 'سياسة',
      about: 'حول',
      contact: 'تواصل',
      // Visibility
      public: 'عامة',
      private: 'خاصة',
      restricted: 'مقيدة',
      // Statistics
      totalPages: 'إجمالي الصفحات',
      publishedPages: 'صفحات منشورة',
      draftPages: 'صفحات مسودة',
      policyPages: 'صفحات السياسات',
      // Filters
      templateFilter: 'القالب',
      visibilityFilter: 'الرؤية',
      statusFilter: 'الحالة'
    },

    // Partners Management
    partners: {
      title: 'إدارة الشركاء',
      description: 'إدارة شركاء المنظمة والرعاة والمتعاونين',
      createNew: 'شريك جديد',
      editPartner: 'تعديل الشريك',
      partnersList: 'قائمة الشركاء',
      partnerDetails: 'تفاصيل الشريك',
      addPartner: 'إضافة شريك',
      deleteConfirm: 'هل أنت متأكد من حذف هذا الشريك؟',
      searchPlaceholder: 'البحث في الشركاء...',
      emptyMessage: 'لم يتم العثور على شركاء',
      emptyDescription: 'أضف أول شريك للمنظمة',
      // Partner specific
      partner: 'الشريك',
      organization: 'المنظمة',
      partnerType: 'نوع الشراكة',
      website: 'الموقع الإلكتروني',
      logo: 'الشعار',
      contact: 'جهة التواصل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      // Partner Types
      sponsor: 'راعي',
      collaborator: 'متعاون',
      supplier: 'مورد',
      client: 'عميل',
      strategic: 'استراتيجي',
      // Statistics
      totalPartners: 'إجمالي الشركاء',
      featuredPartners: 'شركاء مميزون',
      activePartners: 'شركاء نشطون',
      sponsorPartners: 'شركاء راعون',
      // Filters
      typeFilter: 'نوع الشراكة',
      statusFilter: 'الحالة',
      featuredFilter: 'المميز'
    },

    // FAQ Management
    faq: {
      title: 'إدارة الأسئلة الشائعة',
      description: 'إدارة الأسئلة المتكررة وإجاباتها',
      createNew: 'سؤال جديد',
      editFAQ: 'تعديل السؤال',
      faqList: 'قائمة الأسئلة',
      faqDetails: 'تفاصيل السؤال',
      addFAQ: 'إضافة سؤال',
      deleteConfirm: 'هل أنت متأكد من حذف هذا السؤال؟',
      searchPlaceholder: 'البحث في الأسئلة والأجوبة...',
      emptyMessage: 'لم يتم العثور على أسئلة',
      emptyDescription: 'أضف أول سؤال شائع',
      // Enhanced features
      publish: 'نشر',
      unpublish: 'إلغاء النشر',
      submitForReview: 'إرسال للمراجعة',
      publishSuccess: 'تم نشر السؤال بنجاح',
      unpublishSuccess: 'تم إلغاء نشر السؤال بنجاح',
      submitReviewSuccess: 'تم إرسال السؤال للمراجعة بنجاح',
      publishError: 'فشل في نشر السؤال',
      unpublishError: 'فشل في إلغاء نشر السؤال',
      submitReviewError: 'فشل في إرسال السؤال للمراجعة',
      // FAQ specific
      question: 'السؤال',
      questionAr: 'السؤال بالعربية',
      questionEn: 'السؤال بالإنجليزية',
      answer: 'الإجابة',
      answerAr: 'الإجابة بالعربية',
      answerEn: 'الإجابة بالإنجليزية',
      faqCategory: 'تصنيف الأسئلة',
      priority: 'الأولوية',
      helpfulness: 'مدى الفائدة',
      views: 'المشاهدات',
      // Priority levels
      high: 'عالية',
      medium: 'متوسطة',
      low: 'منخفضة',
      // Categories
      general: 'عامة',
      technical: 'تقنية',
      account: 'الحساب',
      billing: 'الفواتير',
      support: 'الدعم',
      // Statistics
      totalFAQ: 'إجمالي الأسئلة',
      publishedFAQ: 'أسئلة منشورة',
      draftFAQ: 'أسئلة مسودة',
      highPriorityFAQ: 'أسئلة عالية الأولوية',
      // Filters
      categoryFilter: 'التصنيف',
      priorityFilter: 'الأولوية',
      statusFilter: 'الحالة'
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
      description: 'Manage news articles and announcements',
      createNew: 'New Article',
      editNews: 'Edit News',
      newsList: 'News List',
      newsDetails: 'News Details',
      addNews: 'Add News',
      deleteConfirm: 'Are you sure you want to delete this article?',
      publishConfirm: 'Do you want to publish this article?',
      summary: 'Summary',
      summaryAr: 'Arabic Summary',
      summaryEn: 'English Summary',
      // Enhanced features
      publish: 'Publish',
      unpublish: 'Unpublish',
      submitForReview: 'Submit for Review',
      publishSuccess: 'Article published successfully',
      unpublishSuccess: 'Article unpublished successfully',
      submitReviewSuccess: 'Article submitted for review successfully',
      publishError: 'Failed to publish article',
      unpublishError: 'Failed to unpublish article',
      submitReviewError: 'Failed to submit for review',
      searchPlaceholder: 'Search articles...',
      emptyMessage: 'No articles found',
      emptyDescription: 'Create your first news article',
      // Status
      published: 'Published',
      draft: 'Draft',
      underReview: 'Under Review',
      // Statistics
      totalArticles: 'Total Articles',
      totalCount: 'Total count',
      publishedArticles: 'Published articles',
      featuredArticles: 'Featured articles',
      // Filters
      statusFilter: 'Status',
      featuredFilter: 'Featured',
      categoryFilter: 'Category',
      featuredOnly: 'Featured Only',
      nonFeatured: 'Non-Featured'
    },

    // Programs Management
    programs: {
      title: 'Programs Management',
      description: 'Manage training programs and courses',
      createNew: 'New Program',
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
      prerequisites: 'Prerequisites',
      // Enhanced features
      publish: 'Publish',
      unpublish: 'Unpublish',
      submitForReview: 'Submit for Review',
      publishSuccess: 'Program published successfully',
      unpublishSuccess: 'Program unpublished successfully',
      submitReviewSuccess: 'Program submitted for review successfully',
      publishError: 'Failed to publish program',
      unpublishError: 'Failed to unpublish program',
      submitReviewError: 'Failed to submit for review',
      searchPlaceholder: 'Search programs...',
      emptyMessage: 'No programs found',
      emptyDescription: 'Create your first training program',
      // Program specific
      level: 'Level',
      participants: 'Participants',
      free: 'Free',
      certified: 'Certified',
      // Levels
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      expert: 'Expert',
      // Duration types
      hours: 'hours',
      days: 'days',
      weeks: 'weeks',
      months: 'months',
      // Statistics
      totalPrograms: 'Total Programs',
      publishedPrograms: 'Published programs',
      featuredPrograms: 'Featured programs',
      freePrograms: 'Free programs',
      // Filters
      levelFilter: 'Level',
      typeFilter: 'Type',
      certificationFilter: 'Certification',
      freeFilter: 'Free Programs',
      paidFilter: 'Paid Programs',
      certifiedFilter: 'Certified',
      nonCertifiedFilter: 'Non-Certified'
    },

    // Events Management
    events: {
      title: 'Events Management',
      description: 'Manage workshops, conferences, and seminars',
      createNew: 'New Event',
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
      maxAttendees: 'Max Attendees',
      // Enhanced features
      publish: 'Publish',
      unpublish: 'Unpublish',
      submitForReview: 'Submit for Review',
      publishSuccess: 'Event published successfully',
      unpublishSuccess: 'Event unpublished successfully',
      submitReviewSuccess: 'Event submitted for review successfully',
      publishError: 'Failed to publish event',
      unpublishError: 'Failed to unpublish event',
      submitReviewError: 'Failed to submit for review',
      searchPlaceholder: 'Search events...',
      emptyMessage: 'No events found',
      emptyDescription: 'Create your first event',
      // Event specific
      venue: 'Venue',
      venueAr: 'Arabic Venue',
      venueEn: 'English Venue',
      eventType: 'Event Type',
      eventTypeAr: 'Arabic Event Type',
      eventTypeEn: 'English Event Type',
      capacity: 'Capacity',
      noLimit: 'No limit',
      // Event Status
      eventStatus: 'Event Status',
      publishStatus: 'Publish Status',
      upcoming: 'Upcoming',
      ongoing: 'Ongoing',
      past: 'Past',
      cancelled: 'Cancelled',
      // Statistics
      totalEvents: 'Total Events',
      upcomingEvents: 'Upcoming Events',
      futureEvents: 'Future events',
      publishedEvents: 'Published events',
      featuredEvents: 'Featured events',
      // Filters
      eventStatusFilter: 'Event Status',
      publishStatusFilter: 'Publish Status'
    },

    // User Management
    users: {
      title: 'User Management',
      description: 'Manage system users and their permissions',
      createNew: 'New User',
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
      // Enhanced features
      user: 'User',
      toggleStatus: 'Toggle Status',
      activateSuccess: 'User activated successfully',
      deactivateSuccess: 'User deactivated successfully',
      toggleStatusError: 'Failed to toggle user status',
      cannotDeleteSuperAdmin: 'Cannot delete super admin user',
      searchPlaceholder: 'Search users...',
      emptyMessage: 'No users found',
      emptyDescription: 'Create your first user account',
      unknown: 'Unknown',
      // Status
      active: 'Active',
      inactive: 'Inactive',
      created: 'Created',
      lastUpdated: 'Last Updated',
      // Roles
      roles: {
        SUPER_ADMIN: 'Super Admin',
        ADMIN: 'Admin',
        EDITOR: 'Editor',
        AUTHOR: 'Author',
        VIEWER: 'Viewer',
        USER: 'User'
      },
      // Statistics
      totalUsers: 'Total Users',
      activeUsers: 'Active Users',
      activeAccounts: 'Active accounts',
      administrators: 'Administrators',
      systemAdministrators: 'System administrators',
      contentCreators: 'Content Creators',
      authorsAndEditors: 'Authors and editors',
      // Filters
      roleFilter: 'Role',
      statusFilter: 'Status'
    },

    // Categories Management
    categories: {
      title: 'Categories Management',
      description: 'Organize your content with categories and subcategories',
      createNew: 'New Category',
      editCategory: 'Edit Category',
      categoriesList: 'Categories List',
      categoryDetails: 'Category Details',
      addCategory: 'Add Category',
      deleteConfirm: 'Are you sure you want to delete this category?',
      searchPlaceholder: 'Search categories...',
      emptyMessage: 'No categories found',
      emptyDescription: 'Create your first category to organize content',
      cannotDeleteWithContent: 'Cannot delete category with subcategories or content',
      // Category specific
      category: 'Category',
      type: 'Type',
      slug: 'Slug',
      usage: 'Usage',
      items: 'items',
      subcategories: 'Subcategories',
      parent: 'Parent',
      noCategory: 'No Category',
      // Types
      types: {
        NEWS: 'News',
        PROGRAMS: 'Programs',
        EVENTS: 'Events',
        PAGES: 'Pages',
        GENERAL: 'General'
      },
      // Usage breakdown
      newsCount: 'News',
      programsCount: 'Programs',
      eventsCount: 'Events',
      pagesCount: 'Pages',
      // Statistics
      totalCategories: 'Total Categories',
      newsCategories: 'News Categories',
      organizeNews: 'For organizing news',
      programCategories: 'Program Categories',
      organizePrograms: 'For organizing programs',
      parentCategories: 'Parent Categories',
      withoutParent: 'Without parent category',
      // Filters
      typeFilter: 'Type',
      hierarchyFilter: 'Hierarchy',
      parentCategoriesFilter: 'Parent Categories',
      subcategoriesFilter: 'Subcategories'
    },

    // Pages Management
    pages: {
      title: 'Pages Management',
      description: 'Manage static pages, policies, and informational content',
      createNew: 'New Page',
      editPage: 'Edit Page',
      pagesList: 'Pages List',
      pageDetails: 'Page Details',
      addPage: 'Add Page',
      deleteConfirm: 'Are you sure you want to delete this page?',
      searchPlaceholder: 'Search pages...',
      emptyMessage: 'No pages found',
      emptyDescription: 'Create your first static page',
      // Enhanced features
      publish: 'Publish',
      unpublish: 'Unpublish',
      submitForReview: 'Submit for Review',
      publishSuccess: 'Page published successfully',
      unpublishSuccess: 'Page unpublished successfully',
      submitReviewSuccess: 'Page submitted for review successfully',
      publishError: 'Failed to publish page',
      unpublishError: 'Failed to unpublish page',
      submitReviewError: 'Failed to submit for review',
      // Page specific
      page: 'Page',
      template: 'Template',
      visibility: 'Visibility',
      pageType: 'Page Type',
      // Templates
      default: 'Default',
      landing: 'Landing Page',
      policy: 'Policy',
      about: 'About',
      contact: 'Contact',
      // Visibility
      public: 'Public',
      private: 'Private',
      restricted: 'Restricted',
      // Statistics
      totalPages: 'Total Pages',
      publishedPages: 'Published pages',
      draftPages: 'Draft pages',
      policyPages: 'Policy pages',
      // Filters
      templateFilter: 'Template',
      visibilityFilter: 'Visibility',
      statusFilter: 'Status'
    },

    // Partners Management
    partners: {
      title: 'Partners Management',
      description: 'Manage organizational partners, sponsors, and collaborators',
      createNew: 'New Partner',
      editPartner: 'Edit Partner',
      partnersList: 'Partners List',
      partnerDetails: 'Partner Details',
      addPartner: 'Add Partner',
      deleteConfirm: 'Are you sure you want to delete this partner?',
      searchPlaceholder: 'Search partners...',
      emptyMessage: 'No partners found',
      emptyDescription: 'Add your first organization partner',
      // Partner specific
      partner: 'Partner',
      organization: 'Organization',
      partnerType: 'Partnership Type',
      website: 'Website',
      logo: 'Logo',
      contact: 'Contact',
      email: 'Email',
      phone: 'Phone',
      // Partner Types
      sponsor: 'Sponsor',
      collaborator: 'Collaborator',
      supplier: 'Supplier',
      client: 'Client',
      strategic: 'Strategic',
      // Statistics
      totalPartners: 'Total Partners',
      featuredPartners: 'Featured partners',
      activePartners: 'Active partners',
      sponsorPartners: 'Sponsor partners',
      // Filters
      typeFilter: 'Partnership Type',
      statusFilter: 'Status',
      featuredFilter: 'Featured'
    },

    // FAQ Management
    faq: {
      title: 'FAQ Management',
      description: 'Manage frequently asked questions and answers',
      createNew: 'New Question',
      editFAQ: 'Edit Question',
      faqList: 'Questions List',
      faqDetails: 'Question Details',
      addFAQ: 'Add Question',
      deleteConfirm: 'Are you sure you want to delete this question?',
      searchPlaceholder: 'Search questions and answers...',
      emptyMessage: 'No questions found',
      emptyDescription: 'Add your first FAQ question',
      // Enhanced features
      publish: 'Publish',
      unpublish: 'Unpublish',
      submitForReview: 'Submit for Review',
      publishSuccess: 'Question published successfully',
      unpublishSuccess: 'Question unpublished successfully',
      submitReviewSuccess: 'Question submitted for review successfully',
      publishError: 'Failed to publish question',
      unpublishError: 'Failed to unpublish question',
      submitReviewError: 'Failed to submit for review',
      // FAQ specific
      question: 'Question',
      questionAr: 'Arabic Question',
      questionEn: 'English Question',
      answer: 'Answer',
      answerAr: 'Arabic Answer',
      answerEn: 'English Answer',
      faqCategory: 'FAQ Category',
      priority: 'Priority',
      helpfulness: 'Helpfulness',
      views: 'Views',
      // Priority levels
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      // Categories
      general: 'General',
      technical: 'Technical',
      account: 'Account',
      billing: 'Billing',
      support: 'Support',
      // Statistics
      totalFAQ: 'Total FAQ',
      publishedFAQ: 'Published questions',
      draftFAQ: 'Draft questions',
      highPriorityFAQ: 'High priority questions',
      // Filters
      categoryFilter: 'Category',
      priorityFilter: 'Priority',
      statusFilter: 'Status'
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
  let current: Record<string, unknown> = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key] as Record<string, unknown>;
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
