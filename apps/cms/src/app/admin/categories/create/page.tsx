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
import { useCRUD } from '@/hooks/useCRUD';
import { validateObject, createBilingualSchema, commonRules, generateSlug } from '@/lib/validation';
import { toast } from 'sonner';

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  type: string;
}

interface FormData {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  slug: string;
  type: string;
  color: string;
  parentId: string;
}

const categoryTypes = [
  { value: 'GENERAL', label: 'General' },
  { value: 'NEWS', label: 'News' },
  { value: 'PROGRAMS', label: 'Programs' },
  { value: 'EVENTS', label: 'Events' },
  { value: 'PAGES', label: 'Pages' },
];

const colorOptions = [
  { value: '#3B82F6', label: 'Blue', class: 'bg-blue-500' },
  { value: '#10B981', label: 'Green', class: 'bg-green-500' },
  { value: '#8B5CF6', label: 'Purple', class: 'bg-purple-500' },
  { value: '#F59E0B', label: 'Orange', class: 'bg-orange-500' },
  { value: '#EF4444', label: 'Red', class: 'bg-red-500' },
  { value: '#6B7280', label: 'Gray', class: 'bg-gray-500' },
];

export default function CreateCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    slug: '',
    type: 'GENERAL',
    color: '#3B82F6',
    parentId: 'none',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Fetch existing categories for parent selection
  const [categoriesState] = useCRUD<Category>({
    endpoint: '/api/categories',
    resourceName: 'Category',
  });

  // Auto-generate slug from English title
  useEffect(() => {
    if (formData.nameEn && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.nameEn)
      }));
    }
  }, [formData.nameEn]);

  const validationSchema = {
    ...createBilingualSchema({ name: { required: true, minLength: 2, maxLength: 100 } }),
    slug: { ...commonRules.slug, required: true },
    type: { required: true },
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = async () => {
    // Basic form validation
    const newErrors: Record<string, string> = {};
    if (!formData.nameAr.trim()) newErrors.nameAr = 'Arabic name is required';
    if (!formData.nameEn.trim()) newErrors.nameEn = 'English name is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the validation errors');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId && formData.parentId !== 'none' ? formData.parentId : null,
        }),
      });

      if (response.ok) {
        toast.success('Category created successfully');
        router.push('/admin/categories');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/categories');
  };

  return (
    <FormLayout
      title="Create New Category"
      description="Add a new category to organize your content"
      onBack={handleBack}
      onSave={handleSave}
      loading={loading}
    >
      <div className="space-y-6">
        {/* Bilingual Name Fields */}
        <BilingualTextFields
          titleAr={formData.nameAr}
          titleEn={formData.nameEn}
          onTitleArChange={(value) => handleInputChange('nameAr', value)}
          onTitleEnChange={(value) => handleInputChange('nameEn', value)}
          titleLabel="Category Name"
          showSummary={false}
          showContent={false}
        />
        {errors.nameAr && <p className="text-sm text-red-600">{errors.nameAr}</p>}
        {errors.nameEn && <p className="text-sm text-red-600">{errors.nameEn}</p>}

        {/* Bilingual Description Fields */}
        <BilingualTextFields
          titleAr="" // Not used
          titleEn="" // Not used
          summaryAr={formData.descriptionAr}
          summaryEn={formData.descriptionEn}
          onTitleArChange={() => {}} // Not used
          onTitleEnChange={() => {}} // Not used
          onSummaryArChange={(value) => handleInputChange('descriptionAr', value)}
          onSummaryEnChange={(value) => handleInputChange('descriptionEn', value)}
          showSummary={true}
          showContent={false}
          summaryLabel="Description"
          titleLabel="Not Used"
        />

        {/* URL Slug */}
        <div>
          <Label htmlFor="slug">URL Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="category-url-slug"
            className={errors.slug ? 'border-red-500' : ''}
          />
          {errors.slug && <p className="text-sm text-red-600">{errors.slug}</p>}
          <p className="text-xs text-gray-500 mt-1">
            Used in URLs. Use lowercase letters, numbers, and hyphens only.
          </p>
        </div>

        {/* Category Type */}
        <div>
          <Label htmlFor="type">Category Type *</Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Parent Category */}
        <div>
          <Label htmlFor="parentId">Parent Category</Label>
          <Select value={formData.parentId} onValueChange={(value) => handleInputChange('parentId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="No parent (root category)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                <span className="text-gray-500">No parent (root category)</span>
              </SelectItem>
              {categoriesState.items.filter(cat => cat.type === formData.type || cat.type === 'GENERAL').map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.nameEn} - {category.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Optional. Select a parent to create a subcategory.
          </p>
        </div>

        {/* Color */}
        <div>
          <Label htmlFor="color">Color Theme</Label>
          <div className="flex gap-2 mt-2">
            {colorOptions.map(color => (
              <button
                key={color.value}
                type="button"
                className={`w-8 h-8 rounded-full border-2 ${color.class} ${
                  formData.color === color.value ? 'border-gray-800' : 'border-gray-300'
                }`}
                onClick={() => handleInputChange('color', color.value)}
                title={color.label}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Choose a color to visually distinguish this category.
          </p>
        </div>
      </div>
    </FormLayout>
  );
}
