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
import { useLanguage } from '@/contexts/LanguageContext';

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

// These will be translated in the component using currentLang

export default function EditProgramPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params.id as string;
  const { currentLang, t } = useLanguage();

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

  // Dynamic translation arrays
  const levels = [
    { value: 'BEGINNER', label: currentLang === 'ar' ? 'مبتدئ' : 'Beginner' },
    { value: 'INTERMEDIATE', label: currentLang === 'ar' ? 'متوسط' : 'Intermediate' },
    { value: 'ADVANCED', label: currentLang === 'ar' ? 'متقدم' : 'Advanced' },
    { value: 'EXPERT', label: currentLang === 'ar' ? 'خبير' : 'Expert' },
  ];

  const durationTypes = [
    { value: 'HOURS', label: currentLang === 'ar' ? 'ساعة' : 'Hours' },
    { value: 'DAYS', label: currentLang === 'ar' ? 'يوم' : 'Days' },
    { value: 'WEEKS', label: currentLang === 'ar' ? 'أسبوع' : 'Weeks' },
    { value: 'MONTHS', label: currentLang === 'ar' ? 'شهر' : 'Months' },
  ];

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
      const response = await fetch(`/api/programs/${programId}`);

      if (response.ok) {
        const program = await response.json();
        setFormData({
          titleAr: program.titleAr || '',
          titleEn: program.titleEn || '',
          summaryAr: program.descriptionAr || '', // Using descriptionAr for both
          summaryEn: program.descriptionEn || '', // Using descriptionEn for both
          descriptionAr: program.descriptionAr || '',
          descriptionEn: program.descriptionEn || '',
          level: program.level || 'BEGINNER',
          duration: program.duration?.toString() || '0',
          durationType: program.durationType || 'HOURS',
          rating: program.rating?.toString() || '0',
          participants: program.participants?.toString() || '0',
          status: program.status || 'DRAFT',
          featured: program.featured || false,
          featuredImage: program.image || '',
          requirements: program.prerequisites ? program.prerequisites.split('\n').filter(Boolean) : [],
          objectives: [], // Not stored in database yet
          slug: program.slug || '',
          categoryId: program.categoryId || '',
          selectedTags: program.tags ? program.tags.map((t: { tag: { id: string } }) => t.tag.id) : [],
        });
      } else {
        toast.error(currentLang === 'ar' ? 'فشل في تحميل بيانات البرنامج' : 'Failed to load program data');
      }
    } catch (error) {
      console.error('Error fetching program:', error);
      toast.error(currentLang === 'ar' ? 'فشل في تحميل البرنامج' : 'Failed to load program');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: unknown) => {
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
      toast.error(currentLang === 'ar' ? 'يرجى إدخال العناوين بكلا اللغتين' : 'Please provide titles in both languages');
      return;
    }

    if (!formData.descriptionAr.trim() || !formData.descriptionEn.trim()) {
      toast.error(currentLang === 'ar' ? 'يرجى إدخال الأوصاف بكلا اللغتين' : 'Please provide descriptions in both languages');
      return;
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      toast.error(currentLang === 'ar' ? 'يرجى إدخال مدة صالحة' : 'Please provide a valid duration');
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
          titleAr: formData.titleAr,
          titleEn: formData.titleEn,
          descriptionAr: formData.descriptionAr,
          descriptionEn: formData.descriptionEn,
          slug: formData.slug,
          duration: parseInt(formData.duration),
          durationType: formData.durationType,
          level: formData.level,
          image: formData.featuredImage,
          prerequisites: formData.requirements.length > 0 ? formData.requirements.join('\n') : null,
          rating: formData.rating ? parseFloat(formData.rating) : null,
          participants: formData.participants ? parseInt(formData.participants) : null,
          featured: formData.featured,
          isFree: true, // Default value
          isCertified: true, // Default value
          status: formData.status,
          categoryId: formData.categoryId || null,
          tagIds: formData.selectedTags,
        }),
      });

      if (response.ok) {
        toast.success(currentLang === 'ar' ? 'تم تحديث البرنامج بنجاح' : 'Program updated successfully');
        router.back(); // Navigate to previous page like news edit
      } else {
        const error = await response.json();
        console.error('API Error:', error);
        toast.error(error.error || (currentLang === 'ar' ? 'فشل في تحديث البرنامج' : 'Failed to update program'));
      }
    } catch (error) {
      console.error('Error updating program:', error);
      toast.error(currentLang === 'ar' ? 'فشل في تحديث البرنامج' : 'Failed to update program');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.back(); // Navigate to previous page in browser history
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
      title={currentLang === 'ar' ? 'تعديل البرنامج' : 'Edit Program'}
      description={currentLang === 'ar' ? 'تحديث معلومات وتفاصيل البرنامج التدريبي' : 'Update training program information and details'}
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
          titleLabel={currentLang === 'ar' ? 'عنوان البرنامج' : 'Program Title'}
          summaryLabel={currentLang === 'ar' ? 'ملخص البرنامج' : 'Program Summary'}
          contentLabel={currentLang === 'ar' ? 'وصف البرنامج' : 'Program Description'}
          contentRows={6}
        />

        {/* Program Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="level">{currentLang === 'ar' ? 'المستوى *' : 'Level *'}</Label>
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
              <Label htmlFor="duration">{currentLang === 'ar' ? 'المدة *' : 'Duration *'}</Label>
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
              <Label htmlFor="durationType">{currentLang === 'ar' ? 'النوع' : 'Type'}</Label>
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
            <Label htmlFor="rating">{currentLang === 'ar' ? 'التقييم (1-5)' : 'Rating (1-5)'}</Label>
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
            <Label htmlFor="participants">{currentLang === 'ar' ? 'إجمالي المشاركين' : 'Total Participants'}</Label>
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
          <Label>{currentLang === 'ar' ? 'متطلبات البرنامج' : 'Program Requirements'}</Label>
          <div className="space-y-3 mt-2">
            <div className="flex gap-2">
              <Input
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                placeholder={currentLang === 'ar' ? 'أدخل متطلباً للبرنامج' : 'Enter a program requirement'}
                onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
              />
              <button
                type="button"
                onClick={addRequirement}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {currentLang === 'ar' ? 'إضافة' : 'Add'}
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
                      {currentLang === 'ar' ? 'إزالة' : 'Remove'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Learning Objectives */}
        <div>
          <Label>{currentLang === 'ar' ? 'الأهداف التعليمية' : 'Learning Objectives'}</Label>
          <div className="space-y-3 mt-2">
            <div className="flex gap-2">
              <Input
                value={objectiveInput}
                onChange={(e) => setObjectiveInput(e.target.value)}
                placeholder={currentLang === 'ar' ? 'أدخل هدفاً تعليمياً' : 'Enter a learning objective'}
                onKeyPress={(e) => e.key === 'Enter' && addObjective()}
              />
              <button
                type="button"
                onClick={addObjective}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {currentLang === 'ar' ? 'إضافة' : 'Add'}
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
                      {currentLang === 'ar' ? 'إزالة' : 'Remove'}
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
          label={currentLang === 'ar' ? 'صورة البرنامج المميزة' : 'Program Featured Image'}
        />

        {/* URL Slug */}
        <div>
          <Label htmlFor="slug">{currentLang === 'ar' ? 'رابط URL' : 'URL Slug'}</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder={currentLang === 'ar' ? 'رابط-البرنامج' : 'program-url-slug'}
          />
          <p className="text-xs text-gray-500 mt-1">
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
