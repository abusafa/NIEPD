'use client'

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  Eye, 
  Trash2, 
  Search,
  MessageCircle,
  Archive,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  CheckSquare,
  Square,
  Reply
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

import { useToast } from '@/components/ui/toast';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

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
    const fetchMessages = async (silent = false) => {
      try {
        if (!silent) {
          setLoading(true);
        }
        // Mock data - replace with actual API call
        setTimeout(() => {
          const mockMessages: ContactMessage[] = [
            {
              id: '1',
              name: 'محمد عبدالله',
              email: 'mohammed@example.com',
              phone: '+966501234567',
              subject: 'استفسار عن البرامج التدريبية',
              message: 'أرغب في الحصول على معلومات أكثر عن البرامج التدريبية المتاحة للمعلمين.',
              status: 'UNREAD',
              priority: 'MEDIUM',
              ipAddress: '192.168.1.100',
              userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              createdAt: '2024-01-15T10:30:00Z',
              updatedAt: '2024-01-15T10:30:00Z'
            },
            // ... other mock messages
          ];
          
          setMessages(mockMessages);
          if (!silent) {
            setLoading(false);
          }
        }, silent ? 500 : 1000);
      } catch (error) {
        console.error('Error fetching messages:', error);
        if (!silent) {
          setLoading(false);
        }
      }
    };

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
      UNREAD: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', icon: Clock, label: 'غير مقروء' },
      READ: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', icon: Eye, label: 'مقروء' },
      REPLIED: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300', icon: CheckCircle, label: 'تم الرد' },
      ARCHIVED: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', icon: Archive, label: 'مؤرشف' },
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
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">رسائل التواصل</h1>
            <p className="text-gray-600 dark:text-gray-300">إدارة رسائل التواصل الواردة من الموقع</p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            {/* Auto-refresh toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                autoRefresh 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300' 
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm">تحديث تلقائي</span>
            </button>
            
            {/* Export button */}
            <button
              onClick={exportMessages}
              disabled={messages.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">تصدير</span>
            </button>
            
            {/* Manual refresh */}
            <button
              onClick={() => fetchMessages()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">تحديث</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي الرسائل</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pagination.total}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">غير مقروءة</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{getUnreadCount()}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">تم الرد عليها</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{getRepliedCount()}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">مؤرشفة</p>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{getArchivedCount()}</p>
            </div>
            <Archive className="w-8 h-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="space-y-4">
          {/* First row - Search and Status */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="البحث في الرسائل..."
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">من تاريخ</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">إلى تاريخ</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                />
              </div>
            </div>

            {/* Sort */}
            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ترتيب حسب</label>
              <select
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline transition-colors"
            >
              مسح جميع المرشحات
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedMessages.size > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-blue-800 dark:text-blue-300">
                تم تحديد {selectedMessages.size} رسالة
              </span>
              <select
                className="px-3 py-1 border border-blue-300 dark:border-blue-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                تطبيق
              </button>
            </div>
            <button
              onClick={() => setSelectedMessages(new Set())}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              إلغاء التحديد
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Messages Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <ScrollArea>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right">
                  <button
                    onClick={toggleSelectAll}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    {selectedMessages.size === messages.length && messages.length > 0 ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  المرسل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الموضوع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {messages.map((message) => (
                <tr 
                  key={message.id} 
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    message.status === 'UNREAD' ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleMessageSelection(message.id)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                      {selectedMessages.has(message.id) ? (
                        <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="mr-4">
                        <div className={`text-sm font-medium ${
                          message.status === 'UNREAD' ? 'text-gray-900 dark:text-gray-100 font-semibold' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {message.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {message.email}
                        </div>
                        {message.phone && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {message.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className={`text-sm font-medium truncate ${
                      message.status === 'UNREAD' ? 'text-gray-900 dark:text-gray-100 font-semibold' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {message.subject}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {message.message.substring(0, 100)}
                      {message.message.length > 100 && '...'}
                    </div>
                    <button
                      onClick={() => viewMessage(message)}
                      className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-1 transition-colors"
                    >
                      عرض كامل
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(message.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
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
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 transition-colors"
                        title="عرض"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {/* Status Update Dropdown */}
                      <select
                        className="text-xs border border-gray-200 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 transition-colors"
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
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Enhanced Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="flex-1 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  عرض {((pagination.page - 1) * pagination.limit) + 1} إلى{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} من {pagination.total} نتيجة
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: 1 }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-900 dark:text-gray-100 transition-colors"
                >
                  الأولى
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-900 dark:text-gray-100 transition-colors"
                >
                  السابق
                </button>
                <span className="px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md text-gray-900 dark:text-gray-100">
                  {pagination.page} من {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-900 dark:text-gray-100 transition-colors"
                >
                  التالي
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.totalPages }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-900 dark:text-gray-100 transition-colors"
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
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-right text-gray-900 dark:text-gray-100">
              تفاصيل الرسالة
            </DialogTitle>
            <DialogDescription className="text-right text-gray-600 dark:text-gray-300">
              عرض تفاصيل رسالة التواصل كاملة
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-6" dir="rtl">
              {/* Message Header */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">معلومات المرسل</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="font-medium text-gray-800 dark:text-gray-200">{selectedMessage.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                          {selectedMessage.email}
                        </a>
                      </div>
                      {selectedMessage.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <a href={`tel:${selectedMessage.phone}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                            {selectedMessage.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">معلومات الرسالة</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-800 dark:text-gray-200">{formatDate(selectedMessage.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-800 dark:text-gray-200">الحالة:</span>
                        {getStatusBadge(selectedMessage.status)}
                      </div>
                      {selectedMessage.ipAddress && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
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
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">الموضوع</h3>
                <p className="text-lg text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {selectedMessage.subject}
                </p>
              </div>

              {/* Message Content */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">محتوى الرسالة</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    updateMessageStatus(selectedMessage.id, 'REPLIED');
                    setShowMessageModal(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  وضع علامة كتم الرد
                </button>
                
                <button
                  onClick={() => {
                    updateMessageStatus(selectedMessage.id, 'ARCHIVED');
                    setShowMessageModal(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
                >
                  <Archive className="w-4 h-4" />
                  أرشفة
                </button>

                <a
                  href={`mailto:${selectedMessage.email}?subject=رد على: ${selectedMessage.subject}`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  رد عبر البريد
                </a>
              </div>
            </div>
          )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {messages.length === 0 && !loading && (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">لا توجد رسائل</h3>
          <p className="text-gray-500 dark:text-gray-400">لم يتم العثور على رسائل تواصل مطابقة للمرشحات المحددة.</p>
        </div>
      )}
    </div>
  );
};

export default ContactMessagesPage;
