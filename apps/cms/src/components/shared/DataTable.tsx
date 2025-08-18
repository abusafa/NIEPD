'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
}

interface Action<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive';
  show?: (item: T) => boolean;
}

interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  // Filter data based on search and filters
  const filteredData = data.filter(item => {
    // Search filter
    if (searchTerm) {
      const searchableColumns = columns.filter(col => col.searchable !== false);
      const matchesSearch = searchableColumns.some(col => {
        const value = col.key === 'id' ? item.id : (item as any)[col.key];
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
      if (!matchesSearch) return false;
    }

    // Custom filters
    for (const [filterKey, filterValue] of Object.entries(activeFilters)) {
      if (filterValue && filterValue !== 'all') {
        const itemValue = (item as any)[filterKey];
        if (itemValue !== filterValue) return false;
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

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && <p className="text-gray-600">{description}</p>}
        </div>
        {onCreate && (
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            {createButtonText}
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {showSearch && (
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder={searchPlaceholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
              
              {showFilters && filters.length > 0 && (
                <div className="flex gap-2">
                  {filters.map(filter => (
                    <select
                      key={filter.key}
                      value={activeFilters[filter.key] || 'all'}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="all">All {filter.label}</option>
                      {filter.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ))}
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {showStats && stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                {stat.description && (
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>{title} ({filteredData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <Search className="h-full w-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
              <p className="text-gray-600 mb-4">{emptyDescription}</p>
              {onCreate && (
                <Button onClick={onCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  {createButtonText}
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableHead key={index}>
                        {column.label}
                      </TableHead>
                    ))}
                    {actions.length > 0 && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      {columns.map((column, colIndex) => (
                        <TableCell key={colIndex}>
                          {column.render ? 
                            column.render(getNestedValue(item, column.key as string), item) : 
                            String(getNestedValue(item, column.key as string) || '')
                          }
                        </TableCell>
                      ))}
                      {actions.length > 0 && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {actions.filter(action => !action.show || action.show(item)).map((action, actionIndex) => {
                              if (actionIndex < 2) {
                                // Show first 2 actions as buttons
                                return (
                                  <Button
                                    key={actionIndex}
                                    variant={action.variant === 'destructive' ? 'destructive' : 'outline'}
                                    size="sm"
                                    onClick={() => action.onClick(item)}
                                  >
                                    {action.icon}
                                    {action.label}
                                  </Button>
                                );
                              }
                              return null;
                            })}
                            
                            {actions.filter(action => !action.show || action.show(item)).length > 2 && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  {actions.filter(action => !action.show || action.show(item)).slice(2).map((action, actionIndex) => (
                                    <DropdownMenuItem 
                                      key={actionIndex + 2}
                                      onClick={() => action.onClick(item)}
                                      className={action.variant === 'destructive' ? 'text-red-600' : ''}
                                    >
                                      {action.icon}
                                      {action.label}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
