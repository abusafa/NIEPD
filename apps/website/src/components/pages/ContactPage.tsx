'use client'

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  User, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube
} from 'lucide-react';
import { dataService } from '@/lib/api';
import type { ContactInfo } from '@/types';
// Social link type is now available from the API response
import PageHeader from '@/components/PageHeader';

interface ContactPageProps {
  currentLang: 'ar' | 'en';
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// SocialLink interface is imported from dataService

const ContactPage: React.FC<ContactPageProps> = ({ currentLang }) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [touchedFields, setTouchedFields] = useState<{[key: string]: boolean}>({});
  const [formProgress, setFormProgress] = useState(0);
  const [announcements, setAnnouncements] = useState('');

  const content = {
    ar: {
      title: 'تواصل معنا',
      subtitle: 'نحن هنا للإجابة على استفساراتكم ومساعدتكم',
      contactInfoTitle: 'معلومات التواصل',
      contactFormTitle: 'إرسال رسالة',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      subject: 'الموضوع',
      message: 'الرسالة',
      send: 'إرسال الرسالة',
      sending: 'جاري الإرسال...',
      successMessage: 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.',
      errorMessage: 'حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.',
      requiredField: 'هذا الحقل مطلوب',
      invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح',
      office: 'المكتب الرئيسي',
      workingHours: 'ساعات العمل',
      workingHoursValue: 'الأحد - الخميس: 8:00 صباحاً - 5:00 مساءً',
      socialMedia: 'وسائل التواصل الاجتماعي',
      socialMediaDescription: 'تابعونا على منصات التواصل الاجتماعي للحصول على آخر الأخبار والتحديثات',
      loading: 'جاري تحميل معلومات التواصل...',
      errorLoading: 'حدث خطأ في تحميل معلومات التواصل',
    },
    en: {
      title: 'Contact Us',
      subtitle: 'We are here to answer your questions and help you',
      contactInfoTitle: 'Contact Information',
      contactFormTitle: 'Send a Message',
      name: 'Name',
      email: 'Email',
      phone: 'Phone Number',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      successMessage: 'Your message has been sent successfully. We will contact you soon.',
      errorMessage: 'An error occurred while sending the message. Please try again.',
      requiredField: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      office: 'Main Office',
      workingHours: 'Working Hours',
      workingHoursValue: 'Sunday - Thursday: 8:00 AM - 5:00 PM',
      socialMedia: 'Social Media',
      socialMediaDescription: 'Follow us on social media for the latest news and updates',
      loading: 'Loading contact information...',
      errorLoading: 'Error loading contact information',
    }
  };

  const t = content[currentLang];

  // Icon mapping for social media platforms
  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Facebook,
      Twitter,
      Linkedin,
      Instagram,
      Youtube
    };
    return icons[iconName] || Facebook;
  };

  // Parse social links from contact data
  const getSocialLinks = (): any[] => {
    try {
      // Check if data service returned socialLinks from CMS
      const data = dataService as any;
      if (data._lastContactData?.socialLinks && Array.isArray(data._lastContactData.socialLinks)) {
        return data._lastContactData.socialLinks;
      }
      
      // First try to get from contactInfo.socialLinks if it exists and is a string
      if (contactInfo?.socialLinks) {
        if (Array.isArray(contactInfo.socialLinks)) {
          return contactInfo.socialLinks;
        } else if (typeof contactInfo.socialLinks === 'string') {
          const parsed = JSON.parse(contactInfo.socialLinks);
          return Array.isArray(parsed) ? parsed : [];
        }
      }
      
      // Default social links if none found in CMS
      return [
        { 
          platform: 'facebook',
          icon: 'Facebook', 
          label: 'Facebook', 
          url: 'https://facebook.com/NIEPD', 
          color: 'hover:text-blue-600 hover:bg-blue-50' 
        },
        { 
          platform: 'twitter',
          icon: 'Twitter', 
          label: 'Twitter', 
          url: 'https://twitter.com/NIEPD', 
          color: 'hover:text-blue-400 hover:bg-blue-50' 
        },
        { 
          platform: 'linkedin',
          icon: 'Linkedin', 
          label: 'LinkedIn', 
          url: 'https://linkedin.com/company/NIEPD', 
          color: 'hover:text-blue-700 hover:bg-blue-50' 
        },
        { 
          platform: 'instagram',
          icon: 'Instagram', 
          label: 'Instagram', 
          url: 'https://instagram.com/NIEPD', 
          color: 'hover:text-pink-600 hover:bg-pink-50' 
        },
        { 
          platform: 'youtube',
          icon: 'Youtube', 
          label: 'YouTube', 
          url: 'https://youtube.com/@NIEPD', 
          color: 'hover:text-red-600 hover:bg-red-50' 
        }
      ];
    } catch (error) {
      console.warn('Error parsing social links:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dataService.getContactInfo();
        
        // If we get the legacy format from dataService, extract the first contact info
        if (data && data.contactMethods) {
          // Convert legacy format to ContactInfo format
          const email = data.contactMethods.find((m: any) => m.icon === 'Mail')?.valueAr || '';
          const phone = data.contactMethods.find((m: any) => m.icon === 'Phone')?.valueAr || '';
          
          setContactInfo({
            id: 1,
            titleAr: 'معلومات التواصل',
            titleEn: 'Contact Information',
            contentAr: 'نحن متواجدون لمساعدتكم في أي استفسارات حول المعهد وبرامجه',
            contentEn: 'We are available to help you with any inquiries about the institute and its programs',
            email,
            phone,
            address: 'الرياض، المملكة العربية السعودية',
            socialLinks: '',
            status: 'PUBLISHED',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } else {
          // Use default contact info if none available from CMS
          setContactInfo({
            id: 1,
            titleAr: 'معلومات التواصل',
            titleEn: 'Contact Information',
            contentAr: 'نحن متواجدون لمساعدتكم في أي استفسارات حول المعهد وبرامجه',
            contentEn: 'We are available to help you with any inquiries about the institute and its programs',
            email: 'info@niepd.edu.sa',
            phone: '+966 11 123 4567',
            address: 'الرياض، المملكة العربية السعودية',
            socialLinks: '',
            status: 'PUBLISHED',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error('Error fetching contact info:', err);
        setError(t.errorLoading);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, [t.errorLoading]);

  const validateField = (fieldName: string, value: string): string => {
    switch (fieldName) {
      case 'name':
        if (!value.trim()) return t.requiredField;
        if (value.trim().length < 2) return currentLang === 'ar' ? 'الاسم قصير جداً' : 'Name is too short';
        return '';
      case 'email':
        if (!value.trim()) return t.requiredField;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t.invalidEmail;
        return '';
      case 'subject':
        if (!value.trim()) return t.requiredField;
        if (value.trim().length < 3) return currentLang === 'ar' ? 'الموضوع قصير جداً' : 'Subject is too short';
        return '';
      case 'message':
        if (!value.trim()) return t.requiredField;
        if (value.trim().length < 10) return currentLang === 'ar' ? 'الرسالة قصيرة جداً (10 أحرف على الأقل)' : 'Message is too short (minimum 10 characters)';
        return '';
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    const requiredFields = ['name', 'email', 'subject', 'message'];
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field as keyof ContactFormData]);
      if (error) newErrors[field] = error;
    });

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateProgress = (): number => {
    const fields = ['name', 'email', 'subject', 'message'];
    const filledFields = fields.filter(field => 
      formData[field as keyof ContactFormData].trim().length > 0
    );
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation display
    const allFields = ['name', 'email', 'phone', 'subject', 'message'];
    const newTouchedFields = Object.fromEntries(allFields.map(field => [field, true]));
    setTouchedFields(newTouchedFields);

    if (!validateForm()) {
      setFormStatus({
        type: 'error',
        message: currentLang === 'ar' ? 'يرجى تصحيح الأخطاء أدناه' : 'Please correct the errors below',
      });
      return;
    }

    setFormStatus({ type: 'loading', message: t.sending });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setFormStatus({
          type: 'success',
          message: t.successMessage,
        });
        
        // Accessibility announcement
        setAnnouncements(t.successMessage);
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        setFieldErrors({});
        setTouchedFields({});
        setFormProgress(0);
      } else {
        setFormStatus({
          type: 'error',
          message: result.message || t.errorMessage,
        });
      }
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setFormStatus({
        type: 'error',
        message: t.errorMessage,
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation for touched fields
    if (touchedFields[name]) {
      const error = validateField(name, value);
      setFieldErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
    
    // Clear form status when user starts typing
    if (formStatus.type !== 'idle') {
      setFormStatus({ type: 'idle', message: '' });
    }
  };

  const handleFieldBlur = (fieldName: string) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, formData[fieldName as keyof ContactFormData]);
    setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  // Update progress when form data changes
  useEffect(() => {
    const progress = calculateProgress();
    setFormProgress(progress);
  }, [formData]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-neutral-800">{t.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {currentLang === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcements}
      </div>
      
      {/* Page Header */}
      <PageHeader 
        title={t.title}
        subtitle={t.subtitle}
        icon={Mail}
        currentLang={currentLang}
      />
      
      <div className="container mx-auto px-4 py-8 md:py-16">

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-8">
              {t.contactInfoTitle}
            </h2>
              
              {contactInfo && (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-8 space-y-6">
                  <p className="text-neutral-800 leading-relaxed">
                    {currentLang === 'ar' ? contactInfo.contentAr : contactInfo.contentEn}
                  </p>
                  
                  {/* Contact Methods */}
                  <div className="space-y-4">
                    {contactInfo.email && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                          <Mail className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-secondary-900">
                            {currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                          </h3>
                          <a 
                            href={`mailto:${contactInfo.email}`}
                            className="text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            {contactInfo.email}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {contactInfo.phone && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                          <Phone className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-secondary-900">
                            {currentLang === 'ar' ? 'الهاتف' : 'Phone'}
                          </h3>
                          <a 
                            href={`tel:${contactInfo.phone}`}
                            className="text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            {contactInfo.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {contactInfo.address && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-secondary-900">
                            {t.office}
                          </h3>
                          <p className="text-neutral-800">
                            {contactInfo.address}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary-900">
                          {t.workingHours}
                        </h3>
                        <p className="text-neutral-800">
                          {t.workingHoursValue}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Social Media Section */}
                  <div className="border-t border-neutral-100 pt-6 mt-6">
                    <h3 className="font-semibold text-secondary-900 mb-3">
                      {t.socialMedia}
                    </h3>
                    <p className="text-neutral-600 text-sm mb-4">
                      {t.socialMediaDescription}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {getSocialLinks().map((social) => {
                        const Icon = getIconComponent(social.icon);
                        return (
                          <a
                            key={social.platform}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-11 h-11 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 transition-all duration-300 transform hover:scale-105 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${social.color}`}
                            aria-label={`${social.label} - ${currentLang === 'ar' ? 'يفتح في نافذة جديدة' : 'Opens in new window'}`}
                          >
                            <Icon className="w-5 h-5" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-8">
              {t.contactFormTitle}
            </h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4 md:p-8 relative overflow-hidden contact-form-container">
              {/* Form Progress Bar */}
              {formProgress > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-secondary-900">
                      {currentLang === 'ar' ? 'تقدم النموذج' : 'Form Progress'}
                    </span>
                    <span className="text-sm text-primary-600 font-medium">
                      {formProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${formProgress}%` }}
                    />
                  </div>
                </div>
              )}
              
              <form 
                onSubmit={handleSubmit} 
                className="space-y-6" 
                role="form" 
                aria-label={currentLang === 'ar' ? 'نموذج التواصل' : 'Contact form'}
                noValidate
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label 
                      htmlFor="name" 
                      className={`block text-sm font-medium mb-2 transition-colors ${
                        fieldErrors.name ? 'text-red-600' : 'text-secondary-900'
                      }`}
                    >
                      {t.name} *
                    </label>
                    <div className="relative group">
                      <User className={`absolute top-3 w-5 h-5 transition-colors ${
                        fieldErrors.name 
                          ? 'text-red-400' 
                          : formData.name 
                          ? 'text-primary-500' 
                          : 'text-neutral-600'
                      } ${currentLang === 'ar' ? 'right-3' : 'left-3'}`} />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur('name')}
                        className={`w-full py-3 border rounded-lg focus:outline-none transition-all duration-200 transform hover:scale-[1.01] focus:scale-[1.01] ${
                          fieldErrors.name
                            ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50'
                            : formData.name
                            ? 'border-primary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-primary-50/30'
                            : 'border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                        } ${currentLang === 'ar' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'}`}
                        dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
                        placeholder={currentLang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                        aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                      />
                      {formData.name && !fieldErrors.name && (
                        <CheckCircle className={`absolute top-3 w-5 h-5 text-green-500 ${currentLang === 'ar' ? 'left-3' : 'right-3'}`} />
                      )}
                    </div>
                    {fieldErrors.name && touchedFields.name && (
                      <div className="mt-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <p id="name-error" className="text-sm text-red-600 animate-fadeIn">
                          {fieldErrors.name}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative">
                    <label 
                      htmlFor="email" 
                      className={`block text-sm font-medium mb-2 transition-colors ${
                        fieldErrors.email ? 'text-red-600' : 'text-secondary-900'
                      }`}
                    >
                      {t.email} *
                    </label>
                    <div className="relative group">
                      <Mail className={`absolute top-3 w-5 h-5 transition-colors ${
                        fieldErrors.email 
                          ? 'text-red-400' 
                          : formData.email 
                          ? 'text-primary-500' 
                          : 'text-neutral-600'
                      } ${currentLang === 'ar' ? 'right-3' : 'left-3'}`} />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur('email')}
                        className={`w-full py-3 border rounded-lg focus:outline-none transition-all duration-200 transform hover:scale-[1.01] focus:scale-[1.01] ${
                          fieldErrors.email
                            ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50'
                            : formData.email
                            ? 'border-primary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-primary-50/30'
                            : 'border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                        } ${currentLang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                        dir="ltr"
                        placeholder={currentLang === 'ar' ? 'example@domain.com' : 'your.email@example.com'}
                        aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                      />
                      {formData.email && !fieldErrors.email && (
                        <CheckCircle className={`absolute top-3 w-5 h-5 text-green-500 ${currentLang === 'ar' ? 'left-3' : 'right-3'}`} />
                      )}
                    </div>
                    {fieldErrors.email && touchedFields.email && (
                      <div className="mt-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <p id="email-error" className="text-sm text-red-600 animate-fadeIn">
                          {fieldErrors.email}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  <label 
                    htmlFor="phone" 
                    className="block text-sm font-medium text-secondary-900 mb-2"
                  >
                    {t.phone}
                  </label>
                  <div className="relative group">
                    <Phone className={`absolute top-3 w-5 h-5 transition-colors ${
                      formData.phone ? 'text-primary-500' : 'text-neutral-700'
                    } ${currentLang === 'ar' ? 'right-3' : 'left-3'}`} />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('phone')}
                      className={`w-full py-3 border rounded-lg focus:outline-none transition-all duration-200 transform hover:scale-[1.01] focus:scale-[1.01] ${
                        formData.phone
                          ? 'border-primary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-primary-50/30'
                          : 'border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                      } ${currentLang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                      dir="ltr"
                      placeholder={currentLang === 'ar' ? '+966 50 123 4567' : '+966 50 123 4567'}
                    />
                    {formData.phone && (
                      <CheckCircle className={`absolute top-3 w-5 h-5 text-green-500 ${currentLang === 'ar' ? 'left-3' : 'right-3'}`} />
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  <label 
                    htmlFor="subject" 
                    className={`block text-sm font-medium mb-2 transition-colors ${
                                              fieldErrors.subject ? 'text-red-600' : 'text-secondary-900'
                    }`}
                  >
                    {t.subject} *
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('subject')}
                      className={`w-full py-3 px-4 border rounded-lg focus:outline-none transition-all duration-200 transform hover:scale-[1.01] focus:scale-[1.01] ${
                        fieldErrors.subject
                          ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50'
                          : formData.subject
                          ? 'border-primary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-primary-50/30'
                          : 'border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                      } ${currentLang === 'ar' ? 'text-right' : 'text-left'}`}
                      dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
                      placeholder={currentLang === 'ar' ? 'موضوع رسالتك' : 'What is your message about?'}
                      aria-describedby={fieldErrors.subject ? 'subject-error' : undefined}
                    />
                    {formData.subject && !fieldErrors.subject && (
                      <CheckCircle className={`absolute top-3 w-5 h-5 text-green-500 ${currentLang === 'ar' ? 'left-4' : 'right-4'}`} />
                    )}
                  </div>
                  {fieldErrors.subject && touchedFields.subject && (
                    <div className="mt-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p id="subject-error" className="text-sm text-red-600 animate-fadeIn">
                        {fieldErrors.subject}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <label 
                    htmlFor="message" 
                    className={`block text-sm font-medium mb-2 transition-colors ${
                                              fieldErrors.message ? 'text-red-600' : 'text-secondary-900'
                    }`}
                  >
                    {t.message} *
                  </label>
                  <div className="relative group">
                    <MessageSquare className={`absolute top-3 w-5 h-5 transition-colors ${
                      fieldErrors.message 
                        ? 'text-red-400' 
                        : formData.message 
                        ? 'text-primary-500' 
                        : 'text-neutral-400'
                    } ${currentLang === 'ar' ? 'right-3' : 'left-3'}`} />
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('message')}
                      rows={6}
                      className={`w-full py-3 border rounded-lg focus:outline-none resize-vertical transition-all duration-200 transform hover:scale-[1.005] focus:scale-[1.005] ${
                        fieldErrors.message
                          ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50'
                          : formData.message
                          ? 'border-primary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-primary-50/30'
                          : 'border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                      } ${currentLang === 'ar' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'}`}
                      dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
                      placeholder={currentLang === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                      aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                    />
                    {formData.message && !fieldErrors.message && formData.message.length >= 10 && (
                      <CheckCircle className={`absolute top-3 w-5 h-5 text-green-500 ${currentLang === 'ar' ? 'left-3' : 'right-3'}`} />
                    )}
                    {formData.message && (
                      <div className={`absolute bottom-3 text-xs text-neutral-700 ${currentLang === 'ar' ? 'left-3' : 'right-3'}`}>
                        {formData.message.length}/2000
                      </div>
                    )}
                  </div>
                  {fieldErrors.message && touchedFields.message && (
                    <div className="mt-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p id="message-error" className="text-sm text-red-600 animate-fadeIn">
                        {fieldErrors.message}
                      </p>
                    </div>
                  )}
                </div>

                {/* Form Status */}
                {formStatus.type !== 'idle' && (
                  <div className={`p-4 rounded-lg flex items-center gap-3 animate-slideDown transform transition-all duration-300 ${
                    formStatus.type === 'success' 
                      ? 'bg-green-50 border border-green-200 text-green-700 shadow-green-100 shadow-sm' 
                      : formStatus.type === 'error'
                      ? 'bg-red-50 border border-red-200 text-red-700 shadow-red-100 shadow-sm'
                      : 'bg-blue-50 border border-blue-200 text-blue-700 shadow-blue-100 shadow-sm'
                  }`}>
                    {formStatus.type === 'success' && (
                      <CheckCircle className="w-5 h-5 animate-pulse" />
                    )}
                    {formStatus.type === 'error' && (
                      <AlertCircle className="w-5 h-5 animate-pulse" />
                    )}
                    {formStatus.type === 'loading' && (
                      <Loader className="w-5 h-5 animate-spin" />
                    )}
                    <p className="flex-1">{formStatus.message}</p>
                    {formStatus.type === 'success' && (
                      <div className="text-green-600 animate-bounce">✨</div>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <div className="relative">
                  <button
                    type="submit"
                    disabled={formStatus.type === 'loading' || formStatus.type === 'success'}
                    className={`w-full py-4 px-6 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 transform flex items-center justify-center gap-2 relative overflow-hidden ${
                      formStatus.type === 'loading'
                        ? 'bg-primary-400 cursor-wait scale-95 text-white'
                        : formStatus.type === 'success'
                        ? 'bg-green-500 text-white cursor-default scale-105 shadow-lg shadow-green-200'
                        : 'bg-primary-600 hover:bg-primary-700 hover:scale-105 hover:shadow-lg hover:shadow-primary-200 text-white active:scale-95'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {/* Button Background Animation */}
                    {formStatus.type === 'loading' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-700 animate-pulse" />
                    )}
                    
                    {/* Button Content */}
                    <div className="relative z-10 flex items-center gap-2">
                      {formStatus.type === 'loading' ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          <span className="animate-pulse">{t.sending}</span>
                        </>
                      ) : formStatus.type === 'success' ? (
                        <>
                          <CheckCircle className="w-5 h-5 animate-bounce" />
                          <span>{currentLang === 'ar' ? 'تم الإرسال بنجاح' : 'Sent Successfully'}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                          <span>{t.send}</span>
                        </>
                      )}
                    </div>

                    {/* Ripple Effect */}
                    {formStatus.type !== 'loading' && formStatus.type !== 'success' && (
                      <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 rounded-lg transition-opacity duration-150" />
                    )}
                  </button>

                  {/* Form Progress Indicator */}
                  {formProgress > 0 && formProgress < 100 && formStatus.type === 'idle' && (
                    <div className="mt-2 text-center">
                      <span className="text-xs text-neutral-700">
                        {currentLang === 'ar' 
                          ? `املأ ${Math.ceil((4 - (formProgress / 25))) > 0 ? Math.ceil(4 - (formProgress / 25)) : 0} من الحقول المتبقية`
                          : `${Math.ceil(4 - (formProgress / 25)) > 0 ? Math.ceil(4 - (formProgress / 25)) : 'All'} more field${Math.ceil(4 - (formProgress / 25)) !== 1 ? 's' : ''} to go`
                        }
                      </span>
                    </div>
                  )}

                  {formProgress === 100 && formStatus.type === 'idle' && (
                    <div className="mt-2 text-center">
                      <span className="text-sm text-green-600 font-medium animate-pulse">
                        {currentLang === 'ar' ? '✨ جاهز للإرسال!' : '✨ Ready to send!'}
                      </span>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ContactPage;
