'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Plus, Menu, ChevronRight, Globe, ExternalLink, Eye, GripVertical } from 'lucide-react';
import { useCRUD } from '@/hooks/useCRUD';

interface NavigationItem {
  id: string;
  labelAr: string;
  labelEn: string;
  url?: string;
  location: 'header' | 'footer' | 'sidebar';
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  openInNewWindow: boolean;
  icon?: string;
  children?: NavigationItem[];
  parent?: {
    id: string;
    labelAr: string;
    labelEn: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function NavigationPage() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<string>('header');
  const [state, actions] = useCRUD<NavigationItem>({
    endpoint: '/api/navigation',
    resourceName: 'Navigation Item',
  });

  const handleCreate = () => {
    router.push('/admin/navigation/create');
  };

  const handleEdit = (item: NavigationItem) => {
    router.push(`/admin/navigation/${item.id}/edit`);
  };

  // Filter items by location
  const filteredItems = (state.items ?? []).filter(item => 
    !selectedLocation || selectedLocation === 'all' || item.location === selectedLocation
  );

  // Group items by parent-child relationship
  const parentItems = filteredItems.filter(item => !item.parentId);
  const childItems = filteredItems.filter(item => item.parentId);

  const getLocationColor = (location: string) => {
    switch (location) {
      case 'header':
        return 'bg-blue-100 text-blue-800';
      case 'footer':
        return 'bg-gray-100 text-gray-800';
      case 'sidebar':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const NavigationItemCard = ({ item, level = 0 }: { item: NavigationItem; level?: number }) => (
    <Card key={item.id} className={`${level > 0 ? 'ml-8 mt-2 border-l-4 border-l-blue-200' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
              {level > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
              <Menu className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm">{item.labelEn}</h3>
                <span className="text-sm text-gray-500" dir="rtl">({item.labelAr})</span>
                {!item.isActive && <Badge variant="outline">Inactive</Badge>}
                {item.openInNewWindow && <ExternalLink className="h-3 w-3 text-gray-400" />}
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <Badge className={getLocationColor(item.location)}>
                  {item.location}
                </Badge>
                
                {item.url && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    <span className="truncate max-w-48">{item.url}</span>
                  </div>
                )}
                
                <span>Order: {item.sortOrder}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => actions.deleteItem(item.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Render child items */}
        {childItems
          .filter(child => child.parentId === item.id)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map(child => (
            <NavigationItemCard key={child.id} item={child} level={level + 1} />
          ))
        }
      </CardContent>
    </Card>
  );

  const stats = {
    total: state.items?.length ?? 0,
    header: (state.items ?? []).filter(item => item.location === 'header').length,
    footer: (state.items ?? []).filter(item => item.location === 'footer').length,
    active: (state.items ?? []).filter(item => item.isActive).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Navigation</h1>
          <p className="text-gray-600">Manage site navigation menus and links</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Menu Item
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex gap-2">
              <Button
                variant={selectedLocation === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLocation('all')}
              >
                All Locations
              </Button>
              <Button
                variant={selectedLocation === 'header' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLocation('header')}
              >
                Header ({stats.header})
              </Button>
              <Button
                variant={selectedLocation === 'footer' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLocation('footer')}
              >
                Footer ({stats.footer})
              </Button>
              <Button
                variant={selectedLocation === 'sidebar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLocation('sidebar')}
              >
                Sidebar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Active Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.header}</div>
            <p className="text-xs text-muted-foreground">Header Menu</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.footer}</div>
            <p className="text-xs text-muted-foreground">Footer Menu</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Items */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedLocation === 'all' 
              ? `All Navigation Items (${filteredItems.length})`
              : `${selectedLocation.charAt(0).toUpperCase() + selectedLocation.slice(1)} Menu (${filteredItems.length})`
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {state.loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : parentItems.length === 0 ? (
            <div className="text-center py-12">
              <Menu className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
              <p className="text-gray-600 mb-4">Create your first navigation item</p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                New Menu Item
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {parentItems
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map(item => (
                  <NavigationItemCard key={item.id} item={item} />
                ))
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
