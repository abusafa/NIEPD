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
import { toast } from 'sonner';

interface FormData {
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  sortOrder: number;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  categoryId?: string;
}

interface FAQItem {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  sortOrder: number;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  categoryId?: string;
}

const faqStatuses = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'REVIEW', label: 'Under Review' },
  { value: 'PUBLISHED', label: 'Published' },
];

export default function EditFAQPage() {
  const router = useRouter();
  const params = useParams();
  const faqId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [faqItem, setFaqItem] = useState<FAQItem | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    questionAr: '',
    questionEn: '',
    answerAr: '',
    answerEn: '',
    sortOrder: 0,
    status: 'DRAFT',
    categoryId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch FAQ item on component mount
  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const response = await fetch(`/api/faq/${faqId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFaqItem(data);
          setFormData({
            questionAr: data.questionAr || '',
            questionEn: data.questionEn || '',
            answerAr: data.answerAr || '',
            answerEn: data.answerEn || '',
            sortOrder: data.sortOrder || 0,
            status: data.status || 'DRAFT',
            categoryId: data.categoryId || '',
          });
        } else {
          const error = await response.json();
          toast.error(error.error || 'Failed to load FAQ');
          router.push('/admin/faq');
        }
      } catch (error) {
        console.error('Error fetching FAQ:', error);
        toast.error('Network error. Please try again.');
        router.push('/admin/faq');
      } finally {
        setInitialLoading(false);
      }
    };

    if (faqId) {
      fetchFAQ();
    }
  }, [faqId, router]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.questionEn.trim()) {
      newErrors.questionEn = 'English question is required';
    }

    if (!formData.questionAr.trim()) {
      newErrors.questionAr = 'Arabic question is required';
    }

    if (!formData.answerEn.trim()) {
      newErrors.answerEn = 'English answer is required';
    }

    if (!formData.answerAr.trim()) {
      newErrors.answerAr = 'Arabic answer is required';
    }

    if (formData.sortOrder < 0) {
      newErrors.sortOrder = 'Sort order must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/faq/${faqId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedFaq = await response.json();
        toast.success('FAQ updated successfully');
        router.push('/admin/faq');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update FAQ');
      }
    } catch (error) {
      console.error('Error updating FAQ:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/faq');
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!faqItem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">FAQ Not Found</h2>
        <p className="text-gray-600 mb-4">The requested FAQ item could not be found.</p>
      </div>
    );
  }

  const formFields = (
    <div className="space-y-6">
      {/* Questions Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
          <h3 className="text-lg font-medium">Question</h3>
        </div>
        
        <BilingualTextFields
          label="Question"
          required
          arValue={formData.questionAr}
          enValue={formData.questionEn}
          onArChange={(value) => setFormData(prev => ({ ...prev, questionAr: value }))}
          onEnChange={(value) => setFormData(prev => ({ ...prev, questionEn: value }))}
          arError={errors.questionAr}
          enError={errors.questionEn}
          arPlaceholder="اكتب السؤال بالعربية..."
          enPlaceholder="Enter question in English..."
          component="input"
        />
      </div>

      {/* Answers Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
          <h3 className="text-lg font-medium">Answer</h3>
        </div>
        
        <BilingualTextFields
          label="Answer"
          required
          arValue={formData.answerAr}
          enValue={formData.answerEn}
          onArChange={(value) => setFormData(prev => ({ ...prev, answerAr: value }))}
          onEnChange={(value) => setFormData(prev => ({ ...prev, answerEn: value }))}
          arError={errors.answerAr}
          enError={errors.answerEn}
          arPlaceholder="اكتب الإجابة بالعربية..."
          enPlaceholder="Enter answer in English..."
          component="textarea"
          rows={4}
        />
      </div>

      {/* Settings Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-purple-500"></div>
          <h3 className="text-lg font-medium">Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'DRAFT' | 'REVIEW' | 'PUBLISHED') => 
                setFormData(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {faqStatuses.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-600">{errors.status}</p>
            )}
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              type="number"
              min="0"
              value={formData.sortOrder}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                sortOrder: parseInt(e.target.value) || 0 
              }))}
              placeholder="0"
            />
            {errors.sortOrder && (
              <p className="text-sm text-red-600">{errors.sortOrder}</p>
            )}
            <p className="text-sm text-gray-500">
              Lower numbers appear first in the FAQ list
            </p>
          </div>
        </div>
      </div>

      {/* Metadata Section */}
      {faqItem && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-gray-500"></div>
            <h3 className="text-lg font-medium">Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-700">Created</Label>
              <p className="text-sm text-gray-600">
                {new Date(faqItem.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Last Updated</Label>
              <p className="text-sm text-gray-600">
                {new Date(faqItem.updatedAt).toLocaleString()}
              </p>
            </div>
            {faqItem.publishedAt && (
              <div>
                <Label className="text-sm font-medium text-gray-700">Published</Label>
                <p className="text-sm text-gray-600">
                  {new Date(faqItem.publishedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <FormLayout
      title="Edit FAQ"
      description="Update the frequently asked question"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={loading}
      submitText="Update FAQ"
    >
      {formFields}
    </FormLayout>
  );
}
