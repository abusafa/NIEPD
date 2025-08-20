'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { 
  AlertTriangle, 
  Bug,
  Code,
  Monitor,
  User,
  Calendar, 
  Eye, 
  Trash2, 
  Filter,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  Settings,
  UserCheck,
  ArrowUpDown,
  MoreHorizontal,
  Download,
  RefreshCw,
  CheckSquare,
  Square,
  ExternalLink,
  Send,
  Edit3,
  FileText
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';

import { ToastProvider, useToast } from '@/components/ui/toast';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface ErrorReport {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  pageUrl: string;
  userAgent?: string;
  ipAddress?: string;
  browserInfo?: {
    browser?: string;
    version?: string;
    os?: string;
    screenResolution?: string;
    viewport?: string;
    language?: string;
  };
  errorStack?: string;
  errorType: 'USER_REPORTED' | 'JAVASCRIPT_ERROR' | 'API_ERROR' | 'UI_BUG';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'NEW' | 'INVESTIGATING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  assignedToId?: string;
  assignedTo?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  resolutionNotesAr?: string;
  resolutionNotesEn?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ErrorReportStats {
  total: number;
  new: number;
  investigating: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

// Enhanced ErrorReportsPage Component
const ErrorReportsPage = () => {
  const { addToast } = useToast();
  const [reports, setReports] = useState<ErrorReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ErrorReport | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<ErrorReportStats>({
    total: 0,
    new: 0,
    investigating: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });
  
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    errorType: '',
    assignedTo: '',
    search: '',
    dateFrom: '',
    dateTo: '',
  });
  
  const [selectedReports, setSelectedReports] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'severity' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchReports();
    fetchUsers();
  }, [pagination.page, filters, sortBy, sortOrder]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchReports(true); // Silent refresh
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [autoRefresh, filters, pagination.page, sortBy, sortOrder]);

  const fetchReports = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: sortBy,
        order: sortOrder,
        ...(filters.status && { status: filters.status }),
        ...(filters.severity && { severity: filters.severity }),
        ...(filters.errorType && { errorType: filters.errorType }),
        ...(filters.assignedTo && { assignedTo: filters.assignedTo }),
        ...(filters.search && { search: filters.search }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
      });

      const response = await fetch(`/api/error-reports?${params}`);
      const data = await response.json();

      if (response.ok) {
        const oldCount = reports.length;
        const newCount = data.data.length;
        
        setReports(data.data);
        setPagination(data.pagination);
        setStats(data.stats || stats);
        
        if (silent && newCount > oldCount) {
          addToast({
            type: 'info',
            title: 'تقارير خطأ جديدة',
            description: `تم استلام ${newCount - oldCount} تقرير خطأ جديد`
          });
        }
      } else {
        addToast({
          type: 'error',
          title: 'خطأ',
          description: 'فشل في تحميل تقارير الأخطاء'
        });
      }
    } catch (error) {
      console.error('Error fetching error reports:', error);
      addToast({
        type: 'error',
        title: 'خطأ في الشبكة',
        description: 'تعذر الاتصال بالخادم'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (response.ok) {
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const updateReportStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/error-reports/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await fetchReports();
        addToast({
          type: 'success',
          title: 'تم التحديث',
          description: 'تم تحديث حالة تقرير الخطأ بنجاح'
        });
      } else {
        addToast({
          type: 'error',
          title: 'خطأ',
          description: 'فشل في تحديث حالة تقرير الخطأ'
        });
      }
    } catch (error) {
      console.error('Error updating report status:', error);
      addToast({
        type: 'error',
        title: 'خطأ',
        description: 'تعذر تحديث حالة تقرير الخطأ'
      });
    }
  };

  const assignReport = async (id: string, assignedToId: string) => {
    try {
      const response = await fetch(`/api/error-reports/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignedToId: assignedToId || null }),
      });

      if (response.ok) {
        await fetchReports();
        addToast({
          type: 'success',
          title: 'تم التخصيص',
          description: 'تم تخصيص تقرير الخطأ بنجاح'
        });
      } else {
        addToast({
          type: 'error',
          title: 'خطأ',
          description: 'فشل في تخصيص تقرير الخطأ'
        });
      }
    } catch (error) {
      console.error('Error assigning report:', error);
    }
  };

  const deleteReport = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقرير؟')) return;

    try {
      const response = await fetch(`/api/error-reports/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchReports();
        addToast({
          type: 'success',
          title: 'تم الحذف',
          description: 'تم حذف تقرير الخطأ بنجاح'
        });
      } else {
        addToast({
          type: 'error',
          title: 'خطأ',
          description: 'فشل في حذف تقرير الخطأ'
        });
      }
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  // Status and severity styling functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-red-100 text-red-800';
      case 'INVESTIGATING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getErrorTypeIcon = (type: string) => {
    switch (type) {
      case 'USER_REPORTED':
        return <User className="w-4 h-4" />;
      case 'JAVASCRIPT_ERROR':
        return <Code className="w-4 h-4" />;
      case 'API_ERROR':
        return <Zap className="w-4 h-4" />;
      case 'UI_BUG':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Bug className="w-4 h-4" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Statistics cards
  const statCards = [
    { label: 'الإجمالي', value: stats.total, color: 'bg-blue-500', icon: <Bug /> },
    { label: 'جديد', value: stats.new, color: 'bg-red-500', icon: <AlertCircle /> },
    { label: 'قيد التحقيق', value: stats.investigating, color: 'bg-yellow-500', icon: <Search /> },
    { label: 'قيد العمل', value: stats.inProgress, color: 'bg-blue-500', icon: <Settings /> },
    { label: 'محلول', value: stats.resolved, color: 'bg-green-500', icon: <CheckCircle /> },
    { label: 'مغلق', value: stats.closed, color: 'bg-gray-500', icon: <CheckSquare /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>جاري تحميل تقارير الأخطاء...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تقارير الأخطاء</h1>
          <p className="text-gray-600">إدارة ومتابعة تقارير الأخطاء من المستخدمين</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              autoRefresh 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            تحديث تلقائي
          </button>
          
          <button
            onClick={() => fetchReports()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="البحث في التقارير..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">كل الحالات</option>
            <option value="NEW">جديد</option>
            <option value="INVESTIGATING">قيد التحقيق</option>
            <option value="IN_PROGRESS">قيد العمل</option>
            <option value="RESOLVED">محلول</option>
            <option value="CLOSED">مغلق</option>
          </select>
          
          <select
            value={filters.severity}
            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">كل المستويات</option>
            <option value="LOW">منخفض</option>
            <option value="MEDIUM">متوسط</option>
            <option value="HIGH">عالي</option>
            <option value="CRITICAL">حرج</option>
          </select>
          
          <select
            value={filters.errorType}
            onChange={(e) => setFilters({ ...filters, errorType: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">كل الأنواع</option>
            <option value="USER_REPORTED">تقرير مستخدم</option>
            <option value="JAVASCRIPT_ERROR">خطأ جافاسكريبت</option>
            <option value="API_ERROR">خطأ API</option>
            <option value="UI_BUG">خطأ واجهة</option>
          </select>
          
          <select
            value={filters.assignedTo}
            onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">كل المخصص إليهم</option>
            <option value="">غير مخصص</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user.username
                }
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setFilters({
              status: '', severity: '', errorType: '', assignedTo: '', search: '', dateFrom: '', dateTo: ''
            })}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            مسح المرشحات
          </button>
        </div>
      </div>

      {/* Error Reports Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                  العنوان
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                  النوع
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                  الحالة
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                  الأولوية
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                  المخصص إليه
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                  التاريخ
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900 truncate max-w-48">
                        {report.titleAr}
                      </p>
                      <p className="text-sm text-gray-500">
                        {report.userName || report.userEmail || 'مجهول'}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getErrorTypeIcon(report.errorType)}
                      <span className="text-sm text-gray-600">
                        {report.errorType === 'USER_REPORTED' && 'تقرير مستخدم'}
                        {report.errorType === 'JAVASCRIPT_ERROR' && 'خطأ JS'}
                        {report.errorType === 'API_ERROR' && 'خطأ API'}
                        {report.errorType === 'UI_BUG' && 'خطأ UI'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                      {report.status === 'NEW' && 'جديد'}
                      {report.status === 'INVESTIGATING' && 'قيد التحقيق'}
                      {report.status === 'IN_PROGRESS' && 'قيد العمل'}
                      {report.status === 'RESOLVED' && 'محلول'}
                      {report.status === 'CLOSED' && 'مغلق'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(report.severity)}`}>
                      {report.severity === 'LOW' && 'منخفض'}
                      {report.severity === 'MEDIUM' && 'متوسط'}
                      {report.severity === 'HIGH' && 'عالي'}
                      {report.severity === 'CRITICAL' && 'حرج'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {report.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">
                          {report.assignedTo.firstName && report.assignedTo.lastName 
                            ? `${report.assignedTo.firstName} ${report.assignedTo.lastName}` 
                            : report.assignedTo.username
                          }
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">غير مخصص</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDateTime(report.createdAt)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setShowReportModal(true);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <select
                        value={report.status}
                        onChange={(e) => updateReportStatus(report.id, e.target.value)}
                        className="text-xs px-2 py-1 border border-gray-300 rounded"
                      >
                        <option value="NEW">جديد</option>
                        <option value="INVESTIGATING">قيد التحقيق</option>
                        <option value="IN_PROGRESS">قيد العمل</option>
                        <option value="RESOLVED">محلول</option>
                        <option value="CLOSED">مغلق</option>
                      </select>
                      
                      <select
                        value={report.assignedToId || ''}
                        onChange={(e) => assignReport(report.id, e.target.value)}
                        className="text-xs px-2 py-1 border border-gray-300 rounded"
                      >
                        <option value="">غير مخصص</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.firstName && user.lastName 
                              ? `${user.firstName} ${user.lastName}` 
                              : user.username
                            }
                          </option>
                        ))}
                      </select>
                      
                      <button
                        onClick={() => deleteReport(report.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              عرض {(pagination.page - 1) * pagination.limit + 1} إلى{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} من{' '}
              {pagination.total} تقرير
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
              >
                السابق
              </button>
              
              <span className="px-3 py-1 text-sm">
                صفحة {pagination.page} من {pagination.totalPages}
              </span>
              
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Report Details Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="max-w-4xl max-h-[90vh]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">تفاصيل تقرير الخطأ</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[70vh]">
          {selectedReport && (
            <div className="space-y-6">
              {/* Header Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">معلومات التقرير</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">الحالة:</span> 
                      <span className={`mr-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedReport.status)}`}>
                        {selectedReport.status === 'NEW' && 'جديد'}
                        {selectedReport.status === 'INVESTIGATING' && 'قيد التحقيق'}
                        {selectedReport.status === 'IN_PROGRESS' && 'قيد العمل'}
                        {selectedReport.status === 'RESOLVED' && 'محلول'}
                        {selectedReport.status === 'CLOSED' && 'مغلق'}
                      </span>
                    </p>
                    <p><span className="font-medium">الأولوية:</span> 
                      <span className={`mr-2 px-2 py-1 rounded-full text-xs ${getSeverityColor(selectedReport.severity)}`}>
                        {selectedReport.severity === 'LOW' && 'منخفض'}
                        {selectedReport.severity === 'MEDIUM' && 'متوسط'}
                        {selectedReport.severity === 'HIGH' && 'عالي'}
                        {selectedReport.severity === 'CRITICAL' && 'حرج'}
                      </span>
                    </p>
                    <p><span className="font-medium">النوع:</span> 
                      <span className="mr-2">
                        {selectedReport.errorType === 'USER_REPORTED' && 'تقرير مستخدم'}
                        {selectedReport.errorType === 'JAVASCRIPT_ERROR' && 'خطأ جافاسكريبت'}
                        {selectedReport.errorType === 'API_ERROR' && 'خطأ API'}
                        {selectedReport.errorType === 'UI_BUG' && 'خطأ واجهة'}
                      </span>
                    </p>
                    <p><span className="font-medium">تاريخ التقرير:</span> {formatDateTime(selectedReport.createdAt)}</p>
                    {selectedReport.resolvedAt && (
                      <p><span className="font-medium">تاريخ الحل:</span> {formatDateTime(selectedReport.resolvedAt)}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">معلومات المستخدم</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">الاسم:</span> {selectedReport.userName || 'غير محدد'}</p>
                    <p><span className="font-medium">البريد الإلكتروني:</span> {selectedReport.userEmail || 'غير محدد'}</p>
                    <p><span className="font-medium">الهاتف:</span> {selectedReport.userPhone || 'غير محدد'}</p>
                    <p><span className="font-medium">عنوان IP:</span> {selectedReport.ipAddress || 'غير محدد'}</p>
                    <p><span className="font-medium">المخصص إليه:</span> 
                      {selectedReport.assignedTo 
                        ? `${selectedReport.assignedTo.firstName} ${selectedReport.assignedTo.lastName}` 
                        : 'غير مخصص'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Report Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">عنوان التقرير (عربي)</h3>
                  <p className="p-3 bg-gray-50 rounded-lg">{selectedReport.titleAr}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">عنوان التقرير (إنجليزي)</h3>
                  <p className="p-3 bg-gray-50 rounded-lg" dir="ltr">{selectedReport.titleEn}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">وصف المشكلة (عربي)</h3>
                  <p className="p-3 bg-gray-50 rounded-lg whitespace-pre-wrap">{selectedReport.descriptionAr}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">وصف المشكلة (إنجليزي)</h3>
                  <p className="p-3 bg-gray-50 rounded-lg whitespace-pre-wrap" dir="ltr">{selectedReport.descriptionEn}</p>
                </div>
              </div>

              {/* Technical Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">التفاصيل التقنية</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">رابط الصفحة:</span> 
                      <a href={selectedReport.pageUrl} target="_blank" rel="noopener noreferrer" 
                         className="mr-2 text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        {selectedReport.pageUrl}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </p>
                    <p><span className="font-medium">وكيل المستخدم:</span></p>
                    <p className="text-xs bg-gray-100 p-2 rounded font-mono">{selectedReport.userAgent}</p>
                  </div>
                </div>

                {selectedReport.browserInfo && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">معلومات المتصفح</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedReport.browserInfo.browser && (
                        <p><span className="font-medium">المتصفح:</span> {selectedReport.browserInfo.browser}</p>
                      )}
                      {selectedReport.browserInfo.version && (
                        <p><span className="font-medium">الإصدار:</span> {selectedReport.browserInfo.version}</p>
                      )}
                      {selectedReport.browserInfo.os && (
                        <p><span className="font-medium">نظام التشغيل:</span> {selectedReport.browserInfo.os}</p>
                      )}
                      {selectedReport.browserInfo.screenResolution && (
                        <p><span className="font-medium">دقة الشاشة:</span> {selectedReport.browserInfo.screenResolution}</p>
                      )}
                      {selectedReport.browserInfo.viewport && (
                        <p><span className="font-medium">حجم النافذة:</span> {selectedReport.browserInfo.viewport}</p>
                      )}
                      {selectedReport.browserInfo.language && (
                        <p><span className="font-medium">اللغة:</span> {selectedReport.browserInfo.language}</p>
                      )}
                    </div>
                  </div>
                )}

                {selectedReport.errorStack && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">تفاصيل الخطأ التقني</h3>
                    <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                      {selectedReport.errorStack}
                    </pre>
                  </div>
                )}
              </div>

              {/* Resolution Notes */}
              {(selectedReport.resolutionNotesAr || selectedReport.resolutionNotesEn) && (
                <div className="space-y-4">
                  {selectedReport.resolutionNotesAr && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">ملاحظات الحل (عربي)</h3>
                      <p className="p-3 bg-green-50 border border-green-200 rounded-lg whitespace-pre-wrap">
                        {selectedReport.resolutionNotesAr}
                      </p>
                    </div>
                  )}
                  
                  {selectedReport.resolutionNotesEn && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">ملاحظات الحل (إنجليزي)</h3>
                      <p className="p-3 bg-green-50 border border-green-200 rounded-lg whitespace-pre-wrap" dir="ltr">
                        {selectedReport.resolutionNotesEn}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => updateReportStatus(selectedReport.id, 'IN_PROGRESS')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Settings className="w-4 h-4" />
                  بدء العمل
                </button>
                
                <button
                  onClick={() => updateReportStatus(selectedReport.id, 'RESOLVED')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  وضع علامة محلول
                </button>
                
                <button
                  onClick={() => updateReportStatus(selectedReport.id, 'CLOSED')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <CheckSquare className="w-4 h-4" />
                  إغلاق
                </button>

                <a
                  href={selectedReport.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  زيارة الصفحة
                </a>
              </div>
            </div>
          )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {reports.length === 0 && !loading && (
        <div className="text-center py-12">
          <Bug className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تقارير أخطاء</h3>
          <p className="text-gray-500">لم يتم العثور على تقارير أخطاء مطابقة للمرشحات المحددة.</p>
        </div>
      )}
    </div>
  );
};

export default ErrorReportsPage;
