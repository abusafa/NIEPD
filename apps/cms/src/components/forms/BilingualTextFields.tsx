'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import LexicalRichTextEditor from './LexicalRichTextEditor';

interface BilingualTextFieldsProps {
  titleAr: string;
  titleEn: string;
  summaryAr?: string;
  summaryEn?: string;
  contentAr?: string;
  contentEn?: string;
  onTitleArChange: (value: string) => void;
  onTitleEnChange: (value: string) => void;
  onSummaryArChange?: (value: string) => void;
  onSummaryEnChange?: (value: string) => void;
  onContentArChange?: (value: string) => void;
  onContentEnChange?: (value: string) => void;
  showSummary?: boolean;
  showContent?: boolean;
  titleLabel?: string;
  summaryLabel?: string;
  contentLabel?: string;
  contentRows?: number;
  disabled?: boolean;
  required?: boolean;
}

export default function BilingualTextFields({
  titleAr,
  titleEn,
  summaryAr = '',
  summaryEn = '',
  contentAr = '',
  contentEn = '',
  onTitleArChange,
  onTitleEnChange,
  onSummaryArChange,
  onSummaryEnChange,
  onContentArChange,
  onContentEnChange,
  showSummary = true,
  showContent = true,
  titleLabel = 'Title',
  summaryLabel = 'Summary',
  contentLabel = 'Content',
  contentRows = 8,
  disabled = false,
  required = false,
}: BilingualTextFieldsProps) {
  const { currentLang, t, isRTL } = useLanguage();
  const getDefaultTab = () => {
    return currentLang === 'ar' ? 'arabic' : 'english';
  };

  const getLabelInArabic = (label: string) => {
    const labelMap: { [key: string]: string } = {
      'Title': 'العنوان',
      'Summary': 'الملخص',
      'Content': 'المحتوى',
      'Description': 'الوصف',
      'Name': 'الاسم'
    };
    return labelMap[label] || label;
  };

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Tabs defaultValue={getDefaultTab()} className="w-full">
        <TabsList className="mb-4 font-readex">
          <TabsTrigger value="english" className="font-readex">{currentLang === 'ar' ? 'الإنجليزية' : 'English'}</TabsTrigger>
          <TabsTrigger value="arabic" className="font-readex">{currentLang === 'ar' ? 'العربية' : 'Arabic'}</TabsTrigger>
        </TabsList>
      
        <TabsContent value="english" className="space-y-4">
          <div>
            <Label htmlFor="titleEn" className="font-readex">
              {titleLabel} ({currentLang === 'ar' ? 'إنجليزي' : 'English'}) {required && '*'}
            </Label>
            <Input
              id="titleEn"
              value={titleEn}
              onChange={(e) => onTitleEnChange(e.target.value)}
              placeholder={currentLang === 'ar' ? `أدخل ${getLabelInArabic(titleLabel)} بالإنجليزية` : `Enter ${titleLabel.toLowerCase()} in English`}
              disabled={disabled}
              required={required}
              className="font-readex"
              dir="ltr"
            />
          </div>
        
          {showSummary && onSummaryEnChange && (
            <div>
              <Label htmlFor="summaryEn" className="font-readex">
                {summaryLabel} ({currentLang === 'ar' ? 'إنجليزي' : 'English'})
              </Label>
              <Textarea
                id="summaryEn"
                value={summaryEn}
                onChange={(e) => onSummaryEnChange(e.target.value)}
                placeholder={currentLang === 'ar' ? `${getLabelInArabic(summaryLabel)} مختصر بالإنجليزية` : `Brief ${summaryLabel.toLowerCase()} in English`}
                rows={3}
                disabled={disabled}
                className="font-readex"
                dir="ltr"
              />
            </div>
          )}
        
          {showContent && onContentEnChange && (
            <div>
              <LexicalRichTextEditor
                label={`${contentLabel} (${currentLang === 'ar' ? 'إنجليزي' : 'English'})`}
                value={contentEn}
                onChange={onContentEnChange}
                placeholder={currentLang === 'ar' ? `${getLabelInArabic(contentLabel)} كامل بالإنجليزية` : `Full ${contentLabel.toLowerCase()} in English`}
                dir="ltr"
                required={required}
                disabled={disabled}
              />
            </div>
          )}
        </TabsContent>
      
        <TabsContent value="arabic" className="space-y-4">
          <div>
            <Label htmlFor="titleAr" className="font-readex">
              {getLabelInArabic(titleLabel)} ({currentLang === 'ar' ? 'عربي' : 'Arabic'}) {required && '*'}
            </Label>
            <Input
              id="titleAr"
              value={titleAr}
              onChange={(e) => onTitleArChange(e.target.value)}
              placeholder={`أدخل ${getLabelInArabic(titleLabel)} بالعربية`}
              dir="rtl"
              disabled={disabled}
              required={required}
              className="font-readex text-right"
            />
          </div>
        
          {showSummary && onSummaryArChange && (
            <div>
              <Label htmlFor="summaryAr" className="font-readex">
                {getLabelInArabic(summaryLabel)} ({currentLang === 'ar' ? 'عربي' : 'Arabic'})
              </Label>
              <Textarea
                id="summaryAr"
                value={summaryAr}
                onChange={(e) => onSummaryArChange(e.target.value)}
                placeholder={`${getLabelInArabic(summaryLabel)} مختصر بالعربية`}
                rows={3}
                dir="rtl"
                disabled={disabled}
                className="font-readex text-right"
              />
            </div>
          )}
        
          {showContent && onContentArChange && (
            <div>
              <LexicalRichTextEditor
                label={`${getLabelInArabic(contentLabel)} (${currentLang === 'ar' ? 'عربي' : 'Arabic'})`}
                value={contentAr}
                onChange={onContentArChange}
                placeholder={`${getLabelInArabic(contentLabel)} الكامل بالعربية`}
                dir="rtl"
                required={required}
                disabled={disabled}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
