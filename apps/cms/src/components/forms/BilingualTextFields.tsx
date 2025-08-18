'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
}: BilingualTextFieldsProps) {
  return (
    <Tabs defaultValue="english" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="english">English</TabsTrigger>
        <TabsTrigger value="arabic">العربية</TabsTrigger>
      </TabsList>
      
      <TabsContent value="english" className="space-y-4">
        <div>
          <Label htmlFor="titleEn">{titleLabel} (English) *</Label>
          <Input
            id="titleEn"
            value={titleEn}
            onChange={(e) => onTitleEnChange(e.target.value)}
            placeholder={`Enter ${titleLabel.toLowerCase()} in English`}
          />
        </div>
        
        {showSummary && onSummaryEnChange && (
          <div>
            <Label htmlFor="summaryEn">{summaryLabel} (English)</Label>
            <Textarea
              id="summaryEn"
              value={summaryEn}
              onChange={(e) => onSummaryEnChange(e.target.value)}
              placeholder={`Brief ${summaryLabel.toLowerCase()} in English`}
              rows={3}
            />
          </div>
        )}
        
        {showContent && onContentEnChange && (
          <div>
            <LexicalRichTextEditor
              label={`${contentLabel} (English)`}
              value={contentEn}
              onChange={onContentEnChange}
              placeholder={`Full ${contentLabel.toLowerCase()} in English`}
              dir="ltr"
              required
            />
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="arabic" className="space-y-4">
        <div>
          <Label htmlFor="titleAr">{titleLabel === 'Title' ? 'العنوان' : titleLabel} (العربية) *</Label>
          <Input
            id="titleAr"
            value={titleAr}
            onChange={(e) => onTitleArChange(e.target.value)}
            placeholder={`أدخل ${titleLabel === 'Title' ? 'العنوان' : titleLabel} بالعربية`}
            dir="rtl"
          />
        </div>
        
        {showSummary && onSummaryArChange && (
          <div>
            <Label htmlFor="summaryAr">{summaryLabel === 'Summary' ? 'الملخص' : summaryLabel} (العربية)</Label>
            <Textarea
              id="summaryAr"
              value={summaryAr}
              onChange={(e) => onSummaryArChange(e.target.value)}
              placeholder={`ملخص مختصر بالعربية`}
              rows={3}
              dir="rtl"
            />
          </div>
        )}
        
        {showContent && onContentArChange && (
          <div>
            <LexicalRichTextEditor
              label={`${contentLabel === 'Content' ? 'المحتوى' : contentLabel} (العربية)`}
              value={contentAr}
              onChange={onContentArChange}
              placeholder={`المحتوى الكامل بالعربية`}
              dir="rtl"
              required
            />
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
