'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Settings, Globe, Mail, Phone, MapPin, Image, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsData {
  // General
  'site.name.ar': string;
  'site.name.en': string;
  'site.description.ar': string;
  'site.description.en': string;
  'site.keywords.ar': string;
  'site.keywords.en': string;
  
  // Contact
  'contact.email': string;
  'contact.phone': string;
  'contact.address.ar': string;
  'contact.address.en': string;
  'contact.fax': string;
  
  // Social Media
  'social.twitter': string;
  'social.linkedin': string;
  'social.facebook': string;
  'social.instagram': string;
  'social.youtube': string;
  
  // Branding
  'branding.logo': string;
  'branding.favicon': string;
  'branding.colors.primary': string;
  'branding.colors.secondary': string;
  
  // SEO
  'seo.default_meta_title.ar': string;
  'seo.default_meta_title.en': string;
  'seo.default_meta_description.ar': string;
  'seo.default_meta_description.en': string;
  
  // Features
  'features.news_enabled': string;
  'features.programs_enabled': string;
  'features.events_enabled': string;
  'features.partners_enabled': string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    // General
    'site.name.ar': '',
    'site.name.en': '',
    'site.description.ar': '',
    'site.description.en': '',
    'site.keywords.ar': '',
    'site.keywords.en': '',
    
    // Contact
    'contact.email': '',
    'contact.phone': '',
    'contact.address.ar': '',
    'contact.address.en': '',
    'contact.fax': '',
    
    // Social Media
    'social.twitter': '',
    'social.linkedin': '',
    'social.facebook': '',
    'social.instagram': '',
    'social.youtube': '',
    
    // Branding
    'branding.logo': '',
    'branding.favicon': '',
    'branding.colors.primary': '#1e40af',
    'branding.colors.secondary': '#64748b',
    
    // SEO
    'seo.default_meta_title.ar': '',
    'seo.default_meta_title.en': '',
    'seo.default_meta_description.ar': '',
    'seo.default_meta_description.en': '',
    
    // Features
    'features.news_enabled': 'true',
    'features.programs_enabled': 'true',
    'features.events_enabled': 'true',
    'features.partners_enabled': 'true',
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/site-settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Merge fetched settings with defaults
        const mergedSettings = { ...settings };
        Object.keys(data.settings).forEach(key => {
          if (key in mergedSettings) {
            mergedSettings[key as keyof SettingsData] = data.settings[key].value;
          }
        });
        setSettings(mergedSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: keyof SettingsData, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        toast.success('Settings saved successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-gray-600">Configure your website settings and preferences</p>
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

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="site.name.en">Site Name (English)</Label>
                  <Input
                    id="site.name.en"
                    value={settings['site.name.en']}
                    onChange={(e) => handleInputChange('site.name.en', e.target.value)}
                    placeholder="National Institute for Educational Professional Development"
                  />
                </div>
                <div>
                  <Label htmlFor="site.name.ar">Site Name (Arabic)</Label>
                  <Input
                    id="site.name.ar"
                    value={settings['site.name.ar']}
                    onChange={(e) => handleInputChange('site.name.ar', e.target.value)}
                    placeholder="المعهد الوطني للتطوير المهني التعليمي"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="site.description.en">Description (English)</Label>
                  <Textarea
                    id="site.description.en"
                    value={settings['site.description.en']}
                    onChange={(e) => handleInputChange('site.description.en', e.target.value)}
                    placeholder="Brief description of your organization"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="site.description.ar">Description (Arabic)</Label>
                  <Textarea
                    id="site.description.ar"
                    value={settings['site.description.ar']}
                    onChange={(e) => handleInputChange('site.description.ar', e.target.value)}
                    placeholder="وصف مختصر للمؤسسة"
                    rows={3}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="site.keywords.en">Keywords (English)</Label>
                  <Input
                    id="site.keywords.en"
                    value={settings['site.keywords.en']}
                    onChange={(e) => handleInputChange('site.keywords.en', e.target.value)}
                    placeholder="education, professional development, training"
                  />
                </div>
                <div>
                  <Label htmlFor="site.keywords.ar">Keywords (Arabic)</Label>
                  <Input
                    id="site.keywords.ar"
                    value={settings['site.keywords.ar']}
                    onChange={(e) => handleInputChange('site.keywords.ar', e.target.value)}
                    placeholder="تعليم، تطوير مهني، تدريب"
                    dir="rtl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contact.email">Email Address</Label>
                  <Input
                    id="contact.email"
                    type="email"
                    value={settings['contact.email']}
                    onChange={(e) => handleInputChange('contact.email', e.target.value)}
                    placeholder="info@niepd.sa"
                  />
                </div>
                <div>
                  <Label htmlFor="contact.phone">Phone Number</Label>
                  <Input
                    id="contact.phone"
                    value={settings['contact.phone']}
                    onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                    placeholder="+966 11 123 4567"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contact.fax">Fax Number</Label>
                <Input
                  id="contact.fax"
                  value={settings['contact.fax']}
                  onChange={(e) => handleInputChange('contact.fax', e.target.value)}
                  placeholder="+966 11 123 4568"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contact.address.en">Address (English)</Label>
                  <Textarea
                    id="contact.address.en"
                    value={settings['contact.address.en']}
                    onChange={(e) => handleInputChange('contact.address.en', e.target.value)}
                    placeholder="Street address, city, postal code"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="contact.address.ar">Address (Arabic)</Label>
                  <Textarea
                    id="contact.address.ar"
                    value={settings['contact.address.ar']}
                    onChange={(e) => handleInputChange('contact.address.ar', e.target.value)}
                    placeholder="العنوان، المدينة، الرمز البريدي"
                    rows={3}
                    dir="rtl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'social.twitter', label: 'Twitter', placeholder: 'https://twitter.com/niepd' },
                { key: 'social.linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/niepd' },
                { key: 'social.facebook', label: 'Facebook', placeholder: 'https://facebook.com/niepd' },
                { key: 'social.instagram', label: 'Instagram', placeholder: 'https://instagram.com/niepd' },
                { key: 'social.youtube', label: 'YouTube', placeholder: 'https://youtube.com/c/niepd' },
              ].map(social => (
                <div key={social.key}>
                  <Label htmlFor={social.key}>{social.label}</Label>
                  <Input
                    id={social.key}
                    type="url"
                    value={settings[social.key as keyof SettingsData]}
                    onChange={(e) => handleInputChange(social.key as keyof SettingsData, e.target.value)}
                    placeholder={social.placeholder}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Branding & Design
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="branding.logo">Logo URL</Label>
                  <Input
                    id="branding.logo"
                    type="url"
                    value={settings['branding.logo']}
                    onChange={(e) => handleInputChange('branding.logo', e.target.value)}
                    placeholder="/logos/logo.png"
                  />
                </div>
                <div>
                  <Label htmlFor="branding.favicon">Favicon URL</Label>
                  <Input
                    id="branding.favicon"
                    type="url"
                    value={settings['branding.favicon']}
                    onChange={(e) => handleInputChange('branding.favicon', e.target.value)}
                    placeholder="/favicon.ico"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="branding.colors.primary">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="branding.colors.primary"
                      type="color"
                      value={settings['branding.colors.primary']}
                      onChange={(e) => handleInputChange('branding.colors.primary', e.target.value)}
                      className="w-16"
                    />
                    <Input
                      value={settings['branding.colors.primary']}
                      onChange={(e) => handleInputChange('branding.colors.primary', e.target.value)}
                      placeholder="#1e40af"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="branding.colors.secondary">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="branding.colors.secondary"
                      type="color"
                      value={settings['branding.colors.secondary']}
                      onChange={(e) => handleInputChange('branding.colors.secondary', e.target.value)}
                      className="w-16"
                    />
                    <Input
                      value={settings['branding.colors.secondary']}
                      onChange={(e) => handleInputChange('branding.colors.secondary', e.target.value)}
                      placeholder="#64748b"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Meta Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="seo.default_meta_title.en">Default Meta Title (English)</Label>
                  <Input
                    id="seo.default_meta_title.en"
                    value={settings['seo.default_meta_title.en']}
                    onChange={(e) => handleInputChange('seo.default_meta_title.en', e.target.value)}
                    placeholder="NIEPD - National Institute for Educational Professional Development"
                  />
                </div>
                <div>
                  <Label htmlFor="seo.default_meta_title.ar">Default Meta Title (Arabic)</Label>
                  <Input
                    id="seo.default_meta_title.ar"
                    value={settings['seo.default_meta_title.ar']}
                    onChange={(e) => handleInputChange('seo.default_meta_title.ar', e.target.value)}
                    placeholder="المعهد الوطني للتطوير المهني التعليمي"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="seo.default_meta_description.en">Default Meta Description (English)</Label>
                  <Textarea
                    id="seo.default_meta_description.en"
                    value={settings['seo.default_meta_description.en']}
                    onChange={(e) => handleInputChange('seo.default_meta_description.en', e.target.value)}
                    placeholder="Professional development and training for educators"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="seo.default_meta_description.ar">Default Meta Description (Arabic)</Label>
                  <Textarea
                    id="seo.default_meta_description.ar"
                    value={settings['seo.default_meta_description.ar']}
                    onChange={(e) => handleInputChange('seo.default_meta_description.ar', e.target.value)}
                    placeholder="التطوير المهني والتدريب للمعلمين"
                    rows={3}
                    dir="rtl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
