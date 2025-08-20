'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bug, 
  AlertTriangle, 
  X, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Mail, 
  Phone,
  Monitor,
  MessageCircle,
  FileText,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/contexts/AppContext';

interface ErrorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorInfo?: {
    errorType?: 'USER_REPORTED' | 'JAVASCRIPT_ERROR' | 'API_ERROR' | 'UI_BUG';
    errorStack?: string;
    pageUrl?: string;
  };
}

interface BrowserInfo {
  browser?: string;
  version?: string;
  os?: string;
  screenResolution?: string;
  viewport?: string;
  language?: string;
}

export const ErrorReportModal: React.FC<ErrorReportModalProps> = ({
  isOpen,
  onClose,
  errorInfo = {}
}) => {
  const { currentLang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo>({});
  
  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    descriptionAr: '',
    descriptionEn: '',
    userEmail: '',
    userName: '',
    userPhone: '',
    severity: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
  });

  const isRTL = currentLang === 'ar';

  // Collect browser information
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const info: BrowserInfo = {
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
      };

      // Browser detection (simplified)
      const userAgent = navigator.userAgent;
      if (userAgent.includes('Chrome')) {
        info.browser = 'Chrome';
      } else if (userAgent.includes('Firefox')) {
        info.browser = 'Firefox';
      } else if (userAgent.includes('Safari')) {
        info.browser = 'Safari';
      } else if (userAgent.includes('Edge')) {
        info.browser = 'Edge';
      }

      // OS detection (simplified)
      if (userAgent.includes('Windows')) {
        info.os = 'Windows';
      } else if (userAgent.includes('Mac')) {
        info.os = 'macOS';
      } else if (userAgent.includes('Linux')) {
        info.os = 'Linux';
      } else if (userAgent.includes('Android')) {
        info.os = 'Android';
      } else if (userAgent.includes('iOS')) {
        info.os = 'iOS';
      }

      setBrowserInfo(info);
    }
  }, []);

  const texts = {
    ar: {
      title: 'الإبلاغ عن خطأ',
      subtitle: 'ساعدنا في تحسين الموقع من خلال الإبلاغ عن المشاكل التي تواجهها',
      titleAr: 'عنوان المشكلة (عربي) *',
      titleEn: 'عنوان المشكلة (إنجليزي) *',
      descriptionAr: 'وصف المشكلة (عربي) *',
      descriptionEn: 'وصف المشكلة (إنجليزي) *',
      userName: 'الاسم (اختياري)',
      userEmail: 'البريد الإلكتروني (اختياري)',
      userPhone: 'رقم الهاتف (اختياري)',
      severity: 'مستوى الأولوية',
      severityLow: 'منخفض',
      severityMedium: 'متوسط',
      severityHigh: 'عالي',
      severityCritical: 'حرج',
      submit: 'إرسال التقرير',
      cancel: 'إلغاء',
      sending: 'جاري الإرسال...',
      success: 'تم إرسال التقرير بنجاح!',
      successMessage: 'شكراً لك على مساعدتنا في تحسين الموقع. سنراجع التقرير ونعمل على حل المشكلة.',
      close: 'إغلاق',
      descriptionPlaceholderAr: 'يرجى وصف المشكلة التي واجهتك بالتفصيل...',
      descriptionPlaceholderEn: 'Please describe the problem you encountered in detail...',
      titlePlaceholderAr: 'مثال: لا يمكنني تسجيل الدخول',
      titlePlaceholderEn: 'Example: Cannot log in',
      contactInfo: 'معلومات التواصل (اختيارية)',
      contactInfoDesc: 'إذا كنت ترغب في الحصول على رد حول هذا التقرير',
      technicalDetails: 'التفاصيل التقنية',
      currentPage: 'الصفحة الحالية:',
      browserInfo: 'معلومات المتصفح:',
      errorDetails: 'تفاصيل الخطأ:'
    },
    en: {
      title: 'Report Error',
      subtitle: 'Help us improve the website by reporting issues you encounter',
      titleAr: 'Problem Title (Arabic) *',
      titleEn: 'Problem Title (English) *',
      descriptionAr: 'Problem Description (Arabic) *',
      descriptionEn: 'Problem Description (English) *',
      userName: 'Name (optional)',
      userEmail: 'Email (optional)',
      userPhone: 'Phone Number (optional)',
      severity: 'Priority Level',
      severityLow: 'Low',
      severityMedium: 'Medium',
      severityHigh: 'High',
      severityCritical: 'Critical',
      submit: 'Submit Report',
      cancel: 'Cancel',
      sending: 'Sending...',
      success: 'Report submitted successfully!',
      successMessage: 'Thank you for helping us improve the website. We will review the report and work on resolving the issue.',
      close: 'Close',
      descriptionPlaceholderAr: 'يرجى وصف المشكلة التي واجهتك بالتفصيل...',
      descriptionPlaceholderEn: 'Please describe the problem you encountered in detail...',
      titlePlaceholderAr: 'مثال: لا يمكنني تسجيل الدخول',
      titlePlaceholderEn: 'Example: Cannot log in',
      contactInfo: 'Contact Information (Optional)',
      contactInfoDesc: 'If you would like to receive updates about this report',
      technicalDetails: 'Technical Details',
      currentPage: 'Current Page:',
      browserInfo: 'Browser Information:',
      errorDetails: 'Error Details:'
    }
  };

  const t = texts[currentLang as keyof typeof texts] || texts.ar;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const pageUrl = errorInfo.pageUrl || window.location.href;
      
      const reportData = {
        ...formData,
        pageUrl,
        userAgent: navigator.userAgent,
        browserInfo,
        errorType: errorInfo.errorType || 'USER_REPORTED',
        errorStack: errorInfo.errorStack || undefined,
      };

      const response = await fetch('/api/error-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            titleAr: '',
            titleEn: '',
            descriptionAr: '',
            descriptionEn: '',
            userEmail: '',
            userName: '',
            userPhone: '',
            severity: 'MEDIUM',
          });
          setSubmitted(false);
          onClose();
        }, 3000);
      } else {
        setError(data.message || 'حدث خطأ في إرسال التقرير');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className={`bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
          isRTL ? 'text-right' : 'text-left'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="p-2 bg-red-100 rounded-full">
              <Bug className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t.title}</h2>
              <p className="text-sm text-gray-600">{t.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {submitted ? (
          // Success state
          <div className="p-6 text-center">
            <div className="mb-4">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t.success}</h3>
              <p className="text-gray-600 mb-6">{t.successMessage}</p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {t.close}
            </button>
          </div>
        ) : (
          // Form
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className={`p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Title fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.titleAr}
                </label>
                <input
                  type="text"
                  required
                  value={formData.titleAr}
                  onChange={(e) => handleChange('titleAr', e.target.value)}
                  placeholder={t.titlePlaceholderAr}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isRTL ? 'text-right' : 'text-left'}`}
                  dir="rtl"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.titleEn}
                </label>
                <input
                  type="text"
                  required
                  value={formData.titleEn}
                  onChange={(e) => handleChange('titleEn', e.target.value)}
                  placeholder={t.titlePlaceholderEn}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Description fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.descriptionAr}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.descriptionAr}
                  onChange={(e) => handleChange('descriptionAr', e.target.value)}
                  placeholder={t.descriptionPlaceholderAr}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isRTL ? 'text-right' : 'text-left'}`}
                  dir="rtl"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.descriptionEn}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.descriptionEn}
                  onChange={(e) => handleChange('descriptionEn', e.target.value)}
                  placeholder={t.descriptionPlaceholderEn}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.severity}
              </label>
              <select
                value={formData.severity}
                onChange={(e) => handleChange('severity', e.target.value)}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <option value="LOW">{t.severityLow}</option>
                <option value="MEDIUM">{t.severityMedium}</option>
                <option value="HIGH">{t.severityHigh}</option>
                <option value="CRITICAL">{t.severityCritical}</option>
              </select>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className={`font-medium text-gray-900 mb-2 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <User className="w-5 h-5" />
                {t.contactInfo}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{t.contactInfoDesc}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.userName}
                  </label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => handleChange('userName', e.target.value)}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.userEmail}
                  </label>
                  <input
                    type="email"
                    value={formData.userEmail}
                    onChange={(e) => handleChange('userEmail', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
                    dir="ltr"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.userPhone}
                  </label>
                  <input
                    type="tel"
                    value={formData.userPhone}
                    onChange={(e) => handleChange('userPhone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="border-t pt-6">
              <h3 className={`font-medium text-gray-900 mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Monitor className="w-5 h-5" />
                {t.technicalDetails}
              </h3>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <span className="font-medium">{t.currentPage}</span>
                  <a 
                    href={errorInfo.pageUrl || window?.location?.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`ml-2 text-blue-600 hover:text-blue-800 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    {errorInfo.pageUrl || (typeof window !== 'undefined' ? window.location.href : '')}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                
                <div>
                  <span className="font-medium">{t.browserInfo}</span>
                  <div className="text-xs mt-1 font-mono bg-gray-100 p-2 rounded">
                    {browserInfo.browser && `Browser: ${browserInfo.browser}`}
                    {browserInfo.os && ` | OS: ${browserInfo.os}`}
                    {browserInfo.screenResolution && ` | Screen: ${browserInfo.screenResolution}`}
                    {browserInfo.viewport && ` | Viewport: ${browserInfo.viewport}`}
                  </div>
                </div>
                
                {errorInfo.errorStack && (
                  <div>
                    <span className="font-medium">{t.errorDetails}</span>
                    <pre className="text-xs mt-1 font-mono bg-red-50 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                      {errorInfo.errorStack}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className={`flex gap-4 pt-6 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Send className="w-4 h-4" />
                {loading ? t.sending : t.submit}
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                {t.cancel}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// Error report button component
interface ErrorReportButtonProps {
  className?: string;
  variant?: 'button' | 'link' | 'floating';
  errorInfo?: {
    errorType?: 'USER_REPORTED' | 'JAVASCRIPT_ERROR' | 'API_ERROR' | 'UI_BUG';
    errorStack?: string;
    pageUrl?: string;
  };
}

export const ErrorReportButton: React.FC<ErrorReportButtonProps> = ({
  className = '',
  variant = 'button',
  errorInfo
}) => {
  const { currentLang } = useLanguage();
  const [showModal, setShowModal] = useState(false);

  const texts = {
    ar: {
      reportError: 'الإبلاغ عن خطأ',
      reportIssue: 'الإبلاغ عن مشكلة'
    },
    en: {
      reportError: 'Report Error',
      reportIssue: 'Report Issue'
    }
  };

  const t = texts[currentLang as keyof typeof texts] || texts.ar;
  const isRTL = currentLang === 'ar';

  const baseClasses = `flex items-center gap-2 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`;

  const variantClasses = {
    button: `px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ${baseClasses}`,
    link: `text-red-600 hover:text-red-800 underline ${baseClasses}`,
    floating: `fixed bottom-4 right-4 z-40 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 ${baseClasses}`
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`${variantClasses[variant]} ${className}`}
        title={t.reportError}
      >
        <Bug className="w-4 h-4" />
        {variant !== 'floating' && (
          <span className="text-sm font-medium">{t.reportError}</span>
        )}
      </button>

      <ErrorReportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        errorInfo={errorInfo}
      />
    </>
  );
};

export default ErrorReportButton;
