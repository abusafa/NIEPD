'use client';

import { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import FormLayout from '@/components/shared/FormLayout';
import BilingualTextFields from '@/components/forms/BilingualTextFields';
import { toast } from 'sonner';

interface FormData {
  nameAr: string;
  nameEn: string;
  positionAr: string;
  positionEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image?: string;
  email?: string;
  phone?: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
}

export default function CreateOrganizationMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    nameAr: '',
    nameEn: '',
    positionAr: '',
    positionEn: '',
    descriptionAr: '',
    descriptionEn: '',
    image: '',
    email: '',
    phone: '',
    parentId: '',
    sortOrder: 0,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nameEn.trim()) {
      newErrors.nameEn = 'English name is required';
    }

    if (!formData.nameAr.trim()) {
      newErrors.nameAr = 'Arabic name is required';
    }

    if (!formData.positionEn.trim()) {
      newErrors.positionEn = 'English position is required';
    }

    if (!formData.positionAr.trim()) {
      newErrors.positionAr = 'Arabic position is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
      const response = await fetch('/api/organizational-structure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newMember = await response.json();
        toast.success('Organization member created successfully');
        router.push('/admin/organizational-structure');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create organization member');
      }
    } catch (error) {
      console.error('Error creating organization member:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/organizational-structure');
  };

  const formFields = (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
          <h3 className="text-lg font-medium">Personal Information</h3>
        </div>
        
        <BilingualTextFields
          label="Full Name"
          required
          arValue={formData.nameAr}
          enValue={formData.nameEn}
          onArChange={(value) => setFormData(prev => ({ ...prev, nameAr: value }))}
          onEnChange={(value) => setFormData(prev => ({ ...prev, nameEn: value }))}
          arError={errors.nameAr}
          enError={errors.nameEn}
          arPlaceholder="الاسم الكامل بالعربية..."
          enPlaceholder="Full name in English..."
          component="input"
        />

        <BilingualTextFields
          label="Position"
          required
          arValue={formData.positionAr}
          enValue={formData.positionEn}
          onArChange={(value) => setFormData(prev => ({ ...prev, positionAr: value }))}
          onEnChange={(value) => setFormData(prev => ({ ...prev, positionEn: value }))}
          arError={errors.positionAr}
          enError={errors.positionEn}
          arPlaceholder="المنصب بالعربية..."
          enPlaceholder="Position in English..."
          component="input"
        />

        <BilingualTextFields
          label="Description"
          arValue={formData.descriptionAr}
          enValue={formData.descriptionEn}
          onArChange={(value) => setFormData(prev => ({ ...prev, descriptionAr: value }))}
          onEnChange={(value) => setFormData(prev => ({ ...prev, descriptionEn: value }))}
          arError={errors.descriptionAr}
          enError={errors.descriptionEn}
          arPlaceholder="وصف موجز بالعربية..."
          enPlaceholder="Brief description in English..."
          component="textarea"
          rows={3}
        />
      </div>

      {/* Contact Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
          <h3 className="text-lg font-medium">Contact Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="member@niepd.sa"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+966 XX XXX XXXX"
            />
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-purple-500"></div>
          <h3 className="text-lg font-medium">Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              Lower numbers appear first in the organization chart
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Profile Image URL</Label>
            <Input
              id="image"
              type="url"
              value={formData.image || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-sm text-gray-500">
              Optional profile image URL
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData(prev => ({ 
              ...prev, 
              isActive: checked === true 
            }))}
          />
          <Label htmlFor="isActive">Active Member</Label>
        </div>
      </div>
    </div>
  );

  return (
    <FormLayout
      title="Add Organization Member"
      description="Add a new member to the organizational structure"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={loading}
      submitText="Add Member"
    >
      {formFields}
    </FormLayout>
  );
}
