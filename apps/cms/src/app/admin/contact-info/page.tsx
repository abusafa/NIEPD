'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Plus, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  Globe,
  Clock,
  Printer,
  Loader2,
  GripVertical
} from 'lucide-react';
import { toast } from 'sonner';

interface ContactInfoItem {
  id?: string;
  type: 'PHONE' | 'EMAIL' | 'ADDRESS' | 'HOURS' | 'FAX' | 'WEBSITE' | 'SOCIAL';
  labelAr: string;
  labelEn: string;
  valueAr: string;
  valueEn: string;
  icon?: string;
  link?: string;
  sortOrder: number;
  isPublic: boolean;
  isNew?: boolean;
}

const contactTypes = [
  { value: 'PHONE', label: 'Phone', icon: Phone },
  { value: 'EMAIL', label: 'Email', icon: Mail },
  { value: 'ADDRESS', label: 'Address', icon: MapPin },
  { value: 'HOURS', label: 'Business Hours', icon: Clock },
  { value: 'FAX', label: 'Fax', icon: Printer },
  { value: 'WEBSITE', label: 'Website', icon: Globe },
];

const iconOptions = [
  { value: 'phone', label: 'Phone' },
  { value: 'mail', label: 'Email' },
  { value: 'map-pin', label: 'Location' },
  { value: 'clock', label: 'Clock' },
  { value: 'fax', label: 'Fax' },
  { value: 'globe', label: 'Website' },
];

export default function ContactInfoPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/contact-info', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContactInfo(data.contactInfo.map((item: ContactInfoItem) => ({
          ...item,
          sortOrder: item.sortOrder || 0,
        })));
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
      toast.error('Failed to load contact information');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (type: ContactInfoItem['type']) => {
    const newItem: ContactInfoItem = {
      type,
      labelAr: '',
      labelEn: '',
      valueAr: '',
      valueEn: '',
      sortOrder: contactInfo.length,
      isPublic: true,
      isNew: true,
    };
    setContactInfo(prev => [...prev, newItem]);
  };

  const handleUpdateItem = (index: number, field: keyof ContactInfoItem, value: any) => {
    setContactInfo(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleDeleteItem = (index: number) => {
    setContactInfo(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/contact-info', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          contactInfoItems: contactInfo.map(item => ({
            ...item,
            id: item.isNew ? undefined : item.id,
          }))
        }),
      });

      if (response.ok) {
        toast.success('Contact information saved successfully');
        fetchContactInfo(); // Refresh data
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save contact information');
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast.error('Failed to save contact information');
    } finally {
      setSaving(false);
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = contactTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.icon : Phone;
  };

  const groupedContactInfo = contactTypes.map(type => ({
    ...type,
    items: contactInfo.filter(item => item.type === type.value).sort((a, b) => a.sortOrder - b.sortOrder)
  }));

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
          <h1 className="text-2xl font-bold text-gray-900">Contact Information</h1>
          <p className="text-gray-600">Manage contact details displayed on your website</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{contactInfo.length}</div>
            <p className="text-xs text-muted-foreground">Total Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{contactInfo.filter(c => c.isPublic).length}</div>
            <p className="text-xs text-muted-foreground">Public Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{contactInfo.filter(c => c.type === 'PHONE').length}</div>
            <p className="text-xs text-muted-foreground">Phone Numbers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{contactInfo.filter(c => c.type === 'EMAIL').length}</div>
            <p className="text-xs text-muted-foreground">Email Addresses</p>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information by Type */}
      <Tabs defaultValue={contactTypes[0].value} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          {contactTypes.map(type => {
            const Icon = type.icon;
            return (
              <TabsTrigger key={type.value} value={type.value} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {type.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {contactTypes.map(type => {
          const Icon = type.icon;
          const items = contactInfo.filter(item => item.type === type.value);
          
          return (
            <TabsContent key={type.value} value={type.value}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {type.label} ({items.length})
                    </CardTitle>
                    <Button size="sm" onClick={() => handleAddItem(type.value)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add {type.label}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {items.length === 0 ? (
                    <div className="text-center py-8">
                      <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No {type.label.toLowerCase()} information</h3>
                      <p className="text-gray-600 mb-4">Add your first {type.label.toLowerCase()} entry</p>
                      <Button onClick={() => handleAddItem(type.value)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add {type.label}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {items.map((item, index) => {
                        const itemIndex = contactInfo.findIndex(c => c === item);
                        return (
                          <Card key={itemIndex} className="border">
                            <CardContent className="pt-6">
                              <div className="flex items-start gap-4">
                                <div className="flex items-center gap-2 mt-2">
                                  <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                                  <div className="flex items-center gap-2">
                                    {item.isPublic ? (
                                      <Badge className="bg-green-100 text-green-800">Public</Badge>
                                    ) : (
                                      <Badge variant="outline">Private</Badge>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Label (English)</Label>
                                    <Input
                                      value={item.labelEn}
                                      onChange={(e) => handleUpdateItem(itemIndex, 'labelEn', e.target.value)}
                                      placeholder="e.g., Main Office"
                                    />
                                  </div>
                                  <div>
                                    <Label>Label (Arabic)</Label>
                                    <Input
                                      value={item.labelAr}
                                      onChange={(e) => handleUpdateItem(itemIndex, 'labelAr', e.target.value)}
                                      placeholder="مثال: المكتب الرئيسي"
                                      dir="rtl"
                                    />
                                  </div>
                                  <div>
                                    <Label>Value (English)</Label>
                                    {type.value === 'ADDRESS' ? (
                                      <Textarea
                                        value={item.valueEn}
                                        onChange={(e) => handleUpdateItem(itemIndex, 'valueEn', e.target.value)}
                                        placeholder="Enter address in English"
                                        rows={2}
                                      />
                                    ) : (
                                      <Input
                                        value={item.valueEn}
                                        onChange={(e) => handleUpdateItem(itemIndex, 'valueEn', e.target.value)}
                                        placeholder={type.value === 'EMAIL' ? 'email@example.com' : 'Enter value'}
                                        type={type.value === 'EMAIL' ? 'email' : type.value === 'WEBSITE' ? 'url' : 'text'}
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <Label>Value (Arabic)</Label>
                                    {type.value === 'ADDRESS' ? (
                                      <Textarea
                                        value={item.valueAr}
                                        onChange={(e) => handleUpdateItem(itemIndex, 'valueAr', e.target.value)}
                                        placeholder="أدخل العنوان بالعربية"
                                        rows={2}
                                        dir="rtl"
                                      />
                                    ) : (
                                      <Input
                                        value={item.valueAr}
                                        onChange={(e) => handleUpdateItem(itemIndex, 'valueAr', e.target.value)}
                                        placeholder="أدخل القيمة"
                                        dir="rtl"
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <Label>Icon</Label>
                                    <Select 
                                      value={item.icon || ''} 
                                      onValueChange={(value) => handleUpdateItem(itemIndex, 'icon', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select icon" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="">No icon</SelectItem>
                                        {iconOptions.map(icon => (
                                          <SelectItem key={icon.value} value={icon.value}>
                                            {icon.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>Link (Optional)</Label>
                                    <Input
                                      value={item.link || ''}
                                      onChange={(e) => handleUpdateItem(itemIndex, 'link', e.target.value)}
                                      placeholder="https://..."
                                      type="url"
                                    />
                                  </div>
                                  <div>
                                    <Label>Visibility</Label>
                                    <Select 
                                      value={item.isPublic ? 'public' : 'private'} 
                                      onValueChange={(value) => handleUpdateItem(itemIndex, 'isPublic', value === 'public')}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="public">Public (visible to visitors)</SelectItem>
                                        <SelectItem value="private">Private (admin only)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>Sort Order</Label>
                                    <Input
                                      type="number"
                                      value={item.sortOrder}
                                      onChange={(e) => handleUpdateItem(itemIndex, 'sortOrder', parseInt(e.target.value) || 0)}
                                      placeholder="0"
                                    />
                                  </div>
                                </div>
                                
                                <div className="mt-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleDeleteItem(itemIndex)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
