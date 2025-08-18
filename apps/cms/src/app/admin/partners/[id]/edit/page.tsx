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
import MediaSelector from '@/components/forms/MediaSelector';
import { toast } from 'sonner';

interface FormData {
  nameAr: string;
  nameEn: string;
  organizationAr: string;
  organizationEn: string;
  descriptionAr: string;
  descriptionEn: string;
  logo: string;
  website: string;
  email: string;
  phone: string;
  type: 'PARTNER' | 'SPONSOR' | 'COLLABORATOR' | 'SUPPLIER';
  featured: boolean;
  sortOrder: string;
}

const partnerTypes = [
  { value: 'PARTNER', label: 'Partner' },
  { value: 'SPONSOR', label: 'Sponsor' },
  { value: 'COLLABORATOR', label: 'Collaborator' },
  { value: 'SUPPLIER', label: 'Supplier' },
];

export default function EditPartnerPage() {
  const router = useRouter();
  const params = useParams();
  const partnerId = params.id as string;

  const [formData, setFormData] = useState<FormData>({
    nameAr: '',
    nameEn: '',
    organizationAr: '',
    organizationEn: '',
    descriptionAr: '',
    descriptionEn: '',
    logo: '',
    website: '',
    email: '',
    phone: '',
    type: 'PARTNER',
    featured: false,
    sortOrder: '0',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (partnerId) {
      fetchPartner();
    }
  }, [partnerId]);

  const fetchPartner = async () => {
    try {
      // Mock data - replace with API call
      const mockPartner = {
        nameAr: 'د. محمد أحمد السعيد',
        nameEn: 'Dr. Mohammed Ahmed Al-Saeed',
        organizationAr: 'جامعة الملك سعود',
        organizationEn: 'King Saud University',
        descriptionAr: 'شراكة استراتيجية في مجال التطوير الأكاديمي وتطوير المناهج التعليمية، مع التركيز على الابتكار في التعليم العالي وتطوير قدرات أعضاء هيئة التدريس.',
        descriptionEn: 'Strategic partnership in academic development and educational curriculum development, focusing on innovation in higher education and faculty capacity building.',
        logo: '/uploads/partners/ksu-logo.png',
        website: 'https://www.ksu.edu.sa',
        email: 'partnership@ksu.edu.sa',
        phone: '+966-11-467-0000',
        type: 'PARTNER' as const,
        featured: true,
        sortOrder: '1',
      };

      setFormData(mockPartner);
    } catch (error) {
      console.error('Error fetching partner:', error);
      toast.error('Failed to load partner');
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
      toast.error('Please provide names in both languages');
      return;
    }

    if (!formData.organizationAr.trim() || !formData.organizationEn.trim()) {
      toast.error('Please provide organization names in both languages');
      return;
    }

    // Validate email if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please provide a valid email address');
      return;
    }

    // Validate website if provided
    if (formData.website && !formData.website.startsWith('http')) {
      setFormData(prev => ({
        ...prev,
        website: `https://${formData.website}`
      }));
    }

    setSaving(true);
    try {
      // Mock save - replace with API call
      const response = await fetch(`/api/partners/${partnerId}`, {
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
        toast.success('Partner updated successfully');
        router.push(`/admin/partners/${partnerId}`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update partner');
      }
    } catch (error) {
      console.error('Error updating partner:', error);
      toast.error('Failed to update partner');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/admin/partners/${partnerId}`);
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
      title="Edit Partner"
      description="Update partner information and details"
      onBack={handleBack}
      onSave={handleSave}
      loading={saving}
      isEditing={true}
    >
      <div className="space-y-6">
        {/* Partner Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="nameEn">Partner Name (English) *</Label>
            <Input
              id="nameEn"
              value={formData.nameEn}
              onChange={(e) => handleInputChange('nameEn', e.target.value)}
              placeholder="Dr. John Smith"
              required
            />
          </div>
          <div>
            <Label htmlFor="nameAr">Partner Name (Arabic) *</Label>
            <Input
              id="nameAr"
              value={formData.nameAr}
              onChange={(e) => handleInputChange('nameAr', e.target.value)}
              placeholder="د. محمد أحمد السعيد"
              dir="rtl"
              required
            />
          </div>
        </div>

        {/* Organization Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="organizationEn">Organization (English) *</Label>
            <Input
              id="organizationEn"
              value={formData.organizationEn}
              onChange={(e) => handleInputChange('organizationEn', e.target.value)}
              placeholder="King Saud University"
              required
            />
          </div>
          <div>
            <Label htmlFor="organizationAr">Organization (Arabic) *</Label>
            <Input
              id="organizationAr"
              value={formData.organizationAr}
              onChange={(e) => handleInputChange('organizationAr', e.target.value)}
              placeholder="جامعة الملك سعود"
              dir="rtl"
              required
            />
          </div>
        </div>

        {/* Partner Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="descriptionEn">Description (English)</Label>
            <Textarea
              id="descriptionEn"
              value={formData.descriptionEn}
              onChange={(e) => handleInputChange('descriptionEn', e.target.value)}
              placeholder="Describe the partnership and collaboration details..."
              rows={6}
            />
          </div>
          <div>
            <Label htmlFor="descriptionAr">Description (Arabic)</Label>
            <Textarea
              id="descriptionAr"
              value={formData.descriptionAr}
              onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
              placeholder="وصف تفاصيل الشراكة والتعاون..."
              dir="rtl"
              rows={6}
            />
          </div>
        </div>

        {/* Partner Logo */}
        <MediaSelector
          selectedImage={formData.logo}
          onImageSelect={(url) => handleInputChange('logo', url)}
          onImageRemove={() => handleInputChange('logo', '')}
          label="Partner Logo"
        />

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="partnership@example.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+966-11-467-0000"
            />
          </div>
        </div>

        {/* Website */}
        <div>
          <Label htmlFor="website">Website URL</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://www.example.com"
          />
        </div>

        {/* Partner Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="type">Partner Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {partnerTypes.map(type => (
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
              Lower numbers appear first
            </p>
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="featured">Featured Partner</Label>
          </div>
        </div>

        {/* Additional Information */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Partnership Guidelines</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Ensure all contact information is current and accurate</li>
            <li>• Upload a high-quality logo (recommended: 200x200px or larger)</li>
            <li>• Provide descriptions that clearly explain the partnership value</li>
            <li>• Featured partners appear in highlighted sections across the site</li>
            <li>• Sort order determines the display position (0 = first)</li>
          </ul>
        </div>
      </div>
    </FormLayout>
  );
}
