'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Eye,
  Edit,
  Clock
} from 'lucide-react';

interface DashboardStats {
  news: {
    total: number;
    published: number;
    draft: number;
    review: number;
  };
  programs: {
    total: number;
    published: number;
    draft: number;
    review: number;
  };
  events: {
    total: number;
    published: number;
    draft: number;
    review: number;
    upcoming: number;
  };
  users: {
    total: number;
    active: number;
  };
}

interface RecentContent {
  id: string;
  title: string;
  type: 'news' | 'program' | 'event';
  status: string;
  updatedAt: string;
  author?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentContent, setRecentContent] = useState<RecentContent[]>([]);
  const [loading, setLoading] = useState(true);

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
      } else {
        // Fallback to mock data
        setStats({
          news: { total: 6, published: 4, draft: 1, review: 1 },
          programs: { total: 6, published: 5, draft: 1, review: 0 },
          events: { total: 5, published: 3, draft: 1, review: 1, upcoming: 2 },
          users: { total: 1, active: 1 },
        });

        setRecentContent([
          {
            id: '1',
            title: 'إطلاق المرحلة الثانية من البرامج التطويرية',
            type: 'news',
            status: 'PUBLISHED',
            updatedAt: '2024-01-15T10:30:00Z',
            author: 'Admin User',
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to minimal stats
      setStats({
        news: { total: 6, published: 4, draft: 1, review: 1 },
        programs: { total: 6, published: 5, draft: 1, review: 0 },
        events: { total: 5, published: 3, draft: 1, review: 1, upcoming: 2 },
        users: { total: 1, active: 1 },
      });
      setRecentContent([]);
    } finally {
      setLoading(false);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to the NIEPD Content Management System</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total News</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.news.total}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">{stats?.news.published} published</span> • 
              <span className="text-yellow-600 ml-1">{stats?.news.draft} draft</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.programs.total}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">{stats?.programs.published} published</span> • 
              <span className="text-yellow-600 ml-1">{stats?.programs.draft} draft</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.events.total}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-blue-600">{stats?.events.upcoming} upcoming</span> • 
              <span className="text-green-600 ml-1">{stats?.events.published} published</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users.total}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">{stats?.users.active} active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContent.map((content, index) => (
                <div key={`${content.type}-${content.id}-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(content.type)}
                    <div>
                      <h4 className="font-medium text-sm">{content.title}</h4>
                      <p className="text-xs text-gray-600">
                        by {content.author} • {new Date(content.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(content.status)}>
                    {content.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="h-6 w-6 mb-2 text-blue-600" />
                <span className="text-sm font-medium">New Article</span>
              </button>
              
              <button className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <BookOpen className="h-6 w-6 mb-2 text-green-600" />
                <span className="text-sm font-medium">New Program</span>
              </button>
              
              <button className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="h-6 w-6 mb-2 text-purple-600" />
                <span className="text-sm font-medium">New Event</span>
              </button>
              
              <button className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Eye className="h-6 w-6 mb-2 text-orange-600" />
                <span className="text-sm font-medium">Preview Site</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Content Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-3">News Articles</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Published</span>
                  <span className="text-sm font-medium text-green-600">{stats?.news.published}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Under Review</span>
                  <span className="text-sm font-medium text-blue-600">{stats?.news.review}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Draft</span>
                  <span className="text-sm font-medium text-yellow-600">{stats?.news.draft}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Training Programs</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Published</span>
                  <span className="text-sm font-medium text-green-600">{stats?.programs.published}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Under Review</span>
                  <span className="text-sm font-medium text-blue-600">{stats?.programs.review}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Draft</span>
                  <span className="text-sm font-medium text-yellow-600">{stats?.programs.draft}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Events</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Upcoming</span>
                  <span className="text-sm font-medium text-blue-600">{stats?.events.upcoming}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Published</span>
                  <span className="text-sm font-medium text-green-600">{stats?.events.published}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Draft</span>
                  <span className="text-sm font-medium text-yellow-600">{stats?.events.draft}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
