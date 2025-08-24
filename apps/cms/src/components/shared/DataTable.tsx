'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  MoreHorizontal,
  Filter,
  Loader2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Column<T> {
  key: keyof T | string;
  label: string;
  labelAr?: string;
  render?: (value: unknown, item: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface Action<T> {
  label: string;
  labelAr?: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive';
  show?: (item: T) => boolean;
}

interface FilterOption {
  key: string;
  label: string;
  labelAr?: string;
  options: { value: string; label: string; labelAr?: string }[];
}

interface DataTableProps<T extends { id: string }> {
  title: string;
  description?: string;
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  loading?: boolean;
  onCreate?: () => void;
  createButtonText?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  emptyDescription?: string;
  filters?: FilterOption[];
  stats?: Array<{
    label: string;
    value: string | number;
    description?: string;
  }>;
  showSearch?: boolean;
  showFilters?: boolean;
  showStats?: boolean;
}

export default function DataTable<T extends { id: string }>({
  title,
  description,
  data,
  columns,
  actions = [],
  loading = false,
  onCreate,
  createButtonText = 'Create New',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No items found',
  emptyDescription = 'Get started by creating a new item',
  filters = [],
  stats = [],
  showSearch = true,
  showFilters = true,
  showStats = true,
}: DataTableProps<T>) {
  const { currentLang, t, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  // Enhanced search function for better multilingual support
  const searchInItem = (item: T & Record<string, any>, searchTerm: string): boolean => {
    const searchLower = searchTerm.toLowerCase();
    
    // Search in title fields (both languages) - only if they exist
    if (item.titleAr && String(item.titleAr).toLowerCase().includes(searchLower)) return true;
    if (item.titleEn && String(item.titleEn).toLowerCase().includes(searchLower)) return true;
    
    // Search in summary/description fields - only if they exist
    if (item.summaryAr && String(item.summaryAr).toLowerCase().includes(searchLower)) return true;
    if (item.summaryEn && String(item.summaryEn).toLowerCase().includes(searchLower)) return true;
    
    // Search in category names - only if they exist
    if (item.category?.nameAr && String(item.category.nameAr).toLowerCase().includes(searchLower)) return true;
    if (item.category?.nameEn && String(item.category.nameEn).toLowerCase().includes(searchLower)) return true;
    
    // Search in author information - only if they exist
    if (item.author?.firstName && String(item.author.firstName).toLowerCase().includes(searchLower)) return true;
    if (item.author?.lastName && String(item.author.lastName).toLowerCase().includes(searchLower)) return true;
    if (item.author?.username && String(item.author.username).toLowerCase().includes(searchLower)) return true;
    
    // Search in status - only if it exists
    if (item.status && String(item.status).toLowerCase().includes(searchLower)) return true;
    
    // Fallback to original search logic
    const searchableColumns = columns.filter(col => col.searchable !== false);
    return searchableColumns.some(col => {
      const value = col.key === 'id' ? item.id : item[col.key as keyof T];
      return value ? String(value).toLowerCase().includes(searchLower) : false;
    });
  };

  // Filter data based on search and filters
  const filteredData = data.filter(item => {
    // Enhanced search filter
    if (searchTerm && !searchInItem(item, searchTerm)) {
      return false;
    }

    // Custom filters with enhanced logic
    for (const [filterKey, filterValue] of Object.entries(activeFilters)) {
      if (filterValue && filterValue !== 'all') {
        // Handle special cases
        if (filterKey === 'featured') {
          const itemRecord = item as Record<string, any>;
          const isFeatured = Boolean(itemRecord.featured);
          if ((filterValue === 'true' && !isFeatured) || (filterValue === 'false' && isFeatured)) {
            return false;
          }
        } else if (filterKey === 'category') {
          // Handle category filtering with nested object
          const itemRecord = item as Record<string, any>;
          const categoryValue = itemRecord.category?.nameEn?.toLowerCase() || itemRecord.category?.slug || '';
          if (!categoryValue.includes(filterValue.toLowerCase())) {
            return false;
          }
        } else {
          // Standard filtering
          const itemValue = (item as Record<string, unknown>)[filterKey];
          if (itemValue !== filterValue) {
            return false;
          }
        }
      }
    }

    return true;
  });

  const handleFilterChange = (filterKey: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const getNestedValue = (obj: Record<string, any>, path: string): any => {
    return path.split('.').reduce((current: any, key: string) => {
      return current && typeof current === 'object' ? current[key] : undefined;
    }, obj);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-12 w-12 animate-spin text-[#00808A]" />
          <p className="text-sm text-gray-600 font-readex">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex items-center justify-between`}>
        <div>
          <h1 className="text-2xl font-bold text-[#00234E] dark:text-gray-100 font-readex">{title}</h1>
          {description && <p className="text-gray-600 dark:text-gray-300 font-readex">{description}</p>}
        </div>
        {onCreate && (
          <Button onClick={onCreate} className="bg-gradient-to-r from-[#00808A] to-[#006b74] hover:from-[#006b74] hover:to-[#00808A] font-readex px-6 py-3 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-[#00808A]/20">
            <Plus className="h-5 w-5" />
            {createButtonText}
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 bg-gradient-to-r from-white to-slate-50/30 dark:from-gray-900 dark:to-gray-800/50 shadow-xl dark:shadow-gray-900/50">
          <CardContent className="pt-6">
            <div className={`flex flex-col sm:flex-row gap-4`}>
              {showSearch && (
                <div className="flex-1">
                  <div className="relative">
                    <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5`} />
                    <Input
                      placeholder={searchPlaceholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`${isRTL ? 'pr-12 text-right' : 'pl-12'} font-readex h-12 text-base rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:border-[#00808A] focus:border-[#00808A] focus:ring-2 focus:ring-[#00808A]/20 shadow-sm transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                    />
                  </div>
                </div>
              )}
              
              {showFilters && filters.length > 0 && (
                <div className={`flex flex-wrap gap-2 `}>
                  {filters.map(filter => (
                    <div key={filter.key} className="relative">
                      <select
                        value={activeFilters[filter.key] || 'all'}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                        className={`min-w-36 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-readex bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-[#00808A] focus:border-[#00808A] focus:ring-2 focus:ring-[#00808A]/20 transition-all duration-300 shadow-sm appearance-none cursor-pointer ${isRTL ? 'text-right pr-11' : 'pl-4 pr-10'}`}
                      >
                        <option value="all">
                          {currentLang === 'ar' ? `جميع ${filter.labelAr || filter.label}` : `All ${filter.label}`}
                        </option>
                        {filter.options.map(option => (
                          <option key={option.value} value={option.value}>
                            {currentLang === 'ar' ? option.labelAr || option.label : option.label}
                          </option>
                        ))}
                      </select>
                      <div className={`absolute top-1/2 transform -translate-y-1/2 pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`}>
                        <svg className="w-5 h-5 text-[#00808A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {/* Active filter indicator */}
                      {activeFilters[filter.key] && activeFilters[filter.key] !== 'all' && (
                        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-gradient-to-r from-[#00808A] to-[#006b74] rounded-full border-2 border-white shadow-md"></div>
                      )}
                    </div>
                  ))}
                  
                  {/* Clear filters button */}
                  {Object.values(activeFilters).some(value => value && value !== 'all') && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setActiveFilters({})}
                      className={`font-readex border-2 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-300 dark:hover:border-red-600 rounded-lg px-4 py-2 shadow-sm transition-all duration-300`}
                    >
                      <span className="text-lg font-bold">×</span>
                      {currentLang === 'ar' ? 'إزالة الفلاتر' : 'Clear Filters'}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {showStats && stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 hover:border-[#00808A]/20 dark:hover:border-[#00808A]/30 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/70 overflow-hidden">
              <CardContent className={`pt-6 pb-6 ${isRTL ? 'text-right' : 'text-left'} relative`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#00808A]/10 to-[#006b74]/10 dark:from-[#4db8c4]/20 dark:to-[#00808A]/20 rounded-bl-full -translate-y-6 translate-x-6"></div>
                <div className="text-3xl font-bold font-readex text-[#00808A] dark:text-[#4db8c4] mb-2 relative z-10">{stat.value}</div>
                <p className="text-sm text-[#00234E] dark:text-gray-200 font-readex font-semibold relative z-10">{stat.label}</p>
                {stat.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-readex relative z-10">{stat.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table */}
      <Card className="border-2 border-[#00808A]/10 dark:border-[#00808A]/20 overflow-hidden bg-white dark:bg-gray-900 shadow-2xl dark:shadow-gray-900/50 rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-slate-50/80 via-white to-slate-50/80 dark:from-gray-800/80 dark:via-gray-900 dark:to-gray-800/80 border-b-2 border-slate-200/30 dark:border-gray-700/30 backdrop-blur-sm pt-2">
          <CardTitle className={`font-readex text-xl font-bold text-[#00234E] dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'} flex items-center gap-4`}>
            <span className="bg-gradient-to-r from-[#00808A] to-[#006b74] bg-clip-text text-transparent">
              {title}
            </span>
            <span className="bg-gradient-to-r from-[#00808A] to-[#006b74] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              {filteredData.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <Search className="h-full w-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 font-readex">{emptyMessage}</h3>
              <p className="text-gray-600 mb-4 font-readex">{emptyDescription}</p>
              {onCreate && (
                <Button onClick={onCreate} className="bg-gradient-to-r from-[#00808A] to-[#006b74] hover:from-[#006b74] hover:to-[#00808A] font-readex px-6 py-3 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-[#00808A]/20">
                  <Plus className="h-5 w-5" />
                  {createButtonText}
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Modern Table Header */}
                  <div className={`grid grid-cols-12 gap-6 px-8 py-6 bg-gradient-to-r from-slate-50/80 via-gray-50/80 to-slate-50/80 dark:from-gray-800/80 dark:via-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm border-b-2 border-gray-200/30 dark:border-gray-700/30 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="col-span-4">
                      <span className="text-sm font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider font-readex">
                        {currentLang === 'ar' ? columns[0]?.labelAr || columns[0]?.label : columns[0]?.label}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider font-readex">
                        {currentLang === 'ar' ? columns[1]?.labelAr || columns[1]?.label : columns[1]?.label}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider font-readex">
                        {currentLang === 'ar' ? columns[2]?.labelAr || columns[2]?.label : columns[2]?.label}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <span className="text-sm font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider font-readex">
                        {currentLang === 'ar' ? columns[3]?.labelAr || columns[3]?.label : columns[3]?.label}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider font-readex">
                        {currentLang === 'ar' ? columns[4]?.labelAr || columns[4]?.label : columns[4]?.label}
                      </span>
                    </div>
                    <div className={`col-span-1 ${isRTL ? 'text-left' : 'text-right'}`}>
                      <span className="text-sm font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider font-readex">
                        {currentLang === 'ar' ? 'الإجراءات' : 'Actions'}
                      </span>
                    </div>
                  </div>

                  {/* Modern Table Body */}
                  <div className="divide-y divide-gray-100/50 dark:divide-gray-700/50 px-4">
                    {filteredData.map((item, index) => (
                      <div 
                        key={item.id} 
                        className={`group relative grid grid-cols-12 gap-6 mx-2 my-3 px-6 py-6 rounded-xl transition-all duration-500 hover:bg-gradient-to-r hover:from-[#00808A]/3 hover:via-[#00808A]/2 hover:to-[#006b74]/3 dark:hover:from-[#4db8c4]/10 dark:hover:via-[#00808A]/8 dark:hover:to-[#006b74]/10 hover:shadow-lg hover:shadow-[#00808A]/5 dark:hover:shadow-gray-900/30 ${
                          index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/30 dark:bg-gray-800/30'
                        } ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        {/* Title Column */}
                        <div className="col-span-4 flex items-center">
                          {columns[0]?.render ? 
                            columns[0].render(getNestedValue(item as Record<string, any>, columns[0].key as string), item) : 
                            <div className="font-semibold text-slate-900 dark:text-gray-100 font-readex text-base">
                              {String(getNestedValue(item as Record<string, any>, columns[0].key as string) || '')}
                            </div>
                          }
                        </div>

                        {/* Category Column */}
                        <div className="col-span-2 flex items-center">
                          {columns[1]?.render ? 
                            columns[1].render(getNestedValue(item as Record<string, any>, columns[1].key as string), item) : 
                            <div className="text-slate-600 dark:text-gray-300 font-readex">
                              {String(getNestedValue(item as Record<string, any>, columns[1].key as string) || '')}
                            </div>
                          }
                        </div>

                        {/* Author Column */}
                        <div className="col-span-2 flex items-center">
                          {columns[2]?.render ? 
                            columns[2].render(getNestedValue(item as Record<string, any>, columns[2].key as string), item) : 
                            <div className="text-slate-600 dark:text-gray-300 font-readex">
                              {String(getNestedValue(item as Record<string, any>, columns[2].key as string) || '')}
                            </div>
                          }
                        </div>

                        {/* Status Column */}
                        <div className="col-span-1 flex items-center justify-center">
                          {columns[3]?.render ? 
                            columns[3].render(getNestedValue(item as Record<string, any>, columns[3].key as string), item) : 
                            <div className="text-slate-600 dark:text-gray-300 font-readex">
                              {String(getNestedValue(item as Record<string, any>, columns[3].key as string) || '')}
                            </div>
                          }
                        </div>

                        {/* Date Column */}
                        <div className="col-span-2 flex items-center">
                          {columns[4]?.render ? 
                            columns[4].render(getNestedValue(item as Record<string, any>, columns[4].key as string), item) : 
                            <div className="text-slate-600 dark:text-gray-300 font-readex">
                              {String(getNestedValue(item as Record<string, any>, columns[4].key as string) || '')}
                            </div>
                          }
                        </div>

                        {/* Actions Column - Modern Floating Menu */}
                        <div className={`col-span-1 flex items-center ${isRTL ? 'justify-start' : 'justify-end'}`}>
                          <div className="relative">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  className="h-10 w-10 p-0 rounded-full transition-all duration-300 hover:bg-gradient-to-r hover:from-[#00808A]/20 hover:to-[#006b74]/20 hover:shadow-md hover:shadow-[#00808A]/20 group-hover:opacity-100 opacity-60 hover:scale-110"
                                  title={currentLang === 'ar' ? 'الإجراءات' : 'Actions'}
                                >
                                  <MoreHorizontal className="h-5 w-5 text-slate-600 dark:text-gray-300 group-hover:text-[#00808A] dark:group-hover:text-[#4db8c4]" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent 
                                align={isRTL ? 'start' : 'end'} 
                                className="font-readex w-64 rounded-2xl border-2 border-slate-200/50 dark:border-gray-700/50 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-2"
                              >
                                <div className="py-2 px-3 border-b border-slate-200/50 dark:border-gray-700/50 mb-2">
                                  <h4 className="text-sm font-bold text-slate-800 dark:text-gray-200">
                                    {currentLang === 'ar' ? 'الإجراءات المتاحة' : 'Available Actions'}
                                  </h4>
                                </div>
                                
                                {actions.filter(action => !action.show || action.show(item)).map((action, actionIndex) => (
                                  <DropdownMenuItem 
                                    key={actionIndex}
                                    onClick={() => action.onClick(item)}
                                    className={`group/item py-3 px-4 cursor-pointer rounded-xl transition-all duration-300 mx-0 mb-1 ${
                                      action.variant === 'destructive' 
                                        ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 hover:shadow-md hover:shadow-red-100 dark:hover:shadow-red-900/30' 
                                        : 'text-slate-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-[#00808A]/10 hover:to-[#006b74]/10 dark:hover:from-[#4db8c4]/20 dark:hover:to-[#00808A]/20 focus:bg-gradient-to-r focus:from-[#00808A]/10 focus:to-[#006b74]/10 dark:focus:from-[#4db8c4]/20 dark:focus:to-[#00808A]/20 hover:shadow-md hover:shadow-[#00808A]/10 dark:hover:shadow-gray-900/30'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`p-2 rounded-lg transition-all duration-300 ${
                                        action.variant === 'destructive' 
                                          ? 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 group-hover/item:bg-red-200 dark:group-hover/item:bg-red-900/50' 
                                          : 'bg-[#00808A]/10 dark:bg-[#4db8c4]/20 text-[#00808A] dark:text-[#4db8c4] group-hover/item:bg-[#00808A]/20 dark:group-hover/item:bg-[#4db8c4]/30'
                                      }`}>
                                        {action.icon}
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-semibold text-sm">
                                          {currentLang === 'ar' ? action.labelAr || action.label : action.label}
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                                          {action.variant === 'destructive' 
                                            ? (currentLang === 'ar' ? 'إجراء غير قابل للتراجع' : 'Permanent action')
                                            : (currentLang === 'ar' ? 'انقر للتنفيذ' : 'Click to execute')
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Hover Border Effect */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#00808A]/20 dark:group-hover:border-[#4db8c4]/30 rounded-2xl transition-all duration-500 pointer-events-none"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
