'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FormLayout from '@/components/shared/FormLayout';
import BilingualTextFields from '@/components/forms/BilingualTextFields';
import MediaSelector from '@/components/forms/MediaSelector';
import PublicationSettings from '@/components/forms/PublicationSettings';
import { toast } from 'sonner';
import { generateSlug } from '@/lib/validation';

interface FormData {
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  contentAr: string;
  contentEn: string;
  slug: string;
  metaTitleAr: string;
  metaTitleEn: string;
  metaDescriptionAr: string;
  metaDescriptionEn: string;
  featuredImage: string;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  type: 'PAGE' | 'POLICY' | 'ABOUT' | 'SERVICE';
  featured: boolean;
  sortOrder: string;
  categoryId: string;
  selectedTags: string[];
}

const pageTypes = [
  { value: 'PAGE', label: 'Regular Page' },
  { value: 'POLICY', label: 'Policy Document' },
  { value: 'ABOUT', label: 'About Page' },
  { value: 'SERVICE', label: 'Service Page' },
];

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;

  const [formData, setFormData] = useState<FormData>({
    titleAr: '',
    titleEn: '',
    summaryAr: '',
    summaryEn: '',
    contentAr: '',
    contentEn: '',
    slug: '',
    metaTitleAr: '',
    metaTitleEn: '',
    metaDescriptionAr: '',
    metaDescriptionEn: '',
    featuredImage: '',
    status: 'DRAFT',
    type: 'PAGE',
    featured: false,
    sortOrder: '0',
    categoryId: '',
    selectedTags: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (pageId) {
      fetchPage();
    }
  }, [pageId]);

  // Auto-generate slug and meta titles from English title
  useEffect(() => {
    if (formData.titleEn) {
      if (!formData.slug) {
        setFormData(prev => ({
          ...prev,
          slug: generateSlug(formData.titleEn)
        }));
      }
      if (!formData.metaTitleEn) {
        setFormData(prev => ({
          ...prev,
          metaTitleEn: `${formData.titleEn} - NIEPD`
        }));
      }
    }
  }, [formData.titleEn]);

  useEffect(() => {
    if (formData.titleAr && !formData.metaTitleAr) {
      setFormData(prev => ({
        ...prev,
        metaTitleAr: `${formData.titleAr} - المعهد الوطني للتطوير المهني التعليمي`
      }));
    }
  }, [formData.titleAr]);

  const fetchPage = async () => {
    try {
      // Mock data - replace with API call
      const mockPage = {
        titleAr: 'حول المعهد الوطني للتطوير المهني التعليمي',
        titleEn: 'About National Institute for Educational Professional Development',
        summaryAr: 'المعهد الوطني للتطوير المهني التعليمي هو مؤسسة رائدة في مجال التطوير المهني للمعلمين والقيادات التعليمية',
        summaryEn: 'The National Institute for Educational Professional Development is a leading institution in professional development for teachers and educational leaders',
        contentAr: 'يعتبر المعهد الوطني للتطوير المهني التعليمي من أبرز المؤسسات التعليمية المتخصصة في تطوير قدرات المعلمين والقيادات التعليمية. يسعى المعهد إلى تحقيق رؤية المملكة العربية السعودية 2030 في مجال التعليم من خلال برامج تدريبية متطورة وحلول مبتكرة.',
        contentEn: 'The National Institute for Educational Professional Development is one of the most prominent educational institutions specialized in developing the capabilities of teachers and educational leaders. The Institute seeks to achieve the Kingdom of Saudi Arabia Vision 2030 in education through advanced training programs and innovative solutions.',
        slug: 'about-institute',
        metaTitleAr: 'حول المعهد - المعهد الوطني للتطوير المهني التعليمي',
        metaTitleEn: 'About Institute - National Institute for Educational Professional Development',
        metaDescriptionAr: 'تعرف على المعهد الوطني للتطوير المهني التعليمي ورؤيته ورسالته في تطوير التعليم',
        metaDescriptionEn: 'Learn about the National Institute for Educational Professional Development and its vision and mission in developing education',
        featuredImage: '/uploads/pages/about-institute.jpg',
        status: 'PUBLISHED' as const,
        type: 'ABOUT' as const,
        featured: true,
        sortOrder: '1',
        categoryId: 'cat-1',
        selectedTags: ['tag-1'],
      };

      setFormData(mockPage);
    } catch (error) {
      console.error('Error fetching page:', error);
      toast.error('Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.titleAr.trim() || !formData.titleEn.trim()) {
      toast.error('Please provide titles in both languages');
      return;
    }

    if (!formData.contentAr.trim() || !formData.contentEn.trim()) {
      toast.error('Please provide content in both languages');
      return;
    }

    if (!formData.slug.trim()) {
      toast.error('Please provide a URL slug');
      return;
    }

    setSaving(true);
    try {
      // Mock save - replace with API call
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          sortOrder: parseInt(formData.sortOrder) || 0,
        }),
      });

      if (response.ok) {
        toast.success('Page updated successfully');
        router.push(`/admin/pages/${pageId}`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update page');
      }
    } catch (error) {
      console.error('Error updating page:', error);
      toast.error('Failed to update page');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/admin/pages/${pageId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <FormLayout
      title="Edit Page"
      description="Update page content and settings"
      onBack={handleBack}
      onSave={handleSave}
      loading={saving}
      isEditing={true}
    >
      <div className="space-y-6">
        {/* Bilingual Title, Summary, and Content */}
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
          titleLabel="Page Title"
          summaryLabel="Page Summary"
          contentLabel="Page Content"
          contentRows={12}
        />

        {/* Page Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="type">Page Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              type="number"
              value={formData.sortOrder}
              onChange={(e) => handleInputChange('sortOrder', e.target.value)}
              placeholder="0"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lower numbers appear first in lists
            </p>
          </div>
        </div>

        {/* URL Slug */}
        <div>
          <Label htmlFor="slug">URL Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="page-url-slug"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be the page URL. Use lowercase letters, numbers, and hyphens only.
          </p>
        </div>

        {/* Featured Image */}
        <MediaSelector
          selectedImage={formData.featuredImage}
          onImageSelect={(url) => handleInputChange('featuredImage', url)}
          onImageRemove={() => handleInputChange('featuredImage', '')}
          label="Page Featured Image"
        />

        {/* SEO Meta Tags - English */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">SEO Settings - English</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="metaTitleEn">Meta Title (English)</Label>
              <Input
                id="metaTitleEn"
                value={formData.metaTitleEn}
                onChange={(e) => handleInputChange('metaTitleEn', e.target.value)}
                placeholder="Page Title - NIEPD"
                maxLength={60}
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended length: 50-60 characters
              </p>
            </div>

            <div>
              <Label htmlFor="metaDescriptionEn">Meta Description (English)</Label>
              <Input
                id="metaDescriptionEn"
                value={formData.metaDescriptionEn}
                onChange={(e) => handleInputChange('metaDescriptionEn', e.target.value)}
                placeholder="Brief description of this page for search engines"
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended length: 120-160 characters
              </p>
            </div>
          </div>
        </div>

        {/* SEO Meta Tags - Arabic */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">SEO Settings - Arabic</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="metaTitleAr">Meta Title (Arabic)</Label>
              <Input
                id="metaTitleAr"
                value={formData.metaTitleAr}
                onChange={(e) => handleInputChange('metaTitleAr', e.target.value)}
                placeholder="عنوان الصفحة - المعهد الوطني للتطوير المهني التعليمي"
                dir="rtl"
                maxLength={60}
              />
              <p className="text-xs text-gray-500 mt-1">
                الطول المُوصى به: 50-60 حرف
              </p>
            </div>

            <div>
              <Label htmlFor="metaDescriptionAr">Meta Description (Arabic)</Label>
              <Input
                id="metaDescriptionAr"
                value={formData.metaDescriptionAr}
                onChange={(e) => handleInputChange('metaDescriptionAr', e.target.value)}
                placeholder="وصف مختصر للصفحة لمحركات البحث"
                dir="rtl"
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">
                الطول المُوصى به: 120-160 حرف
              </p>
            </div>
          </div>
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
          selectedTags={formData.selectedTags}
          onTagsChange={(tags) => handleInputChange('selectedTags', tags)}
          categories={[]} // Mock - replace with real categories
          availableTags={[]} // Mock - replace with real tags
          showSlug={false} // Already handled above
        />
      </div>
    </FormLayout>
  );
}
