'use client';

import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
}

interface Tag {
  id: string;
  nameAr: string;
  nameEn: string;
}

interface PublicationSettingsProps {
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  onStatusChange: (status: 'DRAFT' | 'REVIEW' | 'PUBLISHED') => void;
  featured: boolean;
  onFeaturedChange: (featured: boolean) => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  categoryId?: string;
  onCategoryChange: (categoryId: string) => void;
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
  categories?: Category[];
  availableTags?: Tag[];
  showSlug?: boolean;
  showCategory?: boolean;
  showTags?: boolean;
  additionalFields?: React.ReactNode;
}

export default function PublicationSettings({
  status,
  onStatusChange,
  featured,
  onFeaturedChange,
  slug,
  onSlugChange,
  categoryId,
  onCategoryChange,
  selectedTags,
  onTagsChange,
  categories = [],
  availableTags = [],
  showSlug = true,
  showCategory = true,
  showTags = true,
  additionalFields,
}: PublicationSettingsProps) {
  const { currentLang, isRTL } = useLanguage();
  
  const handleTagToggle = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    onTagsChange(newTags);
  };
  
  const getStatusText = (status: string) => {
    const statusMap = {
      'PUBLISHED': { en: 'Published', ar: 'منشور' },
      'DRAFT': { en: 'Draft', ar: 'مسودة' },
      'REVIEW': { en: 'Under Review', ar: 'تحت المراجعة' }
    };
    return currentLang === 'ar' ? statusMap[status as keyof typeof statusMap]?.ar || status : statusMap[status as keyof typeof statusMap]?.en || status;
  };
  
  const getStatusDescription = (status: string) => {
    const descriptions = {
      'DRAFT': {
        en: 'Only visible to you and other editors',
        ar: 'مرئي فقط لك وللمحررين الآخرين'
      },
      'REVIEW': {
        en: 'Submitted for approval by editors/admins',
        ar: 'مُرسل للموافقة من قبل المحررين/المشرفين'
      },
      'PUBLISHED': {
        en: 'Live and visible to all visitors',
        ar: 'مباشر ومرئي لجميع الزوار'
      }
    };
    return currentLang === 'ar' ? descriptions[status as keyof typeof descriptions]?.ar : descriptions[status as keyof typeof descriptions]?.en;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'REVIEW':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Publication Status */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="status" className="font-readex font-medium text-[#00234E] dark:text-gray-100">
            {currentLang === 'ar' ? 'حالة النشر' : 'Publication Status'}
          </Label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="font-readex rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#00808A] dark:focus:border-[#4db8c4] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT" className="font-readex">
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  {getStatusText('DRAFT')}
                </div>
              </SelectItem>
              <SelectItem value="REVIEW" className="font-readex">
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  {getStatusText('REVIEW')}
                </div>
              </SelectItem>
              <SelectItem value="PUBLISHED" className="font-readex">
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  {getStatusText('PUBLISHED')}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-3">
            <Badge className={`${getStatusColor(status)} font-readex px-3 py-1 rounded-lg`}>
              {getStatusText(status)}
            </Badge>
          </div>
        </div>

        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Checkbox
            id="featured"
            checked={featured}
            onCheckedChange={onFeaturedChange}
            className="dark:border-gray-600"
          />
          <Label htmlFor="featured" className="font-readex font-medium text-[#00234E] dark:text-gray-100 cursor-pointer">
            {currentLang === 'ar' ? 'محتوى بارز' : 'Featured Content'}
          </Label>
        </div>
      </div>

      {/* SEO Settings */}
      {showSlug && (
        <div>
          <Label htmlFor="slug" className="font-readex font-medium text-[#00234E] dark:text-gray-100">
            {currentLang === 'ar' ? 'رابط المقال' : 'URL Slug'}
          </Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder={currentLang === 'ar' ? 'رابط-المقال' : 'url-slug-here'}
            className="font-readex mt-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#00808A] dark:focus:border-[#4db8c4] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            dir="ltr"
          />
          <p className={`text-sm text-gray-600 dark:text-gray-400 mt-2 font-readex ${isRTL ? 'text-right' : 'text-left'}`}>
            {currentLang === 'ar' 
              ? 'سيتم استخدام هذا في الرابط. استخدم الأحرف الصغيرة والأرقام والشرطات فقط.'
              : 'This will be used in the URL. Use lowercase letters, numbers, and hyphens only.'
            }
          </p>
        </div>
      )}

      {/* Category Selection */}
      {showCategory && categories.length > 0 && (
        <div>
          <Label htmlFor="category" className="font-readex font-medium text-[#00234E] dark:text-gray-100">
            {currentLang === 'ar' ? 'التصنيف' : 'Category'}
          </Label>
          <Select value={categoryId || 'none'} onValueChange={(value) => onCategoryChange(value === 'none' ? '' : value)}>
            <SelectTrigger className="font-readex rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#00808A] dark:focus:border-[#4db8c4] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mt-2">
              <SelectValue placeholder={currentLang === 'ar' ? 'اختر التصنيف' : 'Select category'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none" className="font-readex">
                <span className="text-gray-500 dark:text-gray-400">
                  {currentLang === 'ar' ? 'بدون تصنيف' : 'No category'}
                </span>
              </SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id} className="font-readex">
                  {currentLang === 'ar' ? category.nameAr : category.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Tags Selection */}
      {showTags && availableTags.length > 0 && (
        <div>
          <Label className="font-readex font-medium text-[#00234E] dark:text-gray-100">
            {currentLang === 'ar' ? 'العلامات' : 'Tags'}
          </Label>
          <div className={`flex flex-wrap gap-2 mt-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
            {availableTags.map(tag => (
              <Badge
                key={tag.id}
                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                className="cursor-pointer font-readex transition-all duration-200 hover:scale-105 hover:shadow-md px-3 py-1 rounded-lg"
                onClick={() => handleTagToggle(tag.id)}
              >
                {currentLang === 'ar' ? tag.nameAr : tag.nameEn}
              </Badge>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-readex">
                {currentLang === 'ar' 
                  ? `المحددة: ${selectedTags.length} علامة${selectedTags.length > 1 ? '' : ''}` 
                  : `Selected: ${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''}`
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Additional Custom Fields */}
      {additionalFields && (
        <div>
          {additionalFields}
        </div>
      )}

      {/* Publication Info */}
      <div className="space-y-3 mt-6">
        <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border-l-4 border-yellow-400 dark:border-yellow-500">
          <p className="font-readex text-sm">
            <strong className="text-yellow-800 dark:text-yellow-300">{getStatusText('DRAFT')}:</strong>{' '}
            <span className="text-yellow-700 dark:text-yellow-400">{getStatusDescription('DRAFT')}</span>
          </p>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-400 dark:border-blue-500">
          <p className="font-readex text-sm">
            <strong className="text-blue-800 dark:text-blue-300">{getStatusText('REVIEW')}:</strong>{' '}
            <span className="text-blue-700 dark:text-blue-400">{getStatusDescription('REVIEW')}</span>
          </p>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-4 border-green-400 dark:border-green-500">
          <p className="font-readex text-sm">
            <strong className="text-green-800 dark:text-green-300">{getStatusText('PUBLISHED')}:</strong>{' '}
            <span className="text-green-700 dark:text-green-400">{getStatusDescription('PUBLISHED')}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
