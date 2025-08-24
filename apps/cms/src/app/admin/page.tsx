'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  FileText, 
  Calendar, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Eye,
  Edit,
  Clock,
  Plus,
  MessageSquare,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Database,
  Star,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface DashboardStats {
  news: {
    total: number;
    published: number;
    draft: number;
    review: number;
    growth30d: number;
  };
  programs: {
    total: number;
    published: number;
    draft: number;
    review: number;
    totalParticipants: number;
    growth30d: number;
  };
  events: {
    total: number;
    published: number;
    draft: number;
    review: number;
    upcoming: number;
    growth30d: number;
  };
  users: {
    total: number;
    active: number;
  };
  contacts: {
    total: number;
    unread: number;
    growth30d: number;
  };
  media: {
    total: number;
    totalSize: number;
    averageSize: number;
  };
  categories: Record<string, number>;
}

interface RecentContent {
  id: string;
  title: string;
  titleAr: string;
  type: 'news' | 'program' | 'event';
  status: string;
  updatedAt: string;
  featured?: boolean;
  author?: string;
  participants?: number;
  rating?: number;
  startDate?: string;
  endDate?: string;
  eventStatus?: string;
}

interface UpcomingEvent {
  id: string;
  titleEn: string;
  titleAr: string;
  startDate: string;
  endDate: string;
  locationEn?: string;
  locationAr?: string;
}

interface ContactMessage {
  id: string;
  name: string;
  subject: string;
  status: string;
  createdAt: string;
}

interface Analytics {
  contentGrowth30d: {
    news: number;
    programs: number;
    events: number;
    contacts: number;
  };
  totalParticipants: number;
  avgProgramRating: number;
  mediaStorage: {
    totalFiles: number;
    totalSizeBytes: number;
    totalSizeMB: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentContent, setRecentContent] = useState<RecentContent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [recentContacts, setRecentContacts] = useState<ContactMessage[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { currentLang, t, isRTL } = useLanguage();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentContent(data.recentActivity);
        setUpcomingEvents(data.upcomingEvents || []);
        setRecentContacts(data.recentContacts || []);
        setAnalytics(data.analytics);
      } else {
        // Enhanced fallback mock data
        setStats({
          news: { total: 6, published: 4, draft: 1, review: 1, growth30d: 2 },
          programs: { total: 6, published: 5, draft: 1, review: 0, totalParticipants: 150, growth30d: 1 },
          events: { total: 5, published: 3, draft: 1, review: 1, upcoming: 2, growth30d: 1 },
          users: { total: 5, active: 4 },
          contacts: { total: 12, unread: 3, growth30d: 5 },
          media: { total: 45, totalSize: 50000000, averageSize: 1111111 },
          categories: { news: 3, program: 2, event: 4, faq: 1 },
        });

        setRecentContent([
          {
            id: '1',
            title: 'New Training Program Launch',
            titleAr: 'إطلاق المرحلة الثانية من البرامج التطويرية',
            type: 'news',
            status: 'PUBLISHED',
            updatedAt: '2024-01-15T10:30:00Z',
            author: 'Admin User',
            featured: true,
          },
        ]);

        setUpcomingEvents([
          {
            id: '1',
            titleEn: 'Digital Transformation Workshop',
            titleAr: 'ورشة التحول الرقمي',
            startDate: '2024-01-20T09:00:00Z',
            endDate: '2024-01-20T17:00:00Z',
            locationEn: 'Main Conference Hall',
            locationAr: 'القاعة الرئيسية',
          },
        ]);

        setRecentContacts([
          {
            id: '1',
            name: 'Ahmed Al-Salem',
            subject: 'Program Inquiry',
            status: 'UNREAD',
            createdAt: '2024-01-15T08:30:00Z',
          },
        ]);

        setAnalytics({
          contentGrowth30d: { news: 2, programs: 1, events: 1, contacts: 5 },
          totalParticipants: 150,
          avgProgramRating: 4.5,
          mediaStorage: { totalFiles: 45, totalSizeBytes: 50000000, totalSizeMB: '47.68' },
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Enhanced fallback to minimal stats
      setStats({
        news: { total: 6, published: 4, draft: 1, review: 1, growth30d: 2 },
        programs: { total: 6, published: 5, draft: 1, review: 0, totalParticipants: 150, growth30d: 1 },
        events: { total: 5, published: 3, draft: 1, review: 1, upcoming: 2, growth30d: 1 },
        users: { total: 5, active: 4 },
        contacts: { total: 12, unread: 3, growth30d: 5 },
        media: { total: 45, totalSize: 50000000, averageSize: 1111111 },
        categories: { news: 3, program: 2, event: 4, faq: 1 },
      });
      setRecentContent([]);
      setUpcomingEvents([]);
      setRecentContacts([]);
      setAnalytics({
        contentGrowth30d: { news: 0, programs: 0, events: 0, contacts: 0 },
        totalParticipants: 0,
        avgProgramRating: 0,
        mediaStorage: { totalFiles: 0, totalSizeBytes: 0, totalSizeMB: '0' },
      });
    } finally {
      setLoading(false);
    }
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'REVIEW':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'UNREAD':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'READ':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return t('content.published');
      case 'DRAFT':
        return t('content.draft');
      case 'REVIEW':
        return currentLang === 'ar' ? 'تحت المراجعة' : 'Under Review';
      case 'UNREAD':
        return currentLang === 'ar' ? 'غير مقروء' : 'Unread';
      case 'READ':
        return currentLang === 'ar' ? 'مقروء' : 'Read';
      default:
        return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news':
        return <FileText className="h-4 w-4" />;
      case 'program':
        return <BookOpen className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getGrowthIndicator = (current: number, growth: number) => {
    if (growth > 0) {
      return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    } else if (growth < 0) {
      return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-news':
        router.push('/admin/news/create');
        break;
      case 'new-program':
        router.push('/admin/programs/create');
        break;
      case 'new-event':
        router.push('/admin/events/create');
        break;
      case 'preview-site':
        window.open('/', '_blank');
        break;
      case 'media-library':
        router.push('/admin/media');
        break;
      case 'contact-messages':
        router.push('/admin/contact-messages');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
          <p className="text-sm text-gray-600 font-readex">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header with Welcome and Quick Stats */}
      <div className="bg-gradient-to-r from-[#00808A]/10 to-[#00234E]/10 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-lg p-6">
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isRTL ? 'sm:' : ''}`}>
          <div>
            <h1 className="text-2xl font-bold text-[#00234E] dark:text-gray-100 font-readex">{t('dashboard_page.title')}</h1>
            <p className="text-gray-600 dark:text-gray-400 font-readex">{t('dashboard_page.welcome')}</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button onClick={() => handleQuickAction('preview-site')} className="inline-flex items-center gap-2 font-readex">
              <ExternalLink className="h-4 w-4" />
              {currentLang === 'ar' ? 'عرض الموقع' : 'Preview Website'}
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-readex">{t('stats.totalNews')}</CardTitle>
            <div className="flex items-center gap-1">
              {getGrowthIndicator(stats?.news.total || 0, stats?.news.growth30d || 0)}
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-readex">{stats?.news.total}</div>
            <div className="text-xs text-muted-foreground mt-1 font-readex">
              <span className="text-green-600">{stats?.news.published} {t('content.published')}</span> • 
              <span className={`text-yellow-600 ${isRTL ? 'mr-1' : 'ml-1'}`}>{stats?.news.draft} {t('content.draft')}</span>
              {stats?.news.growth30d ? (
                <div className="mt-1 text-xs text-green-600">+{stats.news.growth30d} {currentLang === 'ar' ? 'هذا الشهر' : 'this month'}</div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-readex">{t('stats.totalPrograms')}</CardTitle>
            <div className="flex items-center gap-1">
              {getGrowthIndicator(stats?.programs.total || 0, stats?.programs.growth30d || 0)}
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-readex">{stats?.programs.total}</div>
            <div className="text-xs text-muted-foreground mt-1 font-readex">
              <span className="text-green-600">{stats?.programs.published} {t('content.published')}</span> • 
              <span className={`text-yellow-600 ${isRTL ? 'mr-1' : 'ml-1'}`}>{stats?.programs.draft} {t('content.draft')}</span>
              {stats?.programs.totalParticipants ? (
                <div className="mt-1 text-xs text-blue-600">{stats.programs.totalParticipants} {currentLang === 'ar' ? 'مشارك' : 'participants'}</div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-readex">{t('stats.totalEvents')}</CardTitle>
            <div className="flex items-center gap-1">
              {getGrowthIndicator(stats?.events.total || 0, stats?.events.growth30d || 0)}
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-readex">{stats?.events.total}</div>
            <div className="text-xs text-muted-foreground mt-1 font-readex">
              <span className="text-blue-600">{stats?.events.upcoming} {currentLang === 'ar' ? 'قادمة' : 'upcoming'}</span> • 
              <span className={`text-green-600 ${isRTL ? 'mr-1' : 'ml-1'}`}>{stats?.events.published} {t('content.published')}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-readex">{currentLang === 'ar' ? 'رسائل التواصل' : 'Contact Messages'}</CardTitle>
            <div className="flex items-center gap-1">
              {stats?.contacts.unread ? <AlertCircle className="h-4 w-4 text-red-500" /> : <CheckCircle2 className="h-4 w-4 text-green-500" />}
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-readex">{stats?.contacts.total}</div>
            <div className="text-xs text-muted-foreground mt-1 font-readex">
              {stats?.contacts.unread ? (
                <span className="text-red-600">{stats.contacts.unread} {currentLang === 'ar' ? 'غير مقروءة' : 'unread'}</span>
              ) : (
                <span className="text-green-600">{currentLang === 'ar' ? 'جميع الرسائل مقروءة' : 'All messages read'}</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-readex">{currentLang === 'ar' ? 'مساحة الوسائط' : 'Media Storage'}</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-readex">{stats?.media.total}</div>
            <div className="text-xs text-muted-foreground mt-1 font-readex">
              <span>{analytics?.mediaStorage.totalSizeMB} {currentLang === 'ar' ? 'ميجابايت مستخدمة' : 'MB used'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics and Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions - Enhanced */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-readex">
              <Plus className="h-5 w-5" />
              {t('dashboard_page.quickActions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                onClick={() => handleQuickAction('new-news')}
              >
                <FileText className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium font-readex">{currentLang === 'ar' ? 'خبر جديد' : 'New Article'}</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-300"
                onClick={() => handleQuickAction('new-program')}
              >
                <BookOpen className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium font-readex">{currentLang === 'ar' ? 'برنامج جديد' : 'New Program'}</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-300"
                onClick={() => handleQuickAction('new-event')}
              >
                <Calendar className="h-6 w-6 text-purple-600" />
                <span className="text-sm font-medium font-readex">{currentLang === 'ar' ? 'فعالية جديدة' : 'New Event'}</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-orange-50 hover:border-orange-300"
                onClick={() => handleQuickAction('media-library')}
              >
                <Database className="h-6 w-6 text-orange-600" />
                <span className="text-sm font-medium font-readex">{currentLang === 'ar' ? 'مكتبة الوسائط' : 'Media Library'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-readex">
              <BarChart3 className="h-5 w-5" />
              {currentLang === 'ar' ? 'مقاييس الأداء' : 'Performance Metrics'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 font-readex">{analytics?.totalParticipants || 0}</div>
                <div className="text-sm text-muted-foreground font-readex">{currentLang === 'ar' ? 'إجمالي المشاركين' : 'Total Participants'}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <div className="text-2xl font-bold text-yellow-600 font-readex">{analytics?.avgProgramRating?.toFixed(1) || '0.0'}</div>
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                </div>
                <div className="text-sm text-muted-foreground font-readex">{currentLang === 'ar' ? 'متوسط التقييم' : 'Avg. Rating'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 font-readex">
                  {analytics?.contentGrowth30d ? 
                    Object.values(analytics.contentGrowth30d).reduce((a, b) => a + b, 0) : 0}
                </div>
                <div className="text-sm text-muted-foreground font-readex">{currentLang === 'ar' ? 'النمو (30 يوم)' : 'Growth (30d)'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 font-readex">{stats?.users.active || 0}</div>
                <div className="text-sm text-muted-foreground font-readex">{t('stats.activeUsers')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-readex">
              <Clock className="h-5 w-5" />
              {t('dashboard_page.recentActivity')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-4">
                {recentContent.map((content, index) => (
                <div key={`${content.type}-${content.id}-${index}`} className={`flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-start gap-3 ${isRTL ? '' : ''}`}>
                    {getTypeIcon(content.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate font-readex">{currentLang === 'ar' ? content.titleAr : content.title}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-readex">
                        {currentLang === 'ar' ? 'بواسطة' : 'by'} {content.author} • {new Date(content.updatedAt).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
                      </p>
                      {content.featured && (
                        <div className={`flex items-center gap-1 mt-1 ${isRTL ? '' : ''}`}>
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-yellow-600 font-readex">{currentLang === 'ar' ? 'مميز' : 'Featured'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(content.status)} variant="secondary">
                    <span className="font-readex">{getStatusText(content.status)}</span>
                  </Badge>
                </div>
              ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-readex">
              <Calendar className="h-5 w-5" />
              {currentLang === 'ar' ? 'الفعاليات القادمة' : 'Upcoming Events'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className={`p-3 border rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h4 className="font-medium text-sm font-readex">{currentLang === 'ar' ? event.titleAr : event.titleEn}</h4>
                    <div className={`flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400 ${isRTL ? '' : ''}`}>
                      <Calendar className="h-3 w-3" />
                      <span className="font-readex">{new Date(event.startDate).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}</span>
                    </div>
                    {(event.locationEn || event.locationAr) && (
                      <div className={`flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400 ${isRTL ? '' : ''}`}>
                        <MapPin className="h-3 w-3" />
                        <span className="font-readex">{currentLang === 'ar' ? event.locationAr : event.locationEn}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4 font-readex">{currentLang === 'ar' ? 'لا توجد فعاليات قادمة' : 'No upcoming events'}</p>
              )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Contact Messages */}
        <Card>
          <CardHeader className={`flex items-center justify-between ${isRTL ? '' : ''}`}>
            <CardTitle className="flex items-center gap-2 font-readex">
              <MessageSquare className="h-5 w-5" />
              {currentLang === 'ar' ? 'رسائل التواصل' : 'Contact Messages'}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleQuickAction('contact-messages')}
              className="font-readex"
            >
              {currentLang === 'ar' ? 'عرض الكل' : 'View All'}
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-4">
                {recentContacts.length > 0 ? (
                recentContacts.map((contact) => (
                  <div key={contact.id} className={`p-3 border rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-center justify-between ${isRTL ? '' : ''}`}>
                      <h4 className="font-medium text-sm font-readex">{contact.name}</h4>
                      <Badge className={getStatusColor(contact.status)} variant="secondary">
                        <span className="font-readex">{getStatusText(contact.status)}</span>
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-readex">{contact.subject}</p>
                    <p className="text-xs text-gray-500 mt-1 font-readex">{new Date(contact.createdAt).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4 font-readex">{currentLang === 'ar' ? 'لا توجد رسائل حديثة' : 'No recent messages'}</p>
              )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Content Status Overview - Enhanced */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-readex">
            <BarChart3 className="h-5 w-5" />
            {t('dashboard_page.overview')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className={`font-medium mb-4 flex items-center gap-2 font-readex ${isRTL ? '' : ''}`}>
                <FileText className="h-4 w-4" />
                {t('stats.totalNews')}
              </h3>
              <div className="space-y-3">
                <div className={`flex justify-between items-center ${isRTL ? '' : ''}`}>
                  <span className="text-sm font-readex">{t('content.published')}</span>
                  <div className={`flex items-center gap-2 ${isRTL ? '' : ''}`}>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${((stats?.news.published || 0) / (stats?.news.total || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium text-green-600 w-8 font-readex ${isRTL ? 'text-left' : 'text-right'}`}>{stats?.news.published}</span>
                  </div>
                </div>
                <div className={`flex justify-between items-center ${isRTL ? '' : ''}`}>
                  <span className="text-sm font-readex">{currentLang === 'ar' ? 'تحت المراجعة' : 'Under Review'}</span>
                  <div className={`flex items-center gap-2 ${isRTL ? '' : ''}`}>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${((stats?.news.review || 0) / (stats?.news.total || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium text-blue-600 w-8 font-readex ${isRTL ? 'text-left' : 'text-right'}`}>{stats?.news.review}</span>
                  </div>
                </div>
                <div className={`flex justify-between items-center ${isRTL ? '' : ''}`}>
                  <span className="text-sm font-readex">{t('content.draft')}</span>
                  <div className={`flex items-center gap-2 ${isRTL ? '' : ''}`}>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${((stats?.news.draft || 0) / (stats?.news.total || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium text-yellow-600 w-8 font-readex ${isRTL ? 'text-left' : 'text-right'}`}>{stats?.news.draft}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className={`font-medium mb-4 flex items-center gap-2 font-readex ${isRTL ? '' : ''}`}>
                <BookOpen className="h-4 w-4" />
                {t('stats.totalPrograms')}
              </h3>
              <div className="space-y-3">
                <div className={`flex justify-between items-center ${isRTL ? '' : ''}`}>
                  <span className="text-sm font-readex">{t('content.published')}</span>
                  <div className={`flex items-center gap-2 ${isRTL ? '' : ''}`}>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${((stats?.programs.published || 0) / (stats?.programs.total || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium text-green-600 w-8 font-readex ${isRTL ? 'text-left' : 'text-right'}`}>{stats?.programs.published}</span>
                  </div>
                </div>
                <div className={`flex justify-between items-center ${isRTL ? '' : ''}`}>
                  <span className="text-sm font-readex">{currentLang === 'ar' ? 'تحت المراجعة' : 'Under Review'}</span>
                  <div className={`flex items-center gap-2 ${isRTL ? '' : ''}`}>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${((stats?.programs.review || 0) / (stats?.programs.total || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium text-blue-600 w-8 font-readex ${isRTL ? 'text-left' : 'text-right'}`}>{stats?.programs.review}</span>
                  </div>
                </div>
                <div className={`flex justify-between items-center ${isRTL ? '' : ''}`}>
                  <span className="text-sm font-readex">{t('content.draft')}</span>
                  <div className={`flex items-center gap-2 ${isRTL ? '' : ''}`}>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${((stats?.programs.draft || 0) / (stats?.programs.total || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium text-yellow-600 w-8 font-readex ${isRTL ? 'text-left' : 'text-right'}`}>{stats?.programs.draft}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className={`font-medium mb-4 flex items-center gap-2 font-readex ${isRTL ? '' : ''}`}>
                <Calendar className="h-4 w-4" />
                {t('stats.totalEvents')}
              </h3>
              <div className="space-y-3">
                <div className={`flex justify-between items-center ${isRTL ? '' : ''}`}>
                  <span className="text-sm font-readex">{currentLang === 'ar' ? 'قادمة' : 'Upcoming'}</span>
                  <div className={`flex items-center gap-2 ${isRTL ? '' : ''}`}>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${((stats?.events.upcoming || 0) / (stats?.events.total || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium text-blue-600 w-8 font-readex ${isRTL ? 'text-left' : 'text-right'}`}>{stats?.events.upcoming}</span>
                  </div>
                </div>
                <div className={`flex justify-between items-center ${isRTL ? '' : ''}`}>
                  <span className="text-sm font-readex">{t('content.published')}</span>
                  <div className={`flex items-center gap-2 ${isRTL ? '' : ''}`}>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${((stats?.events.published || 0) / (stats?.events.total || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium text-green-600 w-8 font-readex ${isRTL ? 'text-left' : 'text-right'}`}>{stats?.events.published}</span>
                  </div>
                </div>
                <div className={`flex justify-between items-center ${isRTL ? '' : ''}`}>
                  <span className="text-sm font-readex">{t('content.draft')}</span>
                  <div className={`flex items-center gap-2 ${isRTL ? '' : ''}`}>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${((stats?.events.draft || 0) / (stats?.events.total || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium text-yellow-600 w-8 font-readex ${isRTL ? 'text-left' : 'text-right'}`}>{stats?.events.draft}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
