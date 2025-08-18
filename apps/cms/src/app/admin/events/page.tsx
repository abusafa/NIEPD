'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Calendar,
  User,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [eventStatusFilter, setEventStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchEvents();
  }, [statusFilter, eventStatusFilter]);

  const fetchEvents = async () => {
    try {
      const url = new URL('/api/events', window.location.origin);
      if (statusFilter !== 'all') url.searchParams.set('status', statusFilter);
      if (eventStatusFilter !== 'all') url.searchParams.set('eventStatus', eventStatusFilter);

      const response = await fetch(url.toString());
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      } else {
        console.error('Failed to fetch events');
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
      // Fallback to mock data for demonstration
      const mockEvents: EventItem[] = [
        {
          id: '1',
          titleAr: 'لقاء دور الإدارة المدرسية في بناء العلاقات الإيجابية',
          titleEn: 'Session on School Administration Role in Building Positive Relationships',
          summaryAr: 'لقاء تطويري متخصص يناقش دور الإدارة المدرسية في بناء العلاقات الإيجابية داخل المجتمع المدرسي',
          summaryEn: 'Specialized development session discussing the role of school administration in building positive relationships',
          startDate: '2025-08-18',
          endDate: '2025-08-18',
          startTime: '09:00',
          endTime: '12:00',
          locationAr: 'افتراضي',
          locationEn: 'Virtual',
          venueAr: 'منصة زووم',
          venueEn: 'Zoom Platform',
          capacity: 500,
          eventTypeAr: 'لقاء تطويري',
          eventTypeEn: 'Development Session',
          status: 'PUBLISHED',
          eventStatus: 'UPCOMING',
          featured: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          category: {
            nameAr: 'الجلسات',
            nameEn: 'Sessions'
          },
          author: {
            firstName: 'Admin',
            lastName: 'User',
            username: 'admin'
          }
        },
        {
          id: '2',
          titleAr: 'لقاء دور الأنشطة الطلابية في المدرسة',
          titleEn: 'Session on Student Activities Role in School',
          summaryAr: 'لقاء يناقش أهمية الأنشطة الطلابية ودورها في تنمية شخصية الطلاب وتعزيز التعلم',
          summaryEn: 'Session discussing the importance of student activities and their role in developing student personality',
          startDate: '2025-08-25',
          endDate: '2025-08-25',
          startTime: '10:00',
          endTime: '13:00',
          locationAr: 'افتراضي',
          locationEn: 'Virtual',
          venueAr: 'منصة تيمز',
          venueEn: 'Teams Platform',
          capacity: 300,
          eventTypeAr: 'لقاء متخصص',
          eventTypeEn: 'Specialized Session',
          status: 'REVIEW',
          eventStatus: 'UPCOMING',
          featured: false,
          createdAt: '2024-01-10T15:20:00Z',
          updatedAt: '2024-01-12T09:15:00Z',
          category: {
            nameAr: 'الجلسات',
            nameEn: 'Sessions'
          },
          author: {
            firstName: 'Content',
            lastName: 'Editor',
            username: 'editor'
          }
        },
        {
          id: '3',
          titleAr: 'المعرض الدولي للتعليم',
          titleEn: 'International Education Exhibition',
          summaryAr: 'المعهد الوطني للتطوير المهني التعليمي يشارك في المعرض الدولي للتعليم ويقدم ورش عمل متخصصة',
          summaryEn: 'National Institute participates in International Education Exhibition and presents specialized workshops',
          startDate: '2025-04-15',
          endDate: '2025-04-17',
          startTime: '09:00',
          endTime: '18:00',
          locationAr: 'الرياض',
          locationEn: 'Riyadh',
          venueAr: 'مركز الرياض الدولي للمؤتمرات والمعارض',
          venueEn: 'Riyadh International Convention & Exhibition Center',
          capacity: 10000,
          eventTypeAr: 'معرض',
          eventTypeEn: 'Exhibition',
          status: 'PUBLISHED',
          eventStatus: 'UPCOMING',
          featured: true,
          createdAt: '2024-01-05T08:45:00Z',
          updatedAt: '2024-01-08T14:22:00Z',
          category: {
            nameAr: 'المؤتمرات',
            nameEn: 'Conferences'
          },
          author: {
            username: 'author1'
          }
        },
        {
          id: '4',
          titleAr: 'ندوة المعلم الملهم للرؤية الطموحة 2030',
          titleEn: 'Inspiring Teacher for Ambitious Vision 2030 Seminar',
          summaryAr: 'ندوة افتراضية تناقش دور المعلم في تحقيق أهداف رؤية المملكة 2030',
          summaryEn: 'Virtual seminar discussing the teacher\'s role in achieving Saudi Vision 2030 goals',
          startDate: '2024-06-15',
          endDate: '2024-06-15',
          startTime: '14:00',
          endTime: '17:00',
          locationAr: 'افتراضي',
          locationEn: 'Virtual',
          venueAr: 'منصة زووم',
          venueEn: 'Zoom Platform',
          capacity: 1000,
          eventTypeAr: 'ندوة',
          eventTypeEn: 'Seminar',
          status: 'PUBLISHED',
          eventStatus: 'PAST',
          featured: true,
          createdAt: '2024-01-02T12:00:00Z',
          updatedAt: '2024-01-05T16:30:00Z',
          category: {
            nameAr: 'الندوات',
            nameEn: 'Seminars'
          },
          author: {
            firstName: 'Event',
            lastName: 'Manager',
            username: 'events'
          }
        }
      ];

      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    router.push('/admin/events/create');
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/events/${id}/edit`);
  };

  const handleView = (id: string) => {
    router.push(`/admin/events/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }
    // Delete logic here
    console.log('Deleting event:', id);
  };

  const handlePublish = async (id: string) => {
    console.log('Publishing event:', id);
  };

  const handleUnpublish = async (id: string) => {
    console.log('Unpublishing event:', id);
  };

  const handleSubmitForReview = async (id: string) => {
    console.log('Submitting event for review:', id);
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

  const filteredEvents = events.filter(item => {
    const matchesSearch = 
      item.titleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.titleEn.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesEventStatus = eventStatusFilter === 'all' || item.eventStatus === eventStatusFilter;
    
    return matchesSearch && matchesStatus && matchesEventStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600">Manage workshops, conferences, and seminars</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="PUBLISHED">Published</option>
                <option value="REVIEW">Under Review</option>
                <option value="DRAFT">Draft</option>
              </select>
              <select
                value={eventStatusFilter}
                onChange={(e) => setEventStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Events</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Ongoing</option>
                <option value="PAST">Past</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{events.filter(e => e.eventStatus === 'UPCOMING').length}</div>
            <p className="text-xs text-muted-foreground">Upcoming Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{events.filter(e => e.status === 'PUBLISHED').length}</div>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{events.filter(e => e.featured).length}</div>
            <p className="text-xs text-muted-foreground">Featured</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{events.reduce((sum, e) => sum + (e.capacity || 0), 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Capacity</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Events ({filteredEvents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Event Status</TableHead>
                  <TableHead>Publish Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {event.titleEn}
                        </div>
                        <div className="text-sm text-gray-600" dir="rtl">
                          {event.titleAr}
                        </div>
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
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {formatEventDate(event.startDate, event.endDate)}
                          </span>
                        </div>
                        {event.startTime && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {event.startTime} - {event.endTime}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{event.locationEn}</span>
                        </div>
                        {event.venueEn && (
                          <div className="text-xs text-gray-500">
                            {event.venueEn}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {event.capacity?.toLocaleString() || 'No limit'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEventStatusColor(event.eventStatus)}>
                        {event.eventStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Quick status actions */}
                        {event.status === 'DRAFT' && (
                          <Button variant="outline" size="sm" onClick={() => handleSubmitForReview(event.id)}>
                            <Clock className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        )}
                        {event.status === 'REVIEW' && (
                          <Button variant="outline" size="sm" onClick={() => handlePublish(event.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Publish
                          </Button>
                        )}
                        {event.status === 'PUBLISHED' && (
                          <Button variant="outline" size="sm" onClick={() => handleUnpublish(event.id)}>
                            <XCircle className="h-4 w-4 mr-1" />
                            Unpublish
                          </Button>
                        )}

                        {/* More actions dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleView(event.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(event.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(event.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
