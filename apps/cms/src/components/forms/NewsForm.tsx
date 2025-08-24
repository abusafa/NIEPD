'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import FormLayout from '@/components/shared/FormLayout';
import BilingualTextFields from '@/components/forms/BilingualTextFields';
import MediaSelector from '@/components/forms/MediaSelector';
import PublicationSettings from '@/components/forms/PublicationSettings';
import LexicalRichTextEditor from './LexicalRichTextEditor';
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

interface NewsFormData {
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  contentAr: string;
  contentEn: string;
  slug: string;
  authorAr: string;
  authorEn: string;
  image: string;
  featured: boolean;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  categoryId: string;
  tagIds: string[];
}

interface NewsFormProps {
  initialData?: Partial<NewsFormData>;
  isEditing?: boolean;
  newsId?: string;
}

export default function NewsForm({ initialData, isEditing = false, newsId }: NewsFormProps) {
  const router = useRouter();
  const { currentLang, isRTL } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [categories] = useState<Category[]>([
    { id: '1', nameAr: 'البرامج', nameEn: 'Programs' },
    { id: '2', nameAr: 'الفعاليات', nameEn: 'Events' },
    { id: '3', nameAr: 'الشراكات', nameEn: 'Partnerships' },
    { id: '4', nameAr: 'الإنجازات', nameEn: 'Achievements' },
  ]);
  const [availableTags] = useState<Tag[]>([
    { id: '1', nameAr: 'تقنية', nameEn: 'Technology' },
    { id: '2', nameAr: 'تدريب', nameEn: 'Training' },
    { id: '3', nameAr: 'شراكة', nameEn: 'Partnership' },
    { id: '4', nameAr: 'ابتكار', nameEn: 'Innovation' },
  ]);

  const [formData, setFormData] = useState<NewsFormData>({
    titleAr: initialData?.titleAr || '',
    titleEn: initialData?.titleEn || '',
    summaryAr: initialData?.summaryAr || '',
    summaryEn: initialData?.summaryEn || '',
    contentAr: initialData?.contentAr || '',
    contentEn: initialData?.contentEn || '',
    slug: initialData?.slug || '',
    authorAr: initialData?.authorAr || '',
    authorEn: initialData?.authorEn || '',
    image: initialData?.image || '',
    featured: initialData?.featured || false,
    status: initialData?.status || 'DRAFT',
    categoryId: initialData?.categoryId || '',
    tagIds: initialData?.tagIds || [],
  });

  // Auto-generate slug from English title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleInputChange = (field: keyof NewsFormData, value: unknown) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug when English title changes
      if (field === 'titleEn' && value && typeof value === 'string') {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  };

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }));
  };

  const handleSubmit = async (status?: 'DRAFT' | 'REVIEW' | 'PUBLISHED') => {
    setLoading(true);
    
    try {
      const submitData = { 
        ...formData, 
        status: status || formData.status 
      };
      
      // Validate required fields
      if (!submitData.titleAr || !submitData.titleEn || !submitData.contentAr || !submitData.contentEn) {
        toast.error(currentLang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
        setLoading(false);
        return;
      }

      const response = await fetch(isEditing ? `/api/news/${newsId}` : '/api/news', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const successMsg = isEditing 
          ? (currentLang === 'ar' ? 'تم تحديث الخبر بنجاح!' : 'News updated successfully!')
          : (currentLang === 'ar' ? 'تم إنشاء الخبر بنجاح!' : 'News created successfully!');
        toast.success(successMsg);
        router.push('/admin/news');
      } else {
        throw new Error(currentLang === 'ar' ? 'فشل في حفظ الخبر' : 'Failed to save news');
      }
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error(currentLang === 'ar' ? 'فشل في حفظ الخبر. يرجى المحاولة مرة أخرى.' : 'Failed to save news. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    handleSubmit('DRAFT');
  };

  const handlePreview = () => {
    // Open preview in new tab
    const previewData = encodeURIComponent(JSON.stringify(formData));
    window.open(`/admin/news/preview?data=${previewData}`, '_blank');
  };

  const handleBack = () => {
    router.push('/admin/news');
  };

  return (
    <FormLayout
      title={isEditing 
        ? (currentLang === 'ar' ? 'تعديل المقال الإخباري' : 'Edit News Article')
        : (currentLang === 'ar' ? 'إنشاء مقال إخباري جديد' : 'Create News Article')
      }
      description={isEditing 
        ? (currentLang === 'ar' ? 'تحديث معلومات المقال الإخباري' : 'Update the news article information')
        : (currentLang === 'ar' ? 'إنشاء مقال إخباري جديد للنشر' : 'Create a new news article for publication')
      }
      onBack={handleBack}
      onSave={handleSave}
      onPreview={handlePreview}
      loading={loading}
      isEditing={isEditing}
      showPreview={true}
    >
      <div className="space-y-6">
        {/* Bilingual Content Fields */}
        <BilingualTextFields
          titleAr={formData.titleAr}
          titleEn={formData.titleEn}
          summaryAr={formData.summaryAr}
          summaryEn={formData.summaryEn}
          contentAr={formData.contentAr}
          contentEn={formData.contentEn}
          onTitleArChange={(value) => handleInputChange('titleAr', value)}
          onTitleEnChange={(value) => handleInputChange('titleEn', value)}
          onSummaryArChange={(value) => handleInputChange('summaryAr', value)}
          onSummaryEnChange={(value) => handleInputChange('summaryEn', value)}
          onContentArChange={(value) => handleInputChange('contentAr', value)}
          onContentEnChange={(value) => handleInputChange('contentEn', value)}
          titleLabel={currentLang === 'ar' ? 'عنوان المقال' : 'Article Title'}
          summaryLabel={currentLang === 'ar' ? 'ملخص المقال' : 'Article Summary'}
          contentLabel={currentLang === 'ar' ? 'محتوى المقال' : 'Article Content'}
          contentRows={8}
          required
        />

        {/* Author Information */}
        <div className={`bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl p-6 border-2 border-purple-200/30 dark:border-purple-800/30 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h3 className="text-lg font-semibold text-[#00234E] dark:text-gray-100 mb-4 font-readex">
            {currentLang === 'ar' ? 'معلومات الكاتب' : 'Author Information'}
          </h3>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isRTL ? 'md:grid-flow-col-dense' : ''}`}>
            <div className={isRTL ? 'md:order-2' : 'md:order-1'}>
              <Label htmlFor="authorEn" className="font-readex font-medium text-[#00234E] dark:text-gray-100">
                {currentLang === 'ar' ? 'الكاتب (إنجليزي)' : 'Author (English)'}
              </Label>
              <Input
                id="authorEn"
                value={formData.authorEn}
                onChange={(e) => handleInputChange('authorEn', e.target.value)}
                placeholder={currentLang === 'ar' ? 'اسم الكاتب بالإنجليزية' : 'Author name in English'}
                className="font-readex mt-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#00808A] dark:focus:border-[#4db8c4] focus:ring-2 focus:ring-[#00808A]/20 dark:focus:ring-[#4db8c4]/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                dir="ltr"
              />
            </div>
            <div className={isRTL ? 'md:order-1' : 'md:order-2'}>
              <Label htmlFor="authorAr" className="font-readex font-medium text-[#00234E] dark:text-gray-100">
                {currentLang === 'ar' ? 'الكاتب (عربي)' : 'Author (Arabic)'}
              </Label>
              <Input
                id="authorAr"
                value={formData.authorAr}
                onChange={(e) => handleInputChange('authorAr', e.target.value)}
                placeholder={currentLang === 'ar' ? 'اسم الكاتب بالعربية' : 'اسم الكاتب بالعربية'}
                className="font-readex mt-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#00808A] dark:focus:border-[#4db8c4] focus:ring-2 focus:ring-[#00808A]/20 dark:focus:ring-[#4db8c4]/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-6 border-2 border-blue-200/30 dark:border-blue-800/30">
          <h3 className={`text-lg font-semibold text-[#00234E] dark:text-gray-100 mb-4 font-readex ${isRTL ? 'text-right' : 'text-left'}`}>
            {currentLang === 'ar' ? 'الصورة البارزة' : 'Featured Image'}
          </h3>
          <MediaSelector
            selectedImage={formData.image}
            onImageSelect={(url) => handleInputChange('image', url)}
            onImageRemove={() => handleInputChange('image', '')}
            label={currentLang === 'ar' ? 'الصورة البارزة' : 'Featured Image'}
          />
        </div>

        {/* URL Slug */}
        <div className={`bg-gradient-to-r from-teal-50/80 to-cyan-50/80 dark:from-teal-950/20 dark:to-cyan-950/20 rounded-2xl p-6 border-2 border-teal-200/30 dark:border-teal-800/30 ${isRTL ? 'text-right' : 'text-left'}`}>
          <Label htmlFor="slug" className="font-readex font-medium text-[#00234E] dark:text-gray-100 text-lg">
            {currentLang === 'ar' ? 'رابط المقال' : 'URL Slug'}
          </Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder={currentLang === 'ar' ? 'رابط-المقال' : 'article-url-slug'}
            className="font-readex mt-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#00808A] dark:focus:border-[#4db8c4] focus:ring-2 focus:ring-[#00808A]/20 dark:focus:ring-[#4db8c4]/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            dir="ltr"
          />
          <p className={`text-sm text-gray-600 dark:text-gray-400 mt-3 font-readex ${isRTL ? 'text-right' : 'text-left'}`}>
            {currentLang === 'ar' 
              ? 'يُستخدم في الروابط. استخدم الأحرف الصغيرة والأرقام والشرطات فقط.'
              : 'Used in URLs. Use lowercase letters, numbers, and hyphens only.'
            }
          </p>
        </div>

        {/* Publication Settings */}
        <PublicationSettings
          status={formData.status}
          onStatusChange={(status) => handleInputChange('status', status)}
          featured={formData.featured}
          onFeaturedChange={(featured) => handleInputChange('featured', featured)}
          slug={formData.slug}
          onSlugChange={(slug) => handleInputChange('slug', slug)}
          categoryId={formData.categoryId}
          onCategoryChange={(categoryId) => handleInputChange('categoryId', categoryId)}
          selectedTags={formData.tagIds}
          onTagsChange={(tags) => handleInputChange('tagIds', tags)}
          categories={categories.map(c => ({ id: c.id, nameEn: c.nameEn, nameAr: c.nameAr }))}
          availableTags={availableTags.map(t => ({ id: t.id, nameEn: t.nameEn, nameAr: t.nameAr }))}
          showSlug={false} // Already handled above
        />
      </div>
    </FormLayout>
  );
}
