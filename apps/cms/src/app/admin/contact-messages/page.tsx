'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  Eye, 
  Trash2, 
  Filter,
  Search,
  MessageCircle,
  Archive,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Download,
  Printer,
  RefreshCw,
  CheckSquare,
  Square,
  Reply,
  FileText,
  Send,
  AlertCircle,
  Star,
  StarOff,
  ExternalLink
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

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Enhanced ContactMessagesPage Component
const ContactMessagesPage = () => {
  const { addToast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    dateFrom: '',
    dateTo: '',
    priority: '',
  });
  
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'name' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchMessages();
  }, [pagination.page, filters, sortBy, sortOrder]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchMessages(true); // Silent refresh
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [autoRefresh, filters, pagination.page, sortBy, sortOrder]);

  const fetchMessages = async (silent = false) => {
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
        ...(filters.search && { search: filters.search }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
        ...(filters.priority && { priority: filters.priority }),
      });

      const response = await fetch(`/api/contact-messages?${params}`);
      const data = await response.json();

      if (response.ok) {
        const oldCount = messages.length;
        const newCount = data.data.length;
        
        setMessages(data.data);
        setPagination(data.pagination);
        
        if (silent && newCount > oldCount) {
          addToast({
            type: 'info',
            title: 'رسائل جديدة',
            description: `تم استلام ${newCount - oldCount} رسالة جديدة`
          });
        }
      } else {
        addToast({
          type: 'error',
          title: 'خطأ',
          description: 'فشل في تحميل الرسائل'
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
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

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/contact-messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        addToast({
          type: 'success',
          title: 'تم التحديث',
          description: 'تم تحديث حالة الرسالة بنجاح'
        });
        fetchMessages(); // Refresh the list
      } else {
        addToast({
          type: 'error',
          title: 'خطأ',
          description: 'فشل في تحديث حالة الرسالة'
        });
      }
    } catch (error) {
      console.error('Error updating message status:', error);
      addToast({
        type: 'error',
        title: 'خطأ في الشبكة',
        description: 'تعذر تحديث حالة الرسالة'
      });
    }
  };

  // Bulk operations
  const handleBulkAction = async () => {
    if (!bulkAction || selectedMessages.size === 0) return;

    try {
      const promises = Array.from(selectedMessages).map(id => {
        if (bulkAction === 'delete') {
          return fetch(`/api/contact-messages/${id}`, { method: 'DELETE' });
        } else {
          return fetch(`/api/contact-messages/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: bulkAction }),
          });
        }
      });

      await Promise.all(promises);
      
      setSelectedMessages(new Set());
      setBulkAction('');
      
      addToast({
        type: 'success',
        title: 'تمت العملية',
        description: `تم تطبيق العملية على ${selectedMessages.size} رسالة`
      });
      
      fetchMessages();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'خطأ',
        description: 'فشل في تطبيق العملية المجمعة'
      });
    }
  };

  // Export functionality
  const exportMessages = () => {
    const csvContent = [
      ['التاريخ', 'الاسم', 'البريد الإلكتروني', 'الهاتف', 'الموضوع', 'الرسالة', 'الحالة'],
      ...messages.map(msg => [
        new Date(msg.createdAt).toLocaleDateString('ar-SA'),
        msg.name,
        msg.email,
        msg.phone || '',
        msg.subject,
        msg.message.replace(/\n/g, ' '),
        msg.status
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contact_messages_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addToast({
      type: 'success',
      title: 'تم التصدير',
      description: 'تم تصدير الرسائل بنجاح'
    });
  };

  // View message details
  const viewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
    
    // Mark as read if it's unread
    if (message.status === 'UNREAD') {
      updateMessageStatus(message.id, 'READ');
    }
  };

  // Toggle message selection
  const toggleMessageSelection = (messageId: string) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(messageId)) {
      newSelected.delete(messageId);
    } else {
      newSelected.add(messageId);
    }
    setSelectedMessages(newSelected);
  };

  // Select all messages
  const toggleSelectAll = () => {
    if (selectedMessages.size === messages.length) {
      setSelectedMessages(new Set());
    } else {
      setSelectedMessages(new Set(messages.map(m => m.id)));
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟ / Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const response = await fetch(`/api/contact-messages/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        addToast({
          type: 'success',
          title: 'تم الحذف',
          description: 'تم حذف الرسالة بنجاح'
        });
        fetchMessages(); // Refresh the list
      } else {
        addToast({
          type: 'error',
          title: 'خطأ',
          description: 'فشل في حذف الرسالة'
        });
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      addToast({
        type: 'error',
        title: 'خطأ في الشبكة',
        description: 'تعذر حذف الرسالة'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      UNREAD: { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'غير مقروء' },
      READ: { color: 'bg-green-100 text-green-800', icon: Eye, label: 'مقروء' },
      REPLIED: { color: 'bg-purple-100 text-purple-800', icon: CheckCircle, label: 'تم الرد' },
      ARCHIVED: { color: 'bg-gray-100 text-gray-800', icon: Archive, label: 'مؤرشف' },
    };

    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon size={12} />
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUnreadCount = () => messages.filter(m => m.status === 'UNREAD').length;
  const getRepliedCount = () => messages.filter(m => m.status === 'REPLIED').length;
  const getArchivedCount = () => messages.filter(m => m.status === 'ARCHIVED').length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto" dir="rtl">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">رسائل التواصل</h1>
            <p className="text-gray-600">إدارة رسائل التواصل الواردة من الموقع</p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            {/* Auto-refresh toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                autoRefresh 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm">تحديث تلقائي</span>
            </button>
            
            {/* Export button */}
            <button
              onClick={exportMessages}
              disabled={messages.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">تصدير</span>
            </button>
            
            {/* Manual refresh */}
            <button
              onClick={() => fetchMessages()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">تحديث</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي الرسائل</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">غير مقروءة</p>
              <p className="text-2xl font-bold text-blue-600">{getUnreadCount()}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">تم الرد عليها</p>
              <p className="text-2xl font-bold text-green-600">{getRepliedCount()}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مؤرشفة</p>
              <p className="text-2xl font-bold text-gray-600">{getArchivedCount()}</p>
            </div>
            <Archive className="w-8 h-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="space-y-4">
          {/* First row - Search and Status */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="البحث في الرسائل..."
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">جميع الحالات</option>
                <option value="UNREAD">غير مقروء</option>
                <option value="READ">مقروء</option>
                <option value="REPLIED">تم الرد</option>
                <option value="ARCHIVED">مؤرشف</option>
              </select>
            </div>
          </div>

          {/* Second row - Date filters and Sort */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">من تاريخ</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">إلى تاريخ</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                />
              </div>
            </div>

            {/* Sort */}
            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">ترتيب حسب</label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as 'createdAt' | 'name' | 'status');
                  setSortOrder(order as 'asc' | 'desc');
                }}
              >
                <option value="createdAt-desc">الأحدث أولاً</option>
                <option value="createdAt-asc">الأقدم أولاً</option>
                <option value="name-asc">الاسم أ-ي</option>
                <option value="name-desc">الاسم ي-أ</option>
                <option value="status-asc">الحالة</option>
              </select>
            </div>
          </div>

          {/* Clear filters */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                setFilters({
                  status: '',
                  search: '',
                  dateFrom: '',
                  dateTo: '',
                  priority: '',
                });
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              مسح جميع المرشحات
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedMessages.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-blue-800">
                تم تحديد {selectedMessages.size} رسالة
              </span>
              <select
                className="px-3 py-1 border border-blue-300 rounded text-sm"
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
              >
                <option value="">اختر عملية</option>
                <option value="READ">وضع علامة كمقروء</option>
                <option value="UNREAD">وضع علامة كغير مقروء</option>
                <option value="REPLIED">وضع علامة كتم الرد</option>
                <option value="ARCHIVED">أرشفة</option>
                <option value="delete">حذف</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                تطبيق
              </button>
            </div>
            <button
              onClick={() => setSelectedMessages(new Set())}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              إلغاء التحديد
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Messages Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right">
                  <button
                    onClick={toggleSelectAll}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {selectedMessages.size === messages.length && messages.length > 0 ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المرسل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الموضوع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {messages.map((message) => (
                <tr 
                  key={message.id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    message.status === 'UNREAD' ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleMessageSelection(message.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {selectedMessages.has(message.id) ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="mr-4">
                        <div className={`text-sm font-medium ${
                          message.status === 'UNREAD' ? 'text-gray-900 font-semibold' : 'text-gray-700'
                        }`}>
                          {message.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {message.email}
                        </div>
                        {message.phone && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {message.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className={`text-sm font-medium truncate ${
                      message.status === 'UNREAD' ? 'text-gray-900 font-semibold' : 'text-gray-700'
                    }`}>
                      {message.subject}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {message.message.substring(0, 100)}
                      {message.message.length > 100 && '...'}
                    </div>
                    <button
                      onClick={() => viewMessage(message)}
                      className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                    >
                      عرض كامل
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(message.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(message.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {/* Quick view */}
                      <button
                        onClick={() => viewMessage(message)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="عرض"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {/* Status Update Dropdown */}
                      <select
                        className="text-xs border border-gray-200 rounded px-2 py-1"
                        value={message.status}
                        onChange={(e) => updateMessageStatus(message.id, e.target.value)}
                      >
                        <option value="UNREAD">غير مقروء</option>
                        <option value="READ">مقروء</option>
                        <option value="REPLIED">تم الرد</option>
                        <option value="ARCHIVED">مؤرشف</option>
                      </select>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => deleteMessage(message.id)}
                        className="text-red-600 hover:text-red-900 p-1"
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

        {/* Enhanced Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-700">
                  عرض {((pagination.page - 1) * pagination.limit) + 1} إلى{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} من {pagination.total} نتيجة
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: 1 }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  الأولى
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  السابق
                </button>
                <span className="px-3 py-2 text-sm bg-blue-50 border border-blue-200 rounded-md">
                  {pagination.page} من {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  التالي
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.totalPages }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  الأخيرة
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Message Modal */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-right">
              تفاصيل الرسالة
            </DialogTitle>
            <DialogDescription className="text-right">
              عرض تفاصيل رسالة التواصل كاملة
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-6" dir="rtl">
              {/* Message Header */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">معلومات المرسل</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{selectedMessage.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:text-blue-800">
                          {selectedMessage.email}
                        </a>
                      </div>
                      {selectedMessage.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <a href={`tel:${selectedMessage.phone}`} className="text-blue-600 hover:text-blue-800">
                            {selectedMessage.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">معلومات الرسالة</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{formatDate(selectedMessage.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>الحالة:</span>
                        {getStatusBadge(selectedMessage.status)}
                      </div>
                      {selectedMessage.ipAddress && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>IP:</span>
                          <span>{selectedMessage.ipAddress}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">الموضوع</h3>
                <p className="text-lg text-gray-800 bg-gray-50 p-3 rounded-lg">
                  {selectedMessage.subject}
                </p>
              </div>

              {/* Message Content */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">محتوى الرسالة</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    updateMessageStatus(selectedMessage.id, 'REPLIED');
                    setShowMessageModal(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  وضع علامة كتم الرد
                </button>
                
                <button
                  onClick={() => {
                    updateMessageStatus(selectedMessage.id, 'ARCHIVED');
                    setShowMessageModal(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <Archive className="w-4 h-4" />
                  أرشفة
                </button>

                <a
                  href={`mailto:${selectedMessage.email}?subject=رد على: ${selectedMessage.subject}`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Reply className="w-4 h-4" />
                  رد عبر البريد
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {messages.length === 0 && !loading && (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد رسائل</h3>
          <p className="text-gray-500">لم يتم العثور على رسائل تواصل مطابقة للمرشحات المحددة.</p>
        </div>
      )}
    </div>
  );
};

export default ContactMessagesPage;
