'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FormLayout from '@/components/shared/FormLayout';
import { toast } from 'sonner';
import { generateSlug } from '@/lib/validation';

interface FormData {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  slug: string;
  type: 'NEWS' | 'PROGRAMS' | 'EVENTS' | 'PAGES' | 'GENERAL';
  color: string;
  parentId: string;
}

const categoryTypes = [
  { value: 'GENERAL', label: 'General Category' },
  { value: 'NEWS', label: 'News Category' },
  { value: 'PROGRAMS', label: 'Programs Category' },
  { value: 'EVENTS', label: 'Events Category' },
  { value: 'PAGES', label: 'Pages Category' },
];

const defaultColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6B7280', // Gray
];

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const [formData, setFormData] = useState<FormData>({
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    slug: '',
    type: 'GENERAL',
    color: '#3B82F6',
    parentId: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<Array<{id: string, nameEn: string, nameAr: string}>>([]);

  useEffect(() => {
    if (categoryId) {
      fetchCategory();
      fetchAvailableCategories();
    }
  }, [categoryId]);

  // Auto-generate slug from English name
  useEffect(() => {
    if (formData.nameEn && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.nameEn)
      }));
    }
  }, [formData.nameEn]);

  const fetchCategory = async () => {
    try {
      // Mock data - replace with API call
      const mockCategory = {
        nameAr: 'التطوير المهني',
        nameEn: 'Professional Development',
        descriptionAr: 'فئة تضم جميع المحتويات المتعلقة بالتطوير المهني للمعلمين والقيادات التعليمية، بما في ذلك البرامج التدريبية وورش العمل والندوات المتخصصة.',
        descriptionEn: 'Category containing all content related to professional development for teachers and educational leaders, including training programs, workshops, and specialized seminars.',
        slug: 'professional-development',
        type: 'GENERAL' as const,
        color: '#3B82F6',
        parentId: '',
      };

      setFormData(mockCategory);
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error('Failed to load category');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCategories = async () => {
    try {
      // Mock data - replace with API call
      const mockCategories = [
        { id: 'cat-1', nameEn: 'Education', nameAr: 'التعليم' },
        { id: 'cat-2', nameEn: 'Technology', nameAr: 'التكنولوجيا' },
        { id: 'cat-3', nameEn: 'Leadership', nameAr: 'القيادة' },
      ].filter(cat => cat.id !== categoryId); // Exclude current category

      setAvailableCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (field: keyof FormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.nameAr.trim() || !formData.nameEn.trim()) {
      toast.error('Please provide category names in both languages');
      return;
    }

    if (!formData.slug.trim()) {
      toast.error('Please provide a URL slug');
      return;
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(formData.slug)) {
      toast.error('Slug must contain only lowercase letters, numbers, and hyphens');
      return;
    }

    // Prevent circular hierarchy
    if (formData.parentId === categoryId) {
      toast.error('A category cannot be its own parent');
      return;
    }

    setSaving(true);
    try {
      // Mock save - replace with API call
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
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
        toast.success('Category updated successfully');
        router.push(`/admin/categories/${categoryId}`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/admin/categories/${categoryId}`);
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
      title="Edit Category"
      description="Update category information and settings"
      onBack={handleBack}
      onSave={handleSave}
      loading={saving}
      isEditing={true}
    >
      <div className="space-y-6">
        {/* Category Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="nameEn">Category Name (English) *</Label>
            <Input
              id="nameEn"
              value={formData.nameEn}
              onChange={(e) => handleInputChange('nameEn', e.target.value)}
              placeholder="Professional Development"
              required
            />
          </div>
          <div>
            <Label htmlFor="nameAr">Category Name (Arabic) *</Label>
            <Input
              id="nameAr"
              value={formData.nameAr}
              onChange={(e) => handleInputChange('nameAr', e.target.value)}
              placeholder="التطوير المهني"
              dir="rtl"
              required
            />
          </div>
        </div>

        {/* Category Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="descriptionEn">Description (English)</Label>
            <Textarea
              id="descriptionEn"
              value={formData.descriptionEn}
              onChange={(e) => handleInputChange('descriptionEn', e.target.value)}
              placeholder="Describe what this category contains..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="descriptionAr">Description (Arabic)</Label>
            <Textarea
              id="descriptionAr"
              value={formData.descriptionAr}
              onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
              placeholder="وصف محتويات هذه الفئة..."
              dir="rtl"
              rows={4}
            />
          </div>
        </div>

        {/* Category Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="type">Category Type</Label>
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
            <p className="text-xs text-gray-500 mt-1">
              General categories can be used across all content types
            </p>
          </div>

          <div>
            <Label htmlFor="parentId">Parent Category (Optional)</Label>
            <Select 
              value={formData.parentId || 'none'} 
              onValueChange={(value) => handleInputChange('parentId', value === 'none' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="No parent category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No parent category</SelectItem>
                {availableCategories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.nameEn} / {category.nameAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Create hierarchical category structure
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
            placeholder="professional-development"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Used in URLs and must be unique. Use lowercase letters, numbers, and hyphens only.
          </p>
        </div>

        {/* Color Selection */}
        <div>
          <Label>Category Color</Label>
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: formData.color }}
              />
              <Input
                type="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className="w-20 h-8 p-1 border rounded"
              />
              <span className="text-sm text-gray-600">{formData.color}</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Label className="text-sm text-gray-600 w-full mb-1">Quick Colors:</Label>
              {defaultColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleInputChange('color', color)}
                  className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${
                    formData.color === color ? 'border-gray-900' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Usage Warning */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-medium text-amber-800 mb-2">⚠️ Important Notes</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Changing the category type may affect existing content associations</li>
            <li>• The URL slug must be unique across all categories</li>
            <li>• Categories currently in use cannot be deleted</li>
            <li>• Color changes will be reflected immediately across the site</li>
          </ul>
        </div>
      </div>
    </FormLayout>
  );
}
