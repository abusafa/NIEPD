'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MapPin,
  Users,
  Globe,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface EventItem {
  id: string;
  titleAr: string;
  titleEn: string;
  summaryAr?: string;
  summaryEn?: string;
  contentAr?: string;
  contentEn?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  locationAr?: string;
  locationEn?: string;
  venueAr?: string;
  venueEn?: string;
  capacity?: number;
  eventTypeAr?: string;
  eventTypeEn?: string;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  eventStatus: 'UPCOMING' | 'ONGOING' | 'PAST' | 'CANCELLED';
  featured: boolean;
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    firstName?: string;
    lastName?: string;
    username: string;
  };
  category?: {
    nameAr: string;
    nameEn: string;
    color?: string;
  };
}

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  
  const [eventItem, setEventItem] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);

      if (response.ok) {
        const event = await response.json();
        setEventItem({
          id: event.id,
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
          capacity: event.capacity || 0,
          eventTypeAr: event.eventTypeAr || '',
          eventTypeEn: event.eventTypeEn || '',
          status: event.status || 'DRAFT',
          eventStatus: event.eventStatus || 'UPCOMING',
          featured: event.featured || false,
          featuredImage: event.image || '',
          createdAt: event.createdAt || '',
          updatedAt: event.updatedAt || '',
          author: event.author || { firstName: '', lastName: '', username: '' },
          category: event.category || { nameAr: '', nameEn: '', color: '#3B82F6' }
        });
      } else {
        toast.error('Failed to load event data');
        setEventItem(null);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Failed to load event');
      setEventItem(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/events/${eventId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast.success('Event deleted successfully');
        router.push('/admin/events');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'REVIEW':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventStatusColor = (eventStatus: string) => {
    switch (eventStatus) {
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-800';
      case 'ONGOING':
        return 'bg-green-100 text-green-800';
      case 'PAST':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatEventDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString();
    }
    
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!eventItem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Event not found</h2>
        <p className="text-gray-600 mb-4">The requested event could not be found.</p>
        <Button onClick={() => router.push('/admin/events')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/admin/events')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Event Details</h1>
            <p className="text-gray-600">View and manage event information</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={actionLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          {eventItem.featuredImage && (
            <Card>
              <CardContent className="p-0">
                <img
                  src={eventItem.featuredImage}
                  alt={eventItem.titleEn}
                  className="w-full h-64 object-cover rounded-t-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* English Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                English Version
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{eventItem.titleEn}</h1>
                {eventItem.summaryEn && (
                  <p className="text-lg text-gray-600 mt-2">{eventItem.summaryEn}</p>
                )}
              </div>
              <Separator />
              {eventItem.contentEn && (
                <div className="prose max-w-none">
                  <p>{eventItem.contentEn}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Arabic Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                النسخة العربية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" dir="rtl">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{eventItem.titleAr}</h1>
                {eventItem.summaryAr && (
                  <p className="text-lg text-gray-600 mt-2">{eventItem.summaryAr}</p>
                )}
              </div>
              <Separator />
              {eventItem.contentAr && (
                <div className="prose max-w-none">
                  <p>{eventItem.contentAr}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className={getStatusColor(eventItem.status)}>
                  {eventItem.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Event Status</span>
                <Badge className={getEventStatusColor(eventItem.eventStatus)}>
                  {eventItem.eventStatus}
                </Badge>
              </div>
              
              {eventItem.featured && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Featured</span>
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm">Yes</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Date</span>
                <div className="flex items-center gap-1 text-sm text-gray-900">
                  <Calendar className="h-4 w-4" />
                  {formatEventDate(eventItem.startDate, eventItem.endDate)}
                </div>
              </div>

              {eventItem.startTime && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Time</span>
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <Clock className="h-4 w-4" />
                    {eventItem.startTime} - {eventItem.endTime}
                  </div>
                </div>
              )}

              {eventItem.locationEn && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Location</span>
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <MapPin className="h-4 w-4" />
                    {eventItem.locationEn}
                  </div>
                </div>
              )}

              {eventItem.venueEn && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Venue</span>
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <Globe className="h-4 w-4" />
                    {eventItem.venueEn}
                  </div>
                </div>
              )}

              {eventItem.capacity && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Capacity</span>
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <Users className="h-4 w-4" />
                    {eventItem.capacity.toLocaleString()}
                  </div>
                </div>
              )}

              {eventItem.eventTypeEn && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Type</span>
                  <Badge variant="outline">{eventItem.eventTypeEn}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Author Info */}
          {eventItem.author && (
            <Card>
              <CardHeader>
                <CardTitle>Created By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {eventItem.author.firstName && eventItem.author.lastName
                        ? `${eventItem.author.firstName} ${eventItem.author.lastName}`
                        : eventItem.author.username
                      }
                    </div>
                    <div className="text-xs text-gray-500">@{eventItem.author.username}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Category */}
          {eventItem.category && (
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: eventItem.category.color || '#6B7280' }}
                  />
                  <div>
                    <div className="text-sm font-medium">{eventItem.category.nameEn}</div>
                    <div className="text-xs text-gray-500" dir="rtl">{eventItem.category.nameAr}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created</span>
                <span className="text-sm text-gray-900">
                  {new Date(eventItem.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-900">
                  {new Date(eventItem.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
