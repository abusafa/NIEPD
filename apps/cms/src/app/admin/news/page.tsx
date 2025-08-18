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
  MoreHorizontal,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NewsItem {
  id: string;
  titleAr: string;
  titleEn: string;
  summaryAr?: string;
  summaryEn?: string;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  featured: boolean;
  publishedAt?: string;
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

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchNews();
  }, [statusFilter, currentPage]);

  const fetchNews = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      params.set('page', currentPage.toString());
      params.set('limit', '10');

      const response = await fetch(`/api/news?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNews(data.news);
        setTotalPages(data.pages);
      } else {
        console.error('Failed to fetch news');
        setNews([]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    router.push('/admin/news/create');
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/news/${id}/edit`);
  };

  const handleView = (id: string) => {
    router.push(`/admin/news/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news article?')) {
      return;
    }

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        fetchNews(); // Refresh the list
      } else {
        alert('Failed to delete news article');
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('Failed to delete news article');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const response = await fetch(`/api/news/${id}/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        fetchNews(); // Refresh the list
      } else {
        alert('Failed to publish article');
      }
    } catch (error) {
      console.error('Error publishing article:', error);
      alert('Failed to publish article');
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      const response = await fetch(`/api/news/${id}/unpublish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        fetchNews(); // Refresh the list
      } else {
        alert('Failed to unpublish article');
      }
    } catch (error) {
      console.error('Error unpublishing article:', error);
      alert('Failed to unpublish article');
    }
  };

  const handleSubmitForReview = async (id: string) => {
    try {
      const response = await fetch(`/api/news/${id}/review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        fetchNews(); // Refresh the list
      } else {
        alert('Failed to submit for review');
      }
    } catch (error) {
      console.error('Error submitting for review:', error);
      alert('Failed to submit for review');
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

  const filteredNews = news.filter(item => {
    const matchesSearch = 
      item.titleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.titleEn.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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
          <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
          <p className="text-gray-600">Manage news articles and announcements</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          New Article
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
                  placeholder="Search articles..."
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
            <div className="text-2xl font-bold">{news.filter(n => n.status === 'PUBLISHED').length}</div>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{news.filter(n => n.status === 'REVIEW').length}</div>
            <p className="text-xs text-muted-foreground">Under Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{news.filter(n => n.status === 'DRAFT').length}</div>
            <p className="text-xs text-muted-foreground">Drafts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{news.filter(n => n.featured).length}</div>
            <p className="text-xs text-muted-foreground">Featured</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Articles ({filteredNews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNews.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {article.titleEn}
                        </div>
                        <div className="text-sm text-gray-600" dir="rtl">
                          {article.titleAr}
                        </div>
                        {article.featured && (
                          <Badge variant="outline" className="text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {article.category?.nameEn || 'No Category'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(article.status)}>
                        {article.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {article.author?.firstName && article.author?.lastName 
                            ? `${article.author.firstName} ${article.author.lastName}`
                            : article.author?.username || 'Unknown'
                          }
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {new Date(article.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Quick status actions */}
                        {article.status === 'DRAFT' && (
                          <Button variant="outline" size="sm" onClick={() => handleSubmitForReview(article.id)}>
                            <Clock className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        )}
                        {article.status === 'REVIEW' && (
                          <Button variant="outline" size="sm" onClick={() => handlePublish(article.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Publish
                          </Button>
                        )}
                        {article.status === 'PUBLISHED' && (
                          <Button variant="outline" size="sm" onClick={() => handleUnpublish(article.id)}>
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
                            <DropdownMenuItem onClick={() => handleView(article.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(article.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            
                            {/* Publishing workflow actions */}
                            {article.status === 'DRAFT' && (
                              <>
                                <DropdownMenuItem onClick={() => handleSubmitForReview(article.id)}>
                                  <Clock className="mr-2 h-4 w-4" />
                                  Submit for Review
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePublish(article.id)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Publish Now
                                </DropdownMenuItem>
                              </>
                            )}
                            
                            {article.status === 'REVIEW' && (
                              <>
                                <DropdownMenuItem onClick={() => handlePublish(article.id)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve & Publish
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUnpublish(article.id)}>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject to Draft
                                </DropdownMenuItem>
                              </>
                            )}
                            
                            {article.status === 'PUBLISHED' && (
                              <DropdownMenuItem onClick={() => handleUnpublish(article.id)}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Unpublish
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(article.id)}
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
