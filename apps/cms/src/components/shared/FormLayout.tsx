'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FormActions from '@/components/forms/FormActions';
import { useLanguage } from '@/contexts/LanguageContext';

interface FormLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onBack?: () => void;
  onSave?: () => void;
  onPreview?: () => void;
  loading?: boolean;
  isEditing?: boolean;
  showPreview?: boolean;
  className?: string;
}

export default function FormLayout({
  title,
  description,
  children,
  onBack,
  onSave,
  onPreview,
  loading = false,
  isEditing = false,
  showPreview = false,
  className = '',
}: FormLayoutProps) {
  const { currentLang, t, isRTL } = useLanguage();
  
  return (
    <div className={`space-y-8 ${className} ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`${isRTL ? 'text-right' : 'text-left'} bg-gradient-to-r from-white via-slate-50/30 to-white dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900 rounded-3xl p-8 border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50`}>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00808A] to-[#006b74] dark:from-[#00808A] dark:to-[#4db8c4] bg-clip-text text-transparent font-readex mb-3 h-14">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-gray-700 dark:text-gray-300 font-readex leading-relaxed max-w-3xl">
            {description}
          </p>
        )}
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className={`lg:col-span-2 ${isRTL ? 'lg:order-1' : 'lg:order-1'}`}>
          <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-2xl dark:shadow-gray-900/50 rounded-3xl overflow-hidden bg-white dark:bg-gray-900">
            <CardHeader className="bg-gradient-to-r from-slate-50/80 via-white to-slate-50/80 dark:from-gray-800/80 dark:via-gray-900 dark:to-gray-800/80 border-b-2 border-slate-200/30 dark:border-gray-700/30 py-6">
              <CardTitle className={`font-readex text-2xl font-bold text-[#00234E] dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                {currentLang === 'ar' 
                  ? (isEditing ? 'تعديل التفاصيل' : 'إنشاء جديد')
                  : (isEditing ? 'Edit Details' : 'Create New')
                }
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8 bg-white dark:bg-gray-900">
              {children}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className={`space-y-8 ${isRTL ? 'lg:order-2' : 'lg:order-2'}`}>
          {/* Form Actions */}
          <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 shadow-lg dark:shadow-gray-900/50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
            <CardHeader className="bg-gradient-to-r from-[#00808A]/5 via-[#00808A]/3 to-[#006b74]/5 dark:from-[#00808A]/10 dark:via-[#00808A]/5 dark:to-[#006b74]/10 border-b border-[#00808A]/10 dark:border-[#00808A]/20 py-6">
              <CardTitle className={`font-readex text-xl font-bold text-[#00234E] dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                {currentLang === 'ar' ? 'الإجراءات' : 'Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white dark:bg-gray-900">
              <FormActions
                onBack={onBack}
                onSaveDraft={onSave}
                onPreview={showPreview ? onPreview : undefined}
                loading={loading}
                showPreview={showPreview}
                showWorkflow={false}
                isEditing={isEditing}
              />
            </CardContent>
          </Card>

          {/* Help Text */}
          <Card className="border-2 border-amber-200/50 dark:border-amber-800/30 shadow-lg dark:shadow-gray-900/50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
            <CardHeader className="bg-gradient-to-r from-amber-50/80 to-yellow-50/80 dark:from-amber-950/30 dark:to-yellow-950/30 border-b border-amber-200/30 dark:border-amber-800/30 py-6">
              <CardTitle className={`font-readex text-xl font-bold text-[#00234E] dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'} flex items-center gap-3`}>
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                  <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                {currentLang === 'ar' ? 'نصائح مفيدة' : 'Helpful Tips'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white dark:bg-gray-900">
              <div className={`space-y-4 text-sm text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="font-readex p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-l-4 border-blue-400 dark:border-blue-500">
                  <strong className="text-blue-800 dark:text-blue-300">
                    {currentLang === 'ar' ? 'الحقول المطلوبة' : 'Required fields'}
                  </strong>
                  <p className="mt-1 text-blue-700 dark:text-blue-400">
                    {currentLang === 'ar' 
                      ? 'مُحددة بعلامة النجمة (*)'
                      : 'are marked with an asterisk (*)'
                    }
                  </p>
                </div>
                <div className="font-readex p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border-l-4 border-green-400 dark:border-green-500">
                  <strong className="text-green-800 dark:text-green-300">
                    {currentLang === 'ar' ? 'المحتوى ثنائي اللغة' : 'Bilingual content'}
                  </strong>
                  <p className="mt-1 text-green-700 dark:text-green-400">
                    {currentLang === 'ar' 
                      ? 'أضف النص باللغتين العربية والإنجليزية لإمكانية وصول أفضل'
                      : 'Add both Arabic and English text for better accessibility'
                    }
                  </p>
                </div>
                <div className="font-readex p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border-l-4 border-purple-400 dark:border-purple-500">
                  <strong className="text-purple-800 dark:text-purple-300">
                    {currentLang === 'ar' ? 'احفظ بانتظام' : 'Save frequently'}
                  </strong>
                  <p className="mt-1 text-purple-700 dark:text-purple-400">
                    {currentLang === 'ar' 
                      ? 'لتجنب فقدان عملك'
                      : 'to avoid losing your work'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
