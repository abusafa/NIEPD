'use client';

import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  CheckCircle, 
  Clock, 
  Loader2 
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FormActionsProps {
  onBack?: () => void;
  onSaveDraft?: () => void;
  onSubmitReview?: () => void;
  onPublish?: () => void;
  onPreview?: () => void;
  loading?: boolean;
  status?: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  showPreview?: boolean;
  showWorkflow?: boolean;
  isEditing?: boolean;
}

export default function FormActions({
  onBack,
  onSaveDraft,
  onSubmitReview,
  onPublish,
  onPreview,
  loading = false,
  status = 'DRAFT',
  showPreview = true,
  showWorkflow = true,
  isEditing = false,
}: FormActionsProps) {
  const { currentLang, isRTL } = useLanguage();
  
  return (
    <div className={`flex items-center ${isRTL ? 'justify-start flex-row-reverse' : 'justify-between'} gap-4`}>
      {/* Back Button */}
      <div className={isRTL ? 'order-2' : 'order-1'}>
        {onBack && (
          <Button 
            variant="ghost" 
            onClick={onBack} 
            disabled={loading}
            className="font-readex hover:bg-[#00808A]/10 dark:hover:bg-[#00808A]/20 rounded-xl px-4 py-2 transition-all duration-300 text-gray-900 dark:text-gray-100"
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
            {currentLang === 'ar' ? 'العودة' : 'Back'}
          </Button>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className={`flex gap-3 ${isRTL ? 'order-1 flex-row-reverse' : 'order-2'}`}>
        {/* Preview Button */}
        {showPreview && onPreview && (
          <Button 
            variant="outline" 
            onClick={onPreview} 
            disabled={loading}
            className="font-readex border-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-600 rounded-xl px-4 py-2 shadow-sm transition-all duration-300 bg-white dark:bg-gray-800"
          >
            <Eye className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {currentLang === 'ar' ? 'معاينة' : 'Preview'}
          </Button>
        )}

        {/* Workflow Actions */}
        {showWorkflow && (
          <>
            {/* Save Draft */}
            {onSaveDraft && (
              <Button 
                variant="outline" 
                onClick={onSaveDraft} 
                disabled={loading}
                className="font-readex border-2 border-[#00808A]/20 dark:border-[#00808A]/40 text-[#00808A] dark:text-[#4db8c4] hover:bg-[#00808A]/10 dark:hover:bg-[#00808A]/20 hover:border-[#00808A] dark:hover:border-[#4db8c4] rounded-xl px-4 py-2 shadow-sm transition-all duration-300 bg-white dark:bg-gray-800"
              >
                {loading ? (
                  <Loader2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
                ) : (
                  <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                )}
                {isEditing 
                  ? (currentLang === 'ar' ? 'حفظ التغييرات' : 'Save Changes')
                  : (currentLang === 'ar' ? 'حفظ مسودة' : 'Save Draft')
                }
              </Button>
            )}

            {/* Submit for Review */}
            {onSubmitReview && status === 'DRAFT' && (
              <Button 
                variant="outline" 
                onClick={onSubmitReview} 
                disabled={loading}
                className="font-readex border-2 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:border-orange-300 dark:hover:border-orange-600 rounded-xl px-4 py-2 shadow-sm transition-all duration-300 bg-white dark:bg-gray-800"
              >
                {loading ? (
                  <Loader2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
                ) : (
                  <Clock className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                )}
                {currentLang === 'ar' ? 'إرسال للمراجعة' : 'Submit for Review'}
              </Button>
            )}

            {/* Publish Button */}
            {onPublish && (
              <Button 
                onClick={onPublish} 
                disabled={loading}
                className="font-readex bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-700 dark:to-green-800 dark:hover:from-green-800 dark:hover:to-green-900 text-white rounded-xl px-4 py-2 shadow-lg hover:shadow-xl dark:shadow-gray-900/50 transition-all duration-300 hover:scale-105"
              >
                {loading ? (
                  <Loader2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
                ) : (
                  <CheckCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                )}
                {status === 'PUBLISHED' 
                  ? (currentLang === 'ar' ? 'تحديث مع الاحتفاظ بالنشر' : 'Update & Keep Published')
                  : (currentLang === 'ar' ? 'نشر الآن' : 'Publish Now')
                }
              </Button>
            )}
          </>
        )}

        {/* Simple Save (when workflow is disabled) */}
        {!showWorkflow && onSaveDraft && (
          <Button 
            onClick={onSaveDraft} 
            disabled={loading}
            className="font-readex bg-gradient-to-r from-[#00808A] to-[#006b74] hover:from-[#006b74] hover:to-[#00808A] dark:from-[#4db8c4] dark:to-[#00808A] dark:hover:from-[#00808A] dark:hover:to-[#4db8c4] text-white rounded-xl px-6 py-2 shadow-lg hover:shadow-xl dark:shadow-gray-900/50 transition-all duration-300 hover:scale-105"
          >
            {loading ? (
              <Loader2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
            ) : (
              <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            )}
            {isEditing 
              ? (currentLang === 'ar' ? 'حفظ التغييرات' : 'Save Changes')
              : (currentLang === 'ar' ? 'حفظ' : 'Save')
            }
          </Button>
        )}
      </div>
    </div>
  );
}
