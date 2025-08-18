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

export default function EditProgramPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params.id as string;

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
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [requirementInput, setRequirementInput] = useState('');
  const [objectiveInput, setObjectiveInput] = useState('');

  useEffect(() => {
    if (programId) {
      fetchProgram();
    }
  }, [programId]);

  // Auto-generate slug from English title
  useEffect(() => {
    if (formData.titleEn && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.titleEn)
      }));
    }
  }, [formData.titleEn]);

  const fetchProgram = async () => {
    try {
      // Mock data - replace with API call
      const mockProgram = {
        titleAr: 'برنامج تطوير المهارات القيادية للمعلمين',
        titleEn: 'Leadership Skills Development Program for Teachers',
        summaryAr: 'برنامج تدريبي شامل يهدف إلى تطوير المهارات القيادية لدى المعلمين وتعزيز قدراتهم على القيادة التعليمية الفعالة',
        summaryEn: 'Comprehensive training program aimed at developing leadership skills among teachers and enhancing their effective educational leadership capabilities',
        descriptionAr: 'هذا البرنامج التدريبي المتقدم يركز على تنمية المهارات القيادية الأساسية للمعلمين، بما في ذلك القيادة التحويلية، إدارة الفرق، واتخاذ القرارات الاستراتيجية في البيئة التعليمية.',
        descriptionEn: 'This advanced training program focuses on developing essential leadership skills for teachers, including transformational leadership, team management, and strategic decision-making in the educational environment.',
        level: 'INTERMEDIATE' as const,
        duration: '40',
        durationType: 'HOURS' as const,
        rating: '4.8',
        participants: '1250',
        status: 'PUBLISHED' as const,
        featured: true,
        featuredImage: '/uploads/programs/leadership-program.jpg',
        requirements: [
          'Minimum 2 years teaching experience',
          'Bachelor degree in Education or related field',
          'Basic computer skills',
          'Fluency in Arabic and English'
        ],
        objectives: [
          'Develop transformational leadership skills',
          'Master effective communication techniques',
          'Learn strategic planning and decision-making',
          'Build collaborative team management skills',
          'Understand change management in education'
        ],
        slug: 'leadership-skills-development-program',
        categoryId: 'cat-1',
        selectedTags: ['tag-1', 'tag-2'],
      };

      setFormData(mockProgram);
    } catch (error) {
      console.error('Error fetching program:', error);
      toast.error('Failed to load program');
    } finally {
      setLoading(false);
    }
  };

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

    setSaving(true);
    try {
      // Mock save - replace with API call
      const response = await fetch(`/api/programs/${programId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          duration: parseInt(formData.duration),
          rating: formData.rating ? parseFloat(formData.rating) : null,
          participants: formData.participants ? parseInt(formData.participants) : null,
        }),
      });

      if (response.ok) {
        toast.success('Program updated successfully');
        router.push(`/admin/programs/${programId}`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update program');
      }
    } catch (error) {
      console.error('Error updating program:', error);
      toast.error('Failed to update program');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/admin/programs/${programId}`);
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
      title="Edit Program"
      description="Update training program information and details"
      onBack={handleBack}
      onSave={handleSave}
      loading={saving}
      isEditing={true}
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
          <Label htmlFor="slug">URL Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="program-url-slug"
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
