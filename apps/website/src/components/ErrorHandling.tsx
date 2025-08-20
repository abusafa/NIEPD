'use client'

import React from 'react';
import { 
  WifiOff, 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  ArrowLeft, 
  ArrowRight,
  ServerCrash,
  Clock,
  Shield
} from 'lucide-react';
import { useLanguage, useNetworkStatus } from '@/contexts/AppContext';

// Network Error Component
export const NetworkError: React.FC<{
  onRetry?: () => void;
  showHomeButton?: boolean;
}> = ({ onRetry, showHomeButton = false }) => {
  const { currentLang } = useLanguage();
  const { isOnline } = useNetworkStatus();

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
        {/* Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          {isOnline ? (
            <ServerCrash className="w-10 h-10 text-red-600" />
          ) : (
            <WifiOff className="w-10 h-10 text-red-600" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {isOnline 
            ? (currentLang === 'ar' ? 'خطأ في الخادم' : 'Server Error')
            : (currentLang === 'ar' ? 'لا يوجد اتصال بالإنترنت' : 'No Internet Connection')
          }
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {isOnline 
            ? (currentLang === 'ar' 
                ? 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.'
                : 'A server error occurred. Please try again later.'
              )
            : (currentLang === 'ar' 
                ? 'يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.'
                : 'Please check your internet connection and try again.'
              )
          }
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {currentLang === 'ar' ? 'حاول مرة أخرى' : 'Try Again'}
            </button>
          )}
          
          {showHomeButton && (
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              {currentLang === 'ar' ? 'الصفحة الرئيسية' : 'Go Home'}
            </button>
          )}
        </div>

        {/* Network Status Indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-gray-500">
            {isOnline 
              ? (currentLang === 'ar' ? 'متصل' : 'Online')
              : (currentLang === 'ar' ? 'غير متصل' : 'Offline')
            }
          </span>
        </div>
      </div>
    </div>
  );
};

// Generic Error Component
export const GenericError: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  showHomeButton?: boolean;
}> = ({ 
  title, 
  message, 
  onRetry, 
  onGoBack, 
  showHomeButton = false 
}) => {
  const { currentLang } = useLanguage();
  const ArrowIcon = currentLang === 'ar' ? ArrowRight : ArrowLeft;

  const defaultTitle = currentLang === 'ar' ? 'حدث خطأ' : 'An Error Occurred';
  const defaultMessage = currentLang === 'ar' 
    ? 'نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى.'
    : 'We apologize for this error. Please try again.';

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
        {/* Icon */}
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-orange-600" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {title || defaultTitle}
        </h3>

        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message || defaultMessage}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {currentLang === 'ar' ? 'حاول مرة أخرى' : 'Try Again'}
            </button>
          )}
          
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ArrowIcon className="w-4 h-4" />
              {currentLang === 'ar' ? 'العودة' : 'Go Back'}
            </button>
          )}
          
          {showHomeButton && (
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 bg-secondary-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-secondary-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              {currentLang === 'ar' ? 'الصفحة الرئيسية' : 'Home'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// 404 Not Found Component
export const NotFound: React.FC<{
  title?: string;
  message?: string;
  showHomeButton?: boolean;
}> = ({ title, message, showHomeButton = true }) => {
  const { currentLang } = useLanguage();

  const defaultTitle = currentLang === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found';
  const defaultMessage = currentLang === 'ar' 
    ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
    : 'Sorry, the page you are looking for does not exist or has been moved.';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* 404 Number */}
        <div className="text-6xl font-bold text-primary-600 mb-4">404</div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {title || defaultTitle}
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message || defaultMessage}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentLang === 'ar' ? 'العودة' : 'Go Back'}
          </button>
          
          {showHomeButton && (
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              {currentLang === 'ar' ? 'الصفحة الرئيسية' : 'Home'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Maintenance Mode Component
export const MaintenanceMode: React.FC<{
  estimatedTime?: string;
}> = ({ estimatedTime }) => {
  const { currentLang } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-10 h-10 text-blue-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {currentLang === 'ar' ? 'الموقع قيد الصيانة' : 'Site Under Maintenance'}
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {currentLang === 'ar' 
            ? 'نعمل حالياً على تحسين الموقع. سيعود الموقع للعمل قريباً.'
            : 'We are currently working on improving the site. The site will be back online soon.'
          }
        </p>

        {/* Estimated Time */}
        {estimatedTime && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-blue-700">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                {currentLang === 'ar' ? 'الوقت المتوقع:' : 'Estimated time:'} {estimatedTime}
              </span>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <p className="text-sm text-gray-500">
          {currentLang === 'ar' 
            ? 'للاستفسارات: info@niepd.sa'
            : 'For inquiries: info@niepd.sa'
          }
        </p>
      </div>
    </div>
  );
};

// Network Status Banner
export const NetworkStatusBanner: React.FC = () => {
  const { isOnline } = useNetworkStatus();
  const { currentLang } = useLanguage();

  if (isOnline) return null;

  return (
    <div className="bg-red-600 text-white px-4 py-2 text-center text-sm font-medium">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span>
          {currentLang === 'ar' 
            ? 'لا يوجد اتصال بالإنترنت. بعض الميزات قد لا تعمل بشكل صحيح.'
            : 'No internet connection. Some features may not work properly.'
          }
        </span>
      </div>
    </div>
  );
};

// Error Handler Hook
export const useErrorHandler = () => {
  const { currentLang } = useLanguage();

  const handleApiError = (error: unknown) => {
    console.error('API Error:', error);

    // Network errors
    if (!navigator.onLine) {
      return {
        type: 'network',
        title: currentLang === 'ar' ? 'لا يوجد اتصال بالإنترنت' : 'No Internet Connection',
        message: currentLang === 'ar' 
          ? 'يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.'
          : 'Please check your internet connection and try again.'
      };
    }

    // Server errors
    if ((error as any).response?.status >= 500) {
      return {
        type: 'server',
        title: currentLang === 'ar' ? 'خطأ في الخادم' : 'Server Error',
        message: currentLang === 'ar' 
          ? 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.'
          : 'A server error occurred. Please try again later.'
      };
    }

    // Client errors
    if ((error as any).response?.status >= 400) {
      return {
        type: 'client',
        title: currentLang === 'ar' ? 'خطأ في الطلب' : 'Request Error',
        message: (error as any).response?.data?.message || (currentLang === 'ar' 
          ? 'حدث خطأ في معالجة طلبك.'
          : 'An error occurred while processing your request.')
      };
    }

    // Generic error
    return {
      type: 'generic',
      title: currentLang === 'ar' ? 'حدث خطأ' : 'An Error Occurred',
      message: currentLang === 'ar' 
        ? 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
        : 'An unexpected error occurred. Please try again.'
    };
  };

  return { handleApiError };
};
