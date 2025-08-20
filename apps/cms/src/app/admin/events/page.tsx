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
  XCircle
} from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import { useCRUD } from '@/hooks/useCRUD';

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
    console.log('Publishing event:', event.id);
  };

  const handleUnpublish = async (event: EventItem) => {
    console.log('Unpublishing event:', event.id);
  };

  const handleSubmitForReview = async (event: EventItem) => {
    console.log('Submitting event for review:', event.id);
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

  const columns = [
    {
      key: 'event',
      label: 'Event',
      render: (_: unknown, event: EventItem) => (
        <div className="space-y-1">
          <div className="font-medium text-sm">{event.titleEn}</div>
          <div className="text-sm text-gray-600" dir="rtl">{event.titleAr}</div>
          <div className="flex gap-2">
            {event.featured && (
              <Badge variant="outline" className="text-xs">
                Featured
              </Badge>
            )}
            {event.eventTypeEn && (
              <Badge variant="outline" className="text-xs text-purple-600">
                {event.eventTypeEn}
              </Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'dateTime',
      label: 'Date & Time',
      render: (_: unknown, event: EventItem) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{formatEventDate(event.startDate, event.endDate)}</span>
          </div>
          {event.startTime && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{event.startTime} - {event.endTime}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (_: unknown, event: EventItem) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{event.locationEn}</span>
          </div>
          {event.venueEn && (
            <div className="text-xs text-gray-500">{event.venueEn}</div>
          )}
        </div>
      ),
    },
    {
      key: 'capacity',
      label: 'Capacity',
      render: (_: unknown, event: EventItem) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{event.capacity?.toLocaleString() || 'No limit'}</span>
        </div>
      ),
    },
    {
      key: 'eventStatus',
      label: 'Event Status',
      render: (_: unknown, event: EventItem) => (
        <Badge className={getEventStatusColor(event.eventStatus)}>
          {event.eventStatus}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Publish Status',
      render: (_: unknown, event: EventItem) => (
        <Badge className={getStatusColor(event.status)}>
          {event.status}
        </Badge>
      ),
    },
  ];

  const tableActions = [
    {
      label: 'View',
      icon: <Eye className="mr-2 h-4 w-4" />,
      onClick: handleView,
    },
    {
      label: 'Edit',
      icon: <Edit className="mr-2 h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: 'Submit for Review',
      icon: <Clock className="mr-2 h-4 w-4" />,
      onClick: (event: EventItem) => handleSubmitForReview(event),
      show: (event: EventItem) => event.status === 'DRAFT',
    },
    {
      label: 'Publish',
      icon: <CheckCircle className="mr-2 h-4 w-4" />,
      onClick: (event: EventItem) => handlePublish(event),
      show: (event: EventItem) => event.status === 'REVIEW',
    },
    {
      label: 'Unpublish',
      icon: <XCircle className="mr-2 h-4 w-4" />,
      onClick: (event: EventItem) => handleUnpublish(event),
      show: (event: EventItem) => event.status === 'PUBLISHED',
    },
    {
      label: 'Delete',
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: (event: EventItem) => actions.deleteItem(event.id),
      variant: 'destructive' as const,
    },
  ];

  const filterOptions = [
    {
      key: 'status',
      label: 'Publish Status',
      options: [
        { value: 'PUBLISHED', label: 'Published' },
        { value: 'REVIEW', label: 'Under Review' },
        { value: 'DRAFT', label: 'Draft' },
      ],
    },
    {
      key: 'eventStatus',
      label: 'Event Status',
      options: [
        { value: 'UPCOMING', label: 'Upcoming' },
        { value: 'ONGOING', label: 'Ongoing' },
        { value: 'PAST', label: 'Past' },
        { value: 'CANCELLED', label: 'Cancelled' },
      ],
    },
  ];

  const stats = [
    {
      label: 'Upcoming Events',
      value: (state.items ?? []).filter(e => e.eventStatus === 'UPCOMING').length,
    },
    {
      label: 'Published',
      value: (state.items ?? []).filter(e => e.status === 'PUBLISHED').length,
    },
    {
      label: 'Featured',
      value: (state.items ?? []).filter(e => e.featured).length,
    },
    {
      label: 'Total Capacity',
      value: (state.items ?? []).reduce((sum, e) => sum + (e.capacity || 0), 0).toLocaleString(),
    },
  ];

  return (
    <DataTable
      title="Events Management"
      description="Manage workshops, conferences, and seminars"
      data={state.items}
      columns={columns}
      actions={tableActions}
      loading={state.loading}
      onCreate={handleCreate}
      createButtonText="New Event"
      searchPlaceholder="Search events..."
      emptyMessage="No events found"
      emptyDescription="Create your first event"
      filters={filterOptions}
      stats={stats}
    />
  );
}
