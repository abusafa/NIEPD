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
import { Checkbox } from '@/components/ui/checkbox';
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
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  locationAr: string;
  locationEn: string;
  venueAr: string;
  venueEn: string;
  capacity: string;
  eventTypeAr: string;
  eventTypeEn: string;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  eventStatus: 'UPCOMING' | 'ONGOING' | 'PAST' | 'CANCELLED';
  featured: boolean;
  featuredImage: string;
  slug: string;
  categoryId: string;
  selectedTags: string[];
}

const eventStatuses = [
  { value: 'UPCOMING', label: 'Upcoming' },
  { value: 'ONGOING', label: 'Ongoing' },
  { value: 'PAST', label: 'Past' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [formData, setFormData] = useState<FormData>({
    titleAr: '',
    titleEn: '',
    summaryAr: '',
    summaryEn: '',
    contentAr: '',
    contentEn: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    locationAr: '',
    locationEn: '',
    venueAr: '',
    venueEn: '',
    capacity: '',
    eventTypeAr: '',
    eventTypeEn: '',
    status: 'DRAFT',
    eventStatus: 'UPCOMING',
    featured: false,
    featuredImage: '',
    slug: '',
    categoryId: '',
    selectedTags: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  // Auto-generate slug from English title
  useEffect(() => {
    if (formData.titleEn && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.titleEn)
      }));
    }
  }, [formData.titleEn]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);

      if (response.ok) {
        const event = await response.json();
        setFormData({
          titleAr: event.titleAr || '',
          titleEn: event.titleEn || '',
          summaryAr: event.summaryAr || '',
          summaryEn: event.summaryEn || '',
          contentAr: event.descriptionAr || '',
          contentEn: event.descriptionEn || '',
          startDate: event.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
          endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
          startTime: event.startTime || '',
          endTime: event.endTime || '',
          locationAr: event.locationAr || '',
          locationEn: event.locationEn || '',
          venueAr: event.venueAr || '',
          venueEn: event.venueEn || '',
          capacity: event.capacity?.toString() || '0',
          eventTypeAr: event.eventTypeAr || '',
          eventTypeEn: event.eventTypeEn || '',
          status: event.status || 'DRAFT',
          eventStatus: event.eventStatus || 'UPCOMING',
          featured: event.featured || false,
          featuredImage: event.image || '',
          slug: event.slug || '',
          categoryId: event.categoryId || '',
          selectedTags: event.tags ? event.tags.map((t: any) => t.tag.id) : [],
        });
      } else {
        toast.error('Failed to load event data');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.titleAr.trim() || !formData.titleEn.trim()) {
      toast.error('Please provide titles in both languages');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error('Please provide event dates');
      return;
    }

    setSaving(true);
    try {
      // Mock save - replace with API call
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
        }),
      });

      if (response.ok) {
        toast.success('Event updated successfully');
        router.push(`/admin/events/${eventId}`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/admin/events/${eventId}`);
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
      title="Edit Event"
      description="Update event information and details"
      onBack={handleBack}
      onSave={handleSave}
      loading={saving}
      isEditing={true}
    >
      <div className="space-y-6">
        {/* Bilingual Title and Summary */}
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
          titleLabel="Event Title"
          summaryLabel="Event Summary"
          contentLabel="Event Description"
          contentRows={6}
        />

        {/* Event Dates and Times */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date *</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
            />
          </div>
        </div>

        {/* Location Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="locationEn">Location (English)</Label>
            <Input
              id="locationEn"
              value={formData.locationEn}
              onChange={(e) => handleInputChange('locationEn', e.target.value)}
              placeholder="e.g., Virtual, Riyadh, Online"
            />
          </div>
          <div>
            <Label htmlFor="locationAr">Location (Arabic)</Label>
            <Input
              id="locationAr"
              value={formData.locationAr}
              onChange={(e) => handleInputChange('locationAr', e.target.value)}
              placeholder="مثال: افتراضي، الرياض، عبر الإنترنت"
              dir="rtl"
            />
          </div>
          <div>
            <Label htmlFor="venueEn">Venue (English)</Label>
            <Input
              id="venueEn"
              value={formData.venueEn}
              onChange={(e) => handleInputChange('venueEn', e.target.value)}
              placeholder="e.g., Zoom Platform, Conference Center"
            />
          </div>
          <div>
            <Label htmlFor="venueAr">Venue (Arabic)</Label>
            <Input
              id="venueAr"
              value={formData.venueAr}
              onChange={(e) => handleInputChange('venueAr', e.target.value)}
              placeholder="مثال: منصة زووم، مركز المؤتمرات"
              dir="rtl"
            />
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => handleInputChange('capacity', e.target.value)}
              placeholder="Maximum number of participants"
              min="1"
            />
          </div>
          <div>
            <Label htmlFor="eventStatus">Event Status</Label>
            <Select value={formData.eventStatus} onValueChange={(value) => handleInputChange('eventStatus', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventStatuses.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Event Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="eventTypeEn">Event Type (English)</Label>
            <Input
              id="eventTypeEn"
              value={formData.eventTypeEn}
              onChange={(e) => handleInputChange('eventTypeEn', e.target.value)}
              placeholder="e.g., Workshop, Conference, Seminar"
            />
          </div>
          <div>
            <Label htmlFor="eventTypeAr">Event Type (Arabic)</Label>
            <Input
              id="eventTypeAr"
              value={formData.eventTypeAr}
              onChange={(e) => handleInputChange('eventTypeAr', e.target.value)}
              placeholder="مثال: ورشة عمل، مؤتمر، ندوة"
              dir="rtl"
            />
          </div>
        </div>

        {/* Featured Image */}
        <MediaSelector
          selectedImage={formData.featuredImage}
          onImageSelect={(url) => handleInputChange('featuredImage', url)}
          onImageRemove={() => handleInputChange('featuredImage', '')}
          label="Event Featured Image"
        />

        {/* URL Slug */}
        <div>
          <Label htmlFor="slug">URL Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="event-url-slug"
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
