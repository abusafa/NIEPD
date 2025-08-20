'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  template: 'page' | 'policy' | 'about' | 'service';
  language: 'AR' | 'EN' | 'BOTH';
  featured: boolean;
  sortOrder: string;
  parentId: string;
  categoryId: string;
  selectedTags: string[];
}

const pageTemplates = [
  { value: 'page', label: 'Regular Page' },
  { value: 'policy', label: 'Policy Document' },
  { value: 'about', label: 'About Page' },
  { value: 'service', label: 'Service Page' },
];

const languageOptions = [
  { value: 'BOTH', label: 'Both Languages' },
  { value: 'AR', label: 'Arabic Only' },
  { value: 'EN', label: 'English Only' },
];

export default function CreatePagePage() {
  const router = useRouter();

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
    template: 'page',
    language: 'BOTH',
    featured: false,
    sortOrder: '0',
    parentId: '',
    categoryId: '',
    selectedTags: [],
  });

  const [saving, setSaving] = useState(false);

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
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titleAr: formData.titleAr,
          titleEn: formData.titleEn,
          contentAr: formData.contentAr,
          contentEn: formData.contentEn,
          slug: formData.slug,
          metaTitleAr: formData.metaTitleAr,
          metaTitleEn: formData.metaTitleEn,
          metaDescriptionAr: formData.metaDescriptionAr,
          metaDescriptionEn: formData.metaDescriptionEn,
          template: formData.template,
          language: formData.language,
          parentId: formData.parentId || null,
          status: formData.status,
          sortOrder: parseInt(formData.sortOrder) || 0,
        }),
      });

      if (response.ok) {
        const createdPage = await response.json();
        toast.success('Page created successfully');
        router.push(`/admin/pages/${createdPage.id}`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create page');
      }
    } catch (error) {
      console.error('Error creating page:', error);
      toast.error('Failed to create page');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/pages');
  };

  return (
    <FormLayout
      title="Create New Page"
      description="Add a new page to the website"
      onBack={handleBack}
      onSave={handleSave}
      loading={saving}
      isEditing={false}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="template">Page Template</Label>
            <Select value={formData.template} onValueChange={(value) => handleInputChange('template', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageTemplates.map(template => (
                  <SelectItem key={template.value} value={template.value}>
                    {template.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language">Language Support</Label>
            <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map(lang => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
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
