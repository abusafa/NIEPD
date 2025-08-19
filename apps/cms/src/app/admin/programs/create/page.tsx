'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import BilingualTextFields from '@/components/forms/BilingualTextFields';
import MediaSelector from '@/components/forms/MediaSelector';
import PublicationSettings from '@/components/forms/PublicationSettings';
import { toast } from 'sonner';
import { generateSlug } from '@/lib/validation';
import { useCRUD } from '@/hooks/useCRUD';

interface FormData {
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  descriptionAr: string;
  descriptionEn: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  duration: string;
  durationType: 'HOURS' | 'DAYS' | 'WEEKS' | 'MONTHS';
  rating: string;
  participants: string;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  featured: boolean;
  featuredImage: string;
  requirements: string[];
  objectives: string[];
  slug: string;
  categoryId: string;
  selectedTags: string[];
  isFree: boolean;
  isCertified: boolean;
}

const levels = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
  { value: 'EXPERT', label: 'Expert' },
];

const durationTypes = [
  { value: 'HOURS', label: 'Hours' },
  { value: 'DAYS', label: 'Days' },
  { value: 'WEEKS', label: 'Weeks' },
  { value: 'MONTHS', label: 'Months' },
];

export default function CreateProgramPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    titleAr: '',
    titleEn: '',
    summaryAr: '',
    summaryEn: '',
    descriptionAr: '',
    descriptionEn: '',
    level: 'BEGINNER',
    duration: '',
    durationType: 'HOURS',
    rating: '',
    participants: '',
    status: 'DRAFT',
    featured: false,
    featuredImage: '',
    requirements: [],
    objectives: [],
    slug: '',
    categoryId: '',
    selectedTags: [],
    isFree: true,
    isCertified: false,
  });

  const [saving, setSaving] = useState(false);
  const [requirementInput, setRequirementInput] = useState('');
  const [objectiveInput, setObjectiveInput] = useState('');

  // Auto-generate slug from English title
  useEffect(() => {
    if (formData.titleEn && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.titleEn)
      }));
    }
  }, [formData.titleEn]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }));
      setRequirementInput('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addObjective = () => {
    if (objectiveInput.trim()) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, objectiveInput.trim()]
      }));
      setObjectiveInput('');
    }
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.titleAr.trim() || !formData.titleEn.trim()) {
      toast.error('Please provide titles in both languages');
      return;
    }

    if (!formData.descriptionAr.trim() || !formData.descriptionEn.trim()) {
      toast.error('Please provide descriptions in both languages');
      return;
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      toast.error('Please provide a valid duration');
      return;
    }

    if (!formData.slug.trim()) {
      toast.error('Please provide a URL slug');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titleAr: formData.titleAr,
          titleEn: formData.titleEn,
          descriptionAr: formData.descriptionAr,
          descriptionEn: formData.descriptionEn,
          slug: formData.slug,
          duration: parseInt(formData.duration),
          durationType: formData.durationType,
          level: formData.level,
          image: formData.featuredImage,
          prerequisites: formData.requirements,
          learningOutcomes: formData.objectives,
          featured: formData.featured,
          isFree: formData.isFree,
          isCertified: formData.isCertified,
          status: formData.status,
          categoryId: formData.categoryId || null,
          tagIds: formData.selectedTags,
        }),
      });

      if (response.ok) {
        const createdProgram = await response.json();
        toast.success('Program created successfully');
        router.push(`/admin/programs/${createdProgram.id}`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create program');
      }
    } catch (error) {
      console.error('Error creating program:', error);
      toast.error('Failed to create program');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/programs');
  };

  return (
    <FormLayout
      title="Create New Program"
      description="Add a new training program to the system"
      onBack={handleBack}
      onSave={handleSave}
      loading={saving}
      isEditing={false}
    >
      <div className="space-y-6">
        {/* Bilingual Title, Summary, and Description */}
        <BilingualTextFields
          titleAr={formData.titleAr}
          titleEn={formData.titleEn}
          summaryAr={formData.summaryAr}
          summaryEn={formData.summaryEn}
          contentAr={formData.descriptionAr}
          contentEn={formData.descriptionEn}
          onTitleArChange={(value) => handleInputChange('titleAr', value)}
          onTitleEnChange={(value) => handleInputChange('titleEn', value)}
          onSummaryArChange={(value) => handleInputChange('summaryAr', value)}
          onSummaryEnChange={(value) => handleInputChange('summaryEn', value)}
          onContentArChange={(value) => handleInputChange('descriptionAr', value)}
          onContentEnChange={(value) => handleInputChange('descriptionEn', value)}
          titleLabel="Program Title"
          summaryLabel="Program Summary"
          contentLabel="Program Description"
          contentRows={6}
        />

        {/* Program Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="level">Level *</Label>
            <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {levels.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="40"
                min="1"
                required
              />
            </div>
            <div>
              <Label htmlFor="durationType">Type</Label>
              <Select value={formData.durationType} onValueChange={(value) => handleInputChange('durationType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durationTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="rating">Rating (1-5)</Label>
            <Input
              id="rating"
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => handleInputChange('rating', e.target.value)}
              placeholder="4.8"
            />
          </div>

          <div>
            <Label htmlFor="participants">Total Participants</Label>
            <Input
              id="participants"
              type="number"
              value={formData.participants}
              onChange={(e) => handleInputChange('participants', e.target.value)}
              placeholder="1250"
              min="0"
            />
          </div>
        </div>

        {/* Program Requirements */}
        <div>
          <Label>Program Requirements</Label>
          <div className="space-y-3 mt-2">
            <div className="flex gap-2">
              <Input
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                placeholder="Enter a program requirement"
                onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
              />
              <button
                type="button"
                onClick={addRequirement}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            {formData.requirements.length > 0 && (
              <div className="space-y-2">
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span className="flex-1 text-sm">{requirement}</span>
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Learning Objectives */}
        <div>
          <Label>Learning Objectives</Label>
          <div className="space-y-3 mt-2">
            <div className="flex gap-2">
              <Input
                value={objectiveInput}
                onChange={(e) => setObjectiveInput(e.target.value)}
                placeholder="Enter a learning objective"
                onKeyPress={(e) => e.key === 'Enter' && addObjective()}
              />
              <button
                type="button"
                onClick={addObjective}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add
              </button>
            </div>
            {formData.objectives.length > 0 && (
              <div className="space-y-2">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span className="flex-1 text-sm">{objective}</span>
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Featured Image */}
        <MediaSelector
          selectedImage={formData.featuredImage}
          onImageSelect={(url) => handleInputChange('featuredImage', url)}
          onImageRemove={() => handleInputChange('featuredImage', '')}
          label="Program Featured Image"
        />

        {/* URL Slug */}
        <div>
          <Label htmlFor="slug">URL Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="program-url-slug"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Used in URLs. Use lowercase letters, numbers, and hyphens only.
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
