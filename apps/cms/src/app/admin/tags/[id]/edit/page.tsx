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
}

const tagTypes = [
  { value: 'GENERAL', label: 'General Tag' },
  { value: 'NEWS', label: 'News Tag' },
  { value: 'PROGRAMS', label: 'Programs Tag' },
  { value: 'EVENTS', label: 'Events Tag' },
  { value: 'PAGES', label: 'Pages Tag' },
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

export default function EditTagPage() {
  const router = useRouter();
  const params = useParams();
  const tagId = params.id as string;

  const [formData, setFormData] = useState<FormData>({
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    slug: '',
    type: 'GENERAL',
    color: '#8B5CF6',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (tagId) {
      fetchTag();
    }
  }, [tagId]);

  // Auto-generate slug from English name
  useEffect(() => {
    if (formData.nameEn && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.nameEn)
      }));
    }
  }, [formData.nameEn]);

  const fetchTag = async () => {
    try {
      // Mock data - replace with API call
      const mockTag = {
        nameAr: 'التعلم الرقمي',
        nameEn: 'Digital Learning',
        descriptionAr: 'علامة تشير إلى المحتوى المتعلق بالتعلم الرقمي والتكنولوجيا التعليمية، بما في ذلك الأدوات والمنصات والاستراتيجيات الرقمية.',
        descriptionEn: 'Tag indicating content related to digital learning and educational technology, including digital tools, platforms, and strategies.',
        slug: 'digital-learning',
        type: 'GENERAL' as const,
        color: '#8B5CF6',
      };

      setFormData(mockTag);
    } catch (error) {
      console.error('Error fetching tag:', error);
      toast.error('Failed to load tag');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.nameAr.trim() || !formData.nameEn.trim()) {
      toast.error('Please provide tag names in both languages');
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

    setSaving(true);
    try {
      // Mock save - replace with API call
      const response = await fetch(`/api/tags/${tagId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Tag updated successfully');
        router.push(`/admin/tags/${tagId}`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update tag');
      }
    } catch (error) {
      console.error('Error updating tag:', error);
      toast.error('Failed to update tag');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/admin/tags/${tagId}`);
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
      title="Edit Tag"
      description="Update tag information and settings"
      onBack={handleBack}
      onSave={handleSave}
      loading={saving}
      isEditing={true}
    >
      <div className="space-y-6">
        {/* Tag Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="nameEn">Tag Name (English) *</Label>
            <Input
              id="nameEn"
              value={formData.nameEn}
              onChange={(e) => handleInputChange('nameEn', e.target.value)}
              placeholder="Digital Learning"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Use title case (e.g., "Digital Learning")
            </p>
          </div>
          <div>
            <Label htmlFor="nameAr">Tag Name (Arabic) *</Label>
            <Input
              id="nameAr"
              value={formData.nameAr}
              onChange={(e) => handleInputChange('nameAr', e.target.value)}
              placeholder="التعلم الرقمي"
              dir="rtl"
              required
            />
          </div>
        </div>

        {/* Tag Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="descriptionEn">Description (English)</Label>
            <Textarea
              id="descriptionEn"
              value={formData.descriptionEn}
              onChange={(e) => handleInputChange('descriptionEn', e.target.value)}
              placeholder="Describe what content this tag represents..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="descriptionAr">Description (Arabic)</Label>
            <Textarea
              id="descriptionAr"
              value={formData.descriptionAr}
              onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
              placeholder="وصف المحتوى الذي تمثله هذه العلامة..."
              dir="rtl"
              rows={4}
            />
          </div>
        </div>

        {/* Tag Type */}
        <div>
          <Label htmlFor="type">Tag Type</Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
            <SelectTrigger className="w-full md:w-1/2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tagTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            General tags can be used across all content types, specific tags are limited to their content type
          </p>
        </div>

        {/* URL Slug */}
        <div>
          <Label htmlFor="slug">URL Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="digital-learning"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Used in URLs and hashtags (#digital-learning). Must be unique and contain only lowercase letters, numbers, and hyphens.
          </p>
        </div>

        {/* Color Selection */}
        <div>
          <Label>Tag Color</Label>
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
              <span className="text-xs text-gray-500">Used for tag badges and visual identification</span>
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

        {/* Tag Preview */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <Label className="text-sm font-medium text-gray-700">Preview</Label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Tag Badge:</span>
              <span 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: formData.color }}
              >
                {formData.nameEn || 'Tag Name'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Hashtag:</span>
              <span className="text-sm font-mono text-gray-800">
                #{formData.slug || 'tag-slug'}
              </span>
            </div>
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">💡 Tag Best Practices</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Keep tag names concise and descriptive</li>
            <li>• Use consistent naming conventions (e.g., always use singular or plural forms)</li>
            <li>• Avoid overly specific tags that will rarely be used</li>
            <li>• Consider creating general tags that can be used across multiple content types</li>
            <li>• Choose colors that make tags easily distinguishable from each other</li>
            <li>• Tags currently in use cannot be deleted, only renamed or recolored</li>
          </ul>
        </div>
      </div>
    </FormLayout>
  );
}
