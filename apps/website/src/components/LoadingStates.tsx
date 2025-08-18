import React from 'react';
import { Loader2 } from 'lucide-react';

// Generic Loading Spinner
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}> = ({ size = 'md', className = '', text }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-600`} />
      {text && (
        <p className="text-sm text-secondary-600 animate-pulse">{text}</p>
      )}
    </div>
  );
};

// Page Loading Overlay
export const PageLoader: React.FC<{
  text?: string;
  currentLang?: 'ar' | 'en';
}> = ({ text, currentLang = 'ar' }) => {
  const defaultText = currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...';
  
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-lg font-medium text-secondary-700">
          {text || defaultText}
        </p>
      </div>
    </div>
  );
};

// Skeleton Components
export const SkeletonBox: React.FC<{
  width?: string;
  height?: string;
  className?: string;
}> = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <div className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`} />
);

export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBox
        key={i}
        width={i === lines - 1 ? 'w-3/4' : 'w-full'}
        height="h-4"
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{
  showImage?: boolean;
  className?: string;
}> = ({ showImage = true, className = '' }) => (
  <div className={`bg-white rounded-2xl p-6 border border-gray-100 ${className}`}>
    {showImage && (
      <SkeletonBox width="w-full" height="h-48" className="mb-4 rounded-xl" />
    )}
    <SkeletonBox width="w-3/4" height="h-6" className="mb-3" />
    <SkeletonText lines={3} className="mb-4" />
    <div className="flex gap-3">
      <SkeletonBox width="w-24" height="h-10" className="rounded-lg" />
      <SkeletonBox width="w-20" height="h-10" className="rounded-lg" />
    </div>
  </div>
);

// Program Card Skeleton
export const ProgramCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
    <SkeletonBox width="w-full" height="h-48" />
    <div className="p-6">
      <SkeletonBox width="w-3/4" height="h-6" className="mb-3" />
      <SkeletonText lines={2} className="mb-4" />
      
      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-4 mb-6 py-4 bg-gray-50 rounded-lg">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center">
            <SkeletonBox width="w-8" height="h-4" className="mx-auto mb-1" />
            <SkeletonBox width="w-12" height="h-3" className="mx-auto" />
          </div>
        ))}
      </div>
      
      {/* Features skeleton */}
      <div className="space-y-2 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <SkeletonBox width="w-4" height="h-4" className="rounded-full" />
            <SkeletonBox width="w-3/4" height="h-4" />
          </div>
        ))}
      </div>
      
      {/* Partnership skeleton */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <SkeletonBox width="w-20" height="h-3" className="mb-1" />
        <SkeletonBox width="w-32" height="h-4" />
      </div>
      
      {/* Buttons skeleton */}
      <div className="flex gap-3">
        <SkeletonBox width="flex-1" height="h-10" className="rounded-lg" />
        <SkeletonBox width="w-20" height="h-10" className="rounded-lg" />
      </div>
    </div>
  </div>
);

// News Card Skeleton
export const NewsCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100">
    <SkeletonBox width="w-full" height="h-48" className="mb-4 rounded-xl" />
    <div className="flex items-center gap-2 mb-3">
      <SkeletonBox width="w-16" height="h-5" className="rounded-full" />
      <SkeletonBox width="w-20" height="h-4" />
    </div>
    <SkeletonBox width="w-full" height="h-6" className="mb-3" />
    <SkeletonText lines={3} className="mb-4" />
    <div className="flex items-center justify-between text-sm">
      <SkeletonBox width="w-24" height="h-4" />
      <SkeletonBox width="w-16" height="h-4" />
    </div>
  </div>
);

// Event Card Skeleton
export const EventCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100">
    <div className="flex items-start gap-4 mb-4">
      <SkeletonBox width="w-16" height="h-16" className="rounded-xl" />
      <div className="flex-1">
        <SkeletonBox width="w-3/4" height="h-6" className="mb-2" />
        <SkeletonBox width="w-1/2" height="h-4" />
      </div>
    </div>
    <SkeletonText lines={2} className="mb-4" />
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="flex items-center gap-2">
        <SkeletonBox width="w-4" height="h-4" className="rounded-full" />
        <SkeletonBox width="w-20" height="h-4" />
      </div>
      <div className="flex items-center gap-2">
        <SkeletonBox width="w-4" height="h-4" className="rounded-full" />
        <SkeletonBox width="w-16" height="h-4" />
      </div>
    </div>
    <SkeletonBox width="w-full" height="h-10" className="rounded-lg" />
  </div>
);

// FAQ Item Skeleton
export const FAQItemSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-6 border border-gray-100">
    <div className="flex items-center justify-between mb-3">
      <SkeletonBox width="w-3/4" height="h-5" />
      <SkeletonBox width="w-6" height="h-6" className="rounded-full" />
    </div>
    <SkeletonText lines={2} />
  </div>
);

// Grid Skeleton Layouts
export const ProgramsGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <ProgramCardSkeleton key={i} />
    ))}
  </div>
);

export const NewsGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <NewsCardSkeleton key={i} />
    ))}
  </div>
);

export const EventsGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <EventCardSkeleton key={i} />
    ))}
  </div>
);

export const FAQListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <FAQItemSkeleton key={i} />
    ))}
  </div>
);

// Button Loading State
export const LoadingButton: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}> = ({ loading, children, className = '', disabled, onClick, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    className={`relative ${className} ${loading || disabled ? 'opacity-75 cursor-not-allowed' : ''}`}
  >
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingSpinner size="sm" />
      </div>
    )}
    <span className={loading ? 'opacity-0' : 'opacity-100'}>
      {children}
    </span>
  </button>
);

// Content Loading Wrapper
export const ContentLoader: React.FC<{
  loading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  error?: string | null;
  retry?: () => void;
  currentLang?: 'ar' | 'en';
}> = ({ loading, skeleton, children, error, retry, currentLang = 'ar' }) => {
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          {currentLang === 'ar' ? 'حدث خطأ في تحميل البيانات' : 'Error loading data'}
        </div>
        {retry && (
          <button
            onClick={retry}
            className="btn-primary"
          >
            {currentLang === 'ar' ? 'حاول مرة أخرى' : 'Try Again'}
          </button>
        )}
      </div>
    );
  }

  if (loading) {
    return <>{skeleton}</>;
  }

  return <>{children}</>;
};
