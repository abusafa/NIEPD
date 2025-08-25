'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// Available languages
export type Language = 'en' | 'ar';

// Language context type
interface LanguageContextType {
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}

// Context initialization
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
    refresh: 'تحديث',
    filters: 'الفلاتر',

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
      title: 'اللوحة الرئيسية',
      welcome: 'مرحباً بك في نظام إدارة المحتوى',
      overview: 'نظرة عامة',
      recentActivity: 'النشاط الأخير',
      quickActions: 'إجراءات سريعة',
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
      draftContent: 'المسودات'
    },

    // Content Management
    content: {
      title: 'العنوان',
      slug: 'الرابط الدائم',
      author: 'المؤلف',
      category: 'التصنيف',
      categories: 'التصنيفات',
      tag: 'الوسم',
      tags: 'الوسوم',
      createdAt: 'تاريخ الإنشاء',
      updatedAt: 'تاريخ التحديث',
      publishedAt: 'تاريخ النشر',
      status: 'الحالة',
      featured: 'مميز',
      draft: 'مسودة',
      published: 'منشور',
      scheduled: 'مجدول',
      archived: 'مؤرشف',
      content: 'المحتوى',
      description: 'الوصف',
      summary: 'الملخص',
      image: 'الصورة',
      images: 'الصور',
      file: 'الملف',
      files: 'الملفات',
      media: 'الوسائط',
      attachment: 'مرفق',
      attachments: 'مرفقات',
      link: 'رابط',
      links: 'روابط',
      dateRange: 'نطاق التاريخ',
      startDate: 'تاريخ البدء',
      endDate: 'تاريخ الانتهاء',
      location: 'الموقع'
    },

    // Validation
    validation: {
      required: 'هذا الحقل مطلوب',
      email: 'يرجى إدخال بريد إلكتروني صحيح',
      username: 'الاسم يمكن أن يحتوي فقط على حروف، أرقام، نقاط، شرطات سفلية وشرطات',
      passwordLength: 'كلمة المرور يجب أن تكون على الأقل {length} أحرف',
      passwordMatch: 'كلمتي المرور غير متطابقتين',
      dateFormat: 'صيغة التاريخ غير صحيحة',
      phoneFormat: 'صيغة رقم الهاتف غير صحيحة',
      urlFormat: 'صيغة الرابط غير صحيحة',
      numberOnly: 'يرجى إدخال أرقام فقط',
      minValue: 'القيمة يجب أن تكون على الأقل {min}',
      maxValue: 'القيمة يجب أن تكون أقل من {max}',
      minLength: 'يجب أن يكون الطول على الأقل {min} أحرف',
      maxLength: 'يجب أن يكون الطول أقل من {max} أحرف'
    },

    // Users management
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
      totalCount: 'العدد الإجمالي',
      // Filters
      roleFilter: 'تصفية حسب الدور',
      statusFilter: 'تصفية حسب الحالة',
      allRoles: 'جميع الأدوار',
      allStatus: 'جميع الحالات',
      // New additions for user creation
      createUser: 'إنشاء مستخدم جديد',
      createUserDesc: 'قم بإنشاء حساب مستخدم جديد وتحديد صلاحياته في النظام',
      basicInfo: 'المعلومات الأساسية',
      firstNamePlaceholder: 'أدخل الاسم الأول',
      lastNamePlaceholder: 'أدخل الاسم الأخير',
      emailPlaceholder: 'أدخل البريد الإلكتروني',
      usernamePlaceholder: 'أدخل اسم المستخدم',
      usernameHelper: 'يمكن استخدام الحروف والأرقام والنقاط والشرطات فقط',
      security: 'الأمان',
      passwordPlaceholder: 'أدخل كلمة المرور',
      confirmPasswordPlaceholder: 'تأكيد كلمة المرور',
      passwordHelper: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل',
      permissions: 'الصلاحيات والحالة',
      accountActive: 'الحساب نشط',
      accountActiveHelper: 'المستخدمون غير النشطين لا يمكنهم تسجيل الدخول إلى النظام',
      roleReference: 'مرجع الأدوار والصلاحيات',
      securityNotice: 'تنبيه أمني',
      securityTip1: 'منح دور المدير العام فقط للأشخاص الموثوق بهم',
      securityTip2: 'سيتم إرسال إشعار للمستخدم عند إنشاء حسابه',
      securityTip3: 'تغيير دور المستخدم سيؤثر على صلاحياته فوراً',
      securityTip4: 'سيتم إرسال إشعار للمستخدم عند تعديل حسابه',
      securityTip5: 'تغيير كلمة المرور سيتطلب من المستخدم تسجيل الدخول مرة أخرى',
      securityTip6: 'إلغاء تفعيل المستخدم سيمنع وصوله فوراً',
      createSuccess: 'تم إنشاء المستخدم بنجاح',
      createFailed: 'فشل في إنشاء المستخدم',
      createError: 'حدث خطأ أثناء إنشاء المستخدم',
      // Edit page specific
      editUserDesc: 'تحديث معلومات المستخدم وصلاحياته',
      loadUserError: 'فشل في تحميل بيانات المستخدم',
      updateSuccess: 'تم تحديث المستخدم بنجاح',
      updateFailed: 'فشل في تحديث المستخدم',
      updateError: 'حدث خطأ أثناء تحديث المستخدم',
      passwordManagement: 'إدارة كلمة المرور',
      changePassword: 'تغيير كلمة المرور',
      changePasswordHelper: 'حدد هذا لتعيين كلمة مرور جديدة للمستخدم',
      newPassword: 'كلمة المرور الجديدة',
      confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
      // View page specific
      userProfile: 'ملف المستخدم',
      userProfileDesc: 'عرض وإدارة حساب المستخدم',
      userNotFound: 'المستخدم غير موجود',
      userNotFoundDesc: 'المستخدم المطلوب غير موجود',
      rolePermissions: 'صلاحيات الدور',
      currentRole: 'الدور الحالي',
      contentContributions: 'مساهمات المحتوى',
      newsArticles: 'مقالات إخبارية',
      programs: 'البرامج',
      events: 'الفعاليات',
      pages: 'الصفحات',
      totalContentCreated: 'إجمالي المحتوى المنشأ',
      items: 'عنصر',
      activityTimeline: 'الجدول الزمني للنشاط',
      accountCreated: 'تم إنشاء الحساب',
      profileUpdated: 'تم تحديث الملف الشخصي',
      accountStatus: 'حالة الحساب',
      memberSince: 'عضو منذ',
      contactInformation: 'معلومات التواصل',
      quickActions: 'إجراءات سريعة',
      editProfile: 'تعديل الملف الشخصي',
      sendEmail: 'إرسال بريد إلكتروني',
      activateUser: 'تفعيل المستخدم',
      deactivateUser: 'إلغاء تفعيل المستخدم',
      deleteUser: 'حذف المستخدم',
      activate: 'تفعيل',
      deactivate: 'إلغاء تفعيل',
      activateConfirm: 'هل أنت متأكد من تفعيل هذا المستخدم؟',
      deactivateConfirm: 'هل أنت متأكد من إلغاء تفعيل هذا المستخدم؟',
      deleteSuccess: 'تم حذف المستخدم بنجاح',
      deleteError: 'فشل في حذف المستخدم'
    },

    // Partners management
    partners: {
      title: 'إدارة الشركاء',
      description: 'إدارة الشركاء والرعاة',
      createNew: 'شريك جديد',
      editPartner: 'تعديل الشريك',
      partnersList: 'قائمة الشركاء',
      partnerDetails: 'تفاصيل الشريك',
      addPartner: 'إضافة شريك',
      deleteConfirm: 'هل أنت متأكد من حذف هذا الشريك؟',
      name: 'اسم الشريك',
      nameAr: 'الاسم بالعربية',
      nameEn: 'الاسم بالإنجليزية',
      logo: 'الشعار',
      website: 'الموقع الإلكتروني',
      type: 'نوع الشراكة',
      order: 'الترتيب',
      featured: 'مميز',
      partnershipStartDate: 'تاريخ بدء الشراكة',
      partnershipEndDate: 'تاريخ انتهاء الشراكة'
    },

    // FAQ management
    faq: {
      title: 'الأسئلة الشائعة',
      description: 'إدارة الأسئلة الشائعة والإجابات',
      createNew: 'سؤال جديد',
      editFaq: 'تعديل السؤال',
      faqList: 'قائمة الأسئلة',
      faqDetails: 'تفاصيل السؤال',
      addFaq: 'إضافة سؤال',
      deleteConfirm: 'هل أنت متأكد من حذف هذا السؤال؟',
      question: 'السؤال',
      answer: 'الإجابة',
      category: 'التصنيف',
      order: 'الترتيب',
      status: 'الحالة',
      active: 'نشط',
      inactive: 'غير نشط',
      questionAr: 'السؤال بالعربية',
      questionEn: 'السؤال بالإنجليزية',
      answerAr: 'الإجابة بالعربية',
      answerEn: 'الإجابة بالإنجليزية'
    },

    // Contact messages
    contact: {
      title: 'رسائل التواصل',
      description: 'إدارة رسائل التواصل والاستفسارات',
      messagesList: 'قائمة الرسائل',
      messageDetails: 'تفاصيل الرسالة',
      deleteConfirm: 'هل أنت متأكد من حذف هذه الرسالة؟',
      senderName: 'اسم المرسل',
      senderEmail: 'البريد الإلكتروني للمرسل',
      senderPhone: 'رقم هاتف المرسل',
      subject: 'الموضوع',
      message: 'الرسالة',
      receivedAt: 'تاريخ الاستلام',
      status: 'الحالة',
      read: 'مقروءة',
      unread: 'غير مقروءة',
      replied: 'تم الرد',
      markAsRead: 'تحديد كمقروء',
      markAsUnread: 'تحديد كغير مقروء',
      sendReply: 'إرسال رد',
      replyMessage: 'رسالة الرد',
      noMessages: 'لا توجد رسائل',
      allMessages: 'جميع الرسائل',
      newMessages: 'الرسائل الجديدة',
      readMessages: 'الرسائل المقروءة',
      repliedMessages: 'الرسائل المجاب عليها'
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
    refresh: 'Refresh',
    filters: 'Filters',

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
      slug: 'Slug',
      author: 'Author',
      category: 'Category',
      categories: 'Categories',
      tag: 'Tag',
      tags: 'Tags',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
      publishedAt: 'Published At',
      status: 'Status',
      featured: 'Featured',
      draft: 'Draft',
      published: 'Published',
      scheduled: 'Scheduled',
      archived: 'Archived',
      content: 'Content',
      description: 'Description',
      summary: 'Summary',
      image: 'Image',
      images: 'Images',
      file: 'File',
      files: 'Files',
      media: 'Media',
      attachment: 'Attachment',
      attachments: 'Attachments',
      link: 'Link',
      links: 'Links',
      dateRange: 'Date Range',
      startDate: 'Start Date',
      endDate: 'End Date',
      location: 'Location'
    },

    // Validation
    validation: {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      username: 'Username can only contain letters, numbers, dots, underscores, and hyphens',
      passwordLength: 'Password must be at least {length} characters long',
      passwordMatch: 'Passwords do not match',
      dateFormat: 'Invalid date format',
      phoneFormat: 'Invalid phone number format',
      urlFormat: 'Invalid URL format',
      numberOnly: 'Please enter numbers only',
      minValue: 'Value must be at least {min}',
      maxValue: 'Value must be less than {max}',
      minLength: 'Length must be at least {min} characters',
      maxLength: 'Length must be less than {max} characters'
    },

    // Users management
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
      totalCount: 'Total count',
      // Filters
      roleFilter: 'Filter by Role',
      statusFilter: 'Filter by Status',
      allRoles: 'All Roles',
      allStatus: 'All Status',
      // New additions for user creation
      createUser: 'Create New User',
      createUserDesc: 'Create a new user account and assign appropriate permissions',
      basicInfo: 'Basic Information',
      firstNamePlaceholder: 'Enter first name',
      lastNamePlaceholder: 'Enter last name',
      emailPlaceholder: 'Enter email address',
      usernamePlaceholder: 'Enter username',
      usernameHelper: 'Only letters, numbers, dots, underscores and hyphens allowed',
      security: 'Security',
      passwordPlaceholder: 'Enter password',
      confirmPasswordPlaceholder: 'Confirm password',
      passwordHelper: 'Password must be at least 8 characters long',
      permissions: 'Permissions & Status',
      accountActive: 'Account is active',
      accountActiveHelper: 'Inactive users cannot log in to the system',
      roleReference: 'Role Permissions Reference',
      securityNotice: 'Security Notice',
      securityTip1: 'Only assign Super Admin role to trusted personnel',
      securityTip2: 'Users will receive a notification when their account is created',
      securityTip3: 'Changing a user\'s role takes effect immediately',
      securityTip4: 'Users will receive a notification when their account is modified',
      securityTip5: 'Password changes will require the user to log in again',
      securityTip6: 'Deactivating a user will immediately revoke their access',
      createSuccess: 'User created successfully',
      createFailed: 'Failed to create user',
      createError: 'An error occurred while creating the user',
      // Edit page specific
      editUserDesc: 'Update user account information and permissions',
      loadUserError: 'Failed to load user data',
      updateSuccess: 'User updated successfully',
      updateFailed: 'Failed to update user',
      updateError: 'An error occurred while updating the user',
      passwordManagement: 'Password Management',
      changePassword: 'Change Password',
      changePasswordHelper: 'Check this to set a new password for the user',
      newPassword: 'New Password',
      confirmNewPassword: 'Confirm New Password',
      // View page specific
      userProfile: 'User Profile',
      userProfileDesc: 'View and manage user account',
      userNotFound: 'User not found',
      userNotFoundDesc: 'The requested user could not be found',
      rolePermissions: 'Role Permissions',
      currentRole: 'Current Role',
      contentContributions: 'Content Contributions',
      newsArticles: 'News Articles',
      programs: 'Programs',
      events: 'Events',
      pages: 'Pages',
      totalContentCreated: 'Total Content Created',
      items: 'items',
      activityTimeline: 'Activity Timeline',
      accountCreated: 'Account Created',
      profileUpdated: 'Profile Updated',
      accountStatus: 'Account Status',
      memberSince: 'Member Since',
      contactInformation: 'Contact Information',
      quickActions: 'Quick Actions',
      editProfile: 'Edit Profile',
      sendEmail: 'Send Email',
      activateUser: 'Activate User',
      deactivateUser: 'Deactivate User',
      deleteUser: 'Delete User',
      activate: 'Activate',
      deactivate: 'Deactivate',
      activateConfirm: 'Are you sure you want to activate this user?',
      deactivateConfirm: 'Are you sure you want to deactivate this user?',
      deleteSuccess: 'User deleted successfully',
      deleteError: 'Failed to delete user'
    },

    // Partners management
    partners: {
      title: 'Partners Management',
      description: 'Manage partners and sponsors',
      createNew: 'New Partner',
      editPartner: 'Edit Partner',
      partnersList: 'Partners List',
      partnerDetails: 'Partner Details',
      addPartner: 'Add Partner',
      deleteConfirm: 'Are you sure you want to delete this partner?',
      name: 'Partner Name',
      nameAr: 'Name in Arabic',
      nameEn: 'Name in English',
      logo: 'Logo',
      website: 'Website',
      type: 'Partnership Type',
      order: 'Order',
      featured: 'Featured',
      partnershipStartDate: 'Partnership Start Date',
      partnershipEndDate: 'Partnership End Date'
    },

    // FAQ management
    faq: {
      title: 'Frequently Asked Questions',
      description: 'Manage frequently asked questions and answers',
      createNew: 'New Question',
      editFaq: 'Edit Question',
      faqList: 'Questions List',
      faqDetails: 'Question Details',
      addFaq: 'Add Question',
      deleteConfirm: 'Are you sure you want to delete this question?',
      question: 'Question',
      answer: 'Answer',
      category: 'Category',
      order: 'Order',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      questionAr: 'Question in Arabic',
      questionEn: 'Question in English',
      answerAr: 'Answer in Arabic',
      answerEn: 'Answer in English'
    },

    // Contact messages
    contact: {
      title: 'Contact Messages',
      description: 'Manage contact messages and inquiries',
      messagesList: 'Messages List',
      messageDetails: 'Message Details',
      deleteConfirm: 'Are you sure you want to delete this message?',
      senderName: 'Sender Name',
      senderEmail: 'Sender Email',
      senderPhone: 'Sender Phone',
      subject: 'Subject',
      message: 'Message',
      receivedAt: 'Received At',
      status: 'Status',
      read: 'Read',
      unread: 'Unread',
      replied: 'Replied',
      markAsRead: 'Mark as Read',
      markAsUnread: 'Mark as Unread',
      sendReply: 'Send Reply',
      replyMessage: 'Reply Message',
      noMessages: 'No Messages',
      allMessages: 'All Messages',
      newMessages: 'New Messages',
      readMessages: 'Read Messages',
      repliedMessages: 'Replied Messages'
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
const getNestedTranslation = (obj: Translation, path: string[]): string => {
  let current: string | Translation = obj;
  
  for (const key of path) {
    if (typeof current === 'string' || current === undefined) {
      return key;
    }
    current = current[key] || key;
  }
  
  return typeof current === 'string' ? current : path[path.length - 1];
};

// Helper to replace params in translation strings
const replaceParams = (text: string, params?: Record<string, string | number>): string => {
  if (!params) return text;
  
  let result = text;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }
  
  return result;
};

// Language Provider Component
interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Load language preference from localStorage on mount
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'ar' || savedLang === 'en') {
      setCurrentLang(savedLang);
      setIsRTL(savedLang === 'ar');
    }
  }, []);

  useEffect(() => {
    // Update document direction based on language
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    
    // Add RTL class to body if arabic
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [isRTL, currentLang]);

  // Function to change language
  const setLanguage = (lang: Language) => {
    setCurrentLang(lang);
    setIsRTL(lang === 'ar');
    localStorage.setItem('language', lang);
  };

  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    const path = key.split('.');
    const translation = getNestedTranslation(translations[currentLang], path);
    return replaceParams(translation, params);
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};