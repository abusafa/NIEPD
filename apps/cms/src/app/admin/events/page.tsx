'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  User
} from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import { useCRUD } from '@/hooks/useCRUD';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface EventItem {
  id: string;
  titleAr: string;
  titleEn: string;
  summaryAr?: string;
  summaryEn?: string;
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
  createdAt: string;
  updatedAt: string;
  category?: {
    nameAr: string;
    nameEn: string;
  };
  author?: {
    firstName?: string;
    lastName?: string;
    username: string;
  };
}

export default function EventsPage() {
  const router = useRouter();
  const { currentLang, t, isRTL } = useLanguage();
  const [state, actions] = useCRUD<EventItem>({
    endpoint: '/api/events',
    resourceName: 'Event',
  });

  const handleCreate = () => {
    router.push('/admin/events/create');
  };

  const handleEdit = (event: EventItem) => {
    router.push(`/admin/events/${event.id}/edit`);
  };

  const handleView = (event: EventItem) => {
    router.push(`/admin/events/${event.id}`);
  };

  const handlePublish = async (event: EventItem) => {
    try {
      const response = await fetch(`/api/events/${event.id}/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        actions.refresh?.(); // Refresh the list
        toast.success(t('events.publishSuccess'));
      } else {
        toast.error(t('events.publishError'));
      }
    } catch (error) {
      console.error('Error publishing event:', error);
      toast.error(t('events.publishError'));
    }
  };

  const handleUnpublish = async (event: EventItem) => {
    try {
      const response = await fetch(`/api/events/${event.id}/unpublish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        actions.refresh?.(); // Refresh the list
        toast.success(t('events.unpublishSuccess'));
      } else {
        toast.error(t('events.unpublishError'));
      }
    } catch (error) {
      console.error('Error unpublishing event:', error);
      toast.error(t('events.unpublishError'));
    }
  };

  const handleSubmitForReview = async (event: EventItem) => {
    try {
      const response = await fetch(`/api/events/${event.id}/review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        actions.refresh?.(); // Refresh the list
        toast.success(t('events.submitReviewSuccess'));
      } else {
        toast.error(t('events.submitReviewError'));
      }
    } catch (error) {
      console.error('Error submitting for review:', error);
      toast.error(t('events.submitReviewError'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'REVIEW':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'PUBLISHED': { en: 'Published', ar: 'منشور' },
      'DRAFT': { en: 'Draft', ar: 'مسودة' },
      'REVIEW': { en: 'Under Review', ar: 'تحت المراجعة' }
    };
    return currentLang === 'ar' ? statusMap[status as keyof typeof statusMap]?.ar || status : statusMap[status as keyof typeof statusMap]?.en || status;
  };

  const getEventStatusColor = (eventStatus: string) => {
    switch (eventStatus) {
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ONGOING':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'PAST':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getEventStatusText = (eventStatus: string) => {
    const statusMap = {
      'UPCOMING': { en: 'Upcoming', ar: 'قادم' },
      'ONGOING': { en: 'Ongoing', ar: 'جاري' },
      'PAST': { en: 'Past', ar: 'سابق' },
      'CANCELLED': { en: 'Cancelled', ar: 'ملغي' }
    };
    return currentLang === 'ar' ? statusMap[eventStatus as keyof typeof statusMap]?.ar || eventStatus : statusMap[eventStatus as keyof typeof statusMap]?.en || eventStatus;
  };

  const formatEventDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const locale = currentLang === 'ar' ? 'ar-SA' : 'en-US';
    
    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString(locale);
    }
    
    return `${start.toLocaleDateString(locale)} - ${end.toLocaleDateString(locale)}`;
  };

  // Define columns in order: Title, Date & Time, Location, Category, Author, Event Status, Publish Status, Updated
  const columns = [
    {
      key: 'title',
      label: t('nav.events'),
      labelAr: t('nav.events'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, event: EventItem) => (
        <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="font-medium text-sm font-readex line-clamp-1">
            {currentLang === 'ar' ? event.titleAr : event.titleEn}
          </div>
          <div className="text-xs text-gray-500 font-readex line-clamp-1" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
            {currentLang === 'ar' ? event.titleEn : event.titleAr}
          </div>
          <div className="flex gap-2">
            {event.featured && (
              <Badge variant="outline" className="text-xs font-readex bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50">
                <span className={`inline-block w-1.5 h-1.5 bg-amber-500 dark:bg-amber-400 rounded-full ${isRTL ? 'ml-1' : 'mr-1'}`}></span>
                {t('content.featured')}
              </Badge>
            )}
            {event.eventTypeEn && (
              <Badge variant="outline" className="text-xs font-readex bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/50">
                {currentLang === 'ar' ? event.eventTypeAr || event.eventTypeEn : event.eventTypeEn}
              </Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'dateTime',
      label: t('events.dateTime'),
      labelAr: t('events.dateTime'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, event: EventItem) => (
        <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Calendar className="h-3 w-3 text-gray-400" />
            <span className="text-xs font-readex text-gray-600">{formatEventDate(event.startDate, event.endDate)}</span>
          </div>
          {event.startTime && (
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs font-readex text-gray-600">{event.startTime} - {event.endTime}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'location',
      label: t('events.location'),
      labelAr: t('events.location'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, event: EventItem) => (
        <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <MapPin className="h-3 w-3 text-gray-400" />
            <span className="text-xs font-readex text-gray-600 line-clamp-1">
              {currentLang === 'ar' ? event.locationAr || event.locationEn : event.locationEn}
            </span>
          </div>
          {(currentLang === 'ar' ? event.venueAr || event.venueEn : event.venueEn) && (
            <div className="text-xs text-gray-500 font-readex line-clamp-1">
              {currentLang === 'ar' ? event.venueAr || event.venueEn : event.venueEn}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      label: t('content.category'),
      labelAr: t('content.category'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, event: EventItem) => (
        <div className={`text-sm font-readex ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs inline-block">
            {currentLang === 'ar' 
              ? event.category?.nameAr || t('categories.noCategory')
              : event.category?.nameEn || t('categories.noCategory')
            }
          </div>
        </div>
      ),
    },
    {
      key: 'author',
      label: t('content.author'),
      labelAr: t('content.author'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, event: EventItem) => (
        <div className={`flex items-center gap-2 text-sm ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}>
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-3 w-3 text-gray-500" />
          </div>
          <span className="font-readex text-xs text-gray-600 truncate max-w-24">
            {event.author?.firstName && event.author?.lastName 
              ? `${event.author.firstName} ${event.author.lastName}`
              : event.author?.username || t('users.unknown')
            }
          </span>
        </div>
      ),
    },
    {
      key: 'capacity',
      label: t('events.capacity'),
      labelAr: t('events.capacity'),
      align: 'center' as const,
      render: (_: unknown, event: EventItem) => (
        <div className="flex items-center justify-center gap-2">
          <Users className="h-3 w-3 text-gray-400" />
          <span className="text-xs font-readex text-gray-600">
            {event.capacity?.toLocaleString() || t('events.noLimit')}
          </span>
        </div>
      ),
    },
    {
      key: 'eventStatus',
      label: t('events.eventStatus'),
      labelAr: t('events.eventStatus'),
      align: 'center' as const,
      render: (_: unknown, event: EventItem) => (
        <div className="flex justify-center">
          <Badge className={`${getEventStatusColor(event.eventStatus)} font-readex text-xs`}>
            {getEventStatusText(event.eventStatus)}
          </Badge>
        </div>
      ),
    },
    {
      key: 'status',
      label: t('events.publishStatus'),
      labelAr: t('events.publishStatus'),
      align: 'center' as const,
      render: (_: unknown, event: EventItem) => (
        <div className="flex justify-center">
          <Badge className={`${getStatusColor(event.status)} font-readex text-xs`}>
            {getStatusText(event.status)}
          </Badge>
        </div>
      ),
    },
    {
      key: 'updatedAt',
      label: t('content.updatedAt'),
      labelAr: t('content.updatedAt'),
      align: isRTL ? 'right' as const : 'left' as const,
      render: (_: unknown, event: EventItem) => (
        <div className={`flex items-center gap-2 text-xs ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}>
          <Calendar className="h-3 w-3 text-gray-400" />
          <span className="font-readex text-gray-600">
            {new Date(event.updatedAt).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
          </span>
        </div>
      ),
    },
  ];

  const tableActions = [
    {
      label: t('view'),
      labelAr: t('view'),
      icon: <Eye className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: handleView,
    },
    {
      label: t('edit'),
      labelAr: t('edit'),
      icon: <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: handleEdit,
    },
    {
      label: t('events.submitForReview'),
      labelAr: t('events.submitForReview'),
      icon: <Clock className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (event: EventItem) => handleSubmitForReview(event),
      show: (event: EventItem) => event.status === 'DRAFT',
    },
    {
      label: t('events.publish'),
      labelAr: t('events.publish'),
      icon: <CheckCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (event: EventItem) => handlePublish(event),
      show: (event: EventItem) => event.status === 'REVIEW',
    },
    {
      label: t('events.unpublish'),
      labelAr: t('events.unpublish'),
      icon: <XCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (event: EventItem) => handleUnpublish(event),
      show: (event: EventItem) => event.status === 'PUBLISHED',
    },
    {
      label: t('delete'),
      labelAr: t('delete'),
      icon: <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (event: EventItem) => actions.deleteItem(event.id),
      variant: 'destructive' as const,
    },
  ];

  // Enhanced filter options
  const filterOptions = [
    {
      key: 'status',
      label: t('events.publishStatusFilter'),
      labelAr: t('events.publishStatusFilter'),
      options: [
        { value: 'PUBLISHED', label: t('content.published'), labelAr: t('content.published') },
        { value: 'REVIEW', label: t('news.underReview'), labelAr: t('news.underReview') },
        { value: 'DRAFT', label: t('content.draft'), labelAr: t('content.draft') },
      ],
    },
    {
      key: 'eventStatus',
      label: t('events.eventStatusFilter'),
      labelAr: t('events.eventStatusFilter'),
      options: [
        { value: 'UPCOMING', label: t('events.upcoming'), labelAr: t('events.upcoming') },
        { value: 'ONGOING', label: t('events.ongoing'), labelAr: t('events.ongoing') },
        { value: 'PAST', label: t('events.past'), labelAr: t('events.past') },
        { value: 'CANCELLED', label: t('events.cancelled'), labelAr: t('events.cancelled') },
      ],
    },
    {
      key: 'featured',
      label: t('content.featured'),
      labelAr: t('content.featured'),
      options: [
        { value: 'true', label: t('news.featuredOnly'), labelAr: t('news.featuredOnly') },
        { value: 'false', label: t('news.nonFeatured'), labelAr: t('news.nonFeatured') },
      ],
    },
  ];

  const stats = [
    {
      label: t('events.totalEvents'),
      value: state.items?.length ?? 0,
      description: t('news.totalCount')
    },
    {
      label: t('events.upcomingEvents'),
      value: (state.items ?? []).filter(e => e.eventStatus === 'UPCOMING').length,
      description: t('events.futureEvents')
    },
    {
      label: t('content.published'),
      value: (state.items ?? []).filter(e => e.status === 'PUBLISHED').length,
      description: t('events.publishedEvents')
    },
    {
      label: t('content.featured'),
      value: (state.items ?? []).filter(e => e.featured).length,
      description: t('events.featuredEvents')
    },
  ];

  return (
    <DataTable
      title={t('events.title')}
      description={t('events.description')}
      data={state.items}
      columns={columns}
      actions={tableActions}
      loading={state.loading}
      onCreate={handleCreate}
      createButtonText={t('events.createNew')}
      searchPlaceholder={t('events.searchPlaceholder')}
      emptyMessage={t('events.emptyMessage')}
      emptyDescription={t('events.emptyDescription')}
      filters={filterOptions}
      stats={stats}
    />
  );
}
