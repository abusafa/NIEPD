'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Settings, Globe, Mail, Phone, MapPin, Image, Loader2, Palette, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { currentLang, t, isRTL } = useLanguage();
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
            // Use valueEn if available, fallback to valueAr or empty string
            const value = data.settings[key].valueEn || data.settings[key].valueAr || '';
            mergedSettings[key as keyof SettingsData] = value;
          }
        });
        setSettings(mergedSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error(t('messages.error'));
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
    
    // Validate required fields
    const requiredFields = ['site.name.ar', 'site.name.en', 'contact.email'];
    const missingFields = requiredFields.filter(field => !settings[field as keyof SettingsData]?.trim());
    
    if (missingFields.length > 0) {
      toast.error(currentLang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      setSaving(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (settings['contact.email'] && !emailRegex.test(settings['contact.email'])) {
      toast.error(currentLang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address');
      setSaving(false);
      return;
    }

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
        toast.success(currentLang === 'ar' ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully');
        // Refresh the data to ensure consistency
        await fetchSettings();
      } else {
        const error = await response.json();
        toast.error(error.error || (currentLang === 'ar' ? 'فشل في حفظ الإعدادات' : 'Failed to save settings'));
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(currentLang === 'ar' ? 'حدث خطأ أثناء حفظ الإعدادات' : 'An error occurred while saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <Loader2 className="h-12 w-12 animate-spin text-[#00808A]" />
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-gray-900 dark:text-white font-readex">
              {currentLang === 'ar' ? 'جاري تحميل الإعدادات...' : 'Loading Settings...'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-readex">
              {currentLang === 'ar' ? 'يرجى الانتظار' : 'Please wait'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#00808A] to-[#006b74] rounded-lg flex items-center justify-center">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#00234E] dark:text-white font-readex">
                    {currentLang === 'ar' ? 'إعدادات الموقع' : 'Site Settings'}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-readex">
                    {currentLang === 'ar' ? 'تكوين إعدادات الموقع والتفضيلات' : 'Configure your website settings and preferences'}
                  </p>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={saving} 
              size="lg"
              className="bg-gradient-to-r from-[#00808A] to-[#006b74] hover:from-[#006b74] hover:to-[#00808A] text-white font-readex shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {saving ? (
                <Loader2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
              ) : (
                <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              )}
              {saving ? (currentLang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (currentLang === 'ar' ? 'حفظ الإعدادات' : 'Save Settings')}
            </Button>
          </div>
        </div>

        {/* Settings Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              title: currentLang === 'ar' ? 'إعدادات عامة' : 'General Settings',
              value: Object.values(settings).filter(val => val.toString().length > 0).length,
              total: Object.keys(settings).length,
              icon: Settings,
              color: 'bg-blue-500'
            },
            {
              title: currentLang === 'ar' ? 'معلومات التواصل' : 'Contact Info',
              value: [settings['contact.email'], settings['contact.phone'], settings['contact.address.ar'], settings['contact.address.en']].filter(val => val.length > 0).length,
              total: 4,
              icon: Phone,
              color: 'bg-green-500'
            },
            {
              title: currentLang === 'ar' ? 'وسائل التواصل' : 'Social Media',
              value: [settings['social.twitter'], settings['social.linkedin'], settings['social.facebook'], settings['social.instagram'], settings['social.youtube']].filter(val => val.length > 0).length,
              total: 5,
              icon: Globe,
              color: 'bg-purple-500'
            },
            {
              title: currentLang === 'ar' ? 'العلامة التجارية' : 'Branding',
              value: [settings['branding.logo'], settings['branding.favicon'], settings['branding.colors.primary'], settings['branding.colors.secondary']].filter(val => val.length > 0).length,
              total: 4,
              icon: Palette,
              color: 'bg-orange-500'
            }
          ].map((stat, index) => {
            const Icon = stat.icon;
            const percentage = Math.round((stat.value / stat.total) * 100);
            return (
              <Card key={index} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-readex">
                        {stat.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white font-readex">
                          {stat.value}/{stat.total}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          percentage >= 75 ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                          percentage >= 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        } font-readex`}>
                          {percentage}%
                        </span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2">
            <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <TabsTrigger 
                value="general" 
                className="font-readex data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-[#00234E] dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                {currentLang === 'ar' ? 'عام' : 'General'}
              </TabsTrigger>
              <TabsTrigger 
                value="contact" 
                className="font-readex data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-[#00234E] dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                {currentLang === 'ar' ? 'التواصل' : 'Contact'}
              </TabsTrigger>
              <TabsTrigger 
                value="social" 
                className="font-readex data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-[#00234E] dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                {currentLang === 'ar' ? 'وسائل التواصل' : 'Social'}
              </TabsTrigger>
              <TabsTrigger 
                value="branding" 
                className="font-readex data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-[#00234E] dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                {currentLang === 'ar' ? 'العلامة التجارية' : 'Branding'}
              </TabsTrigger>
              <TabsTrigger 
                value="seo" 
                className="font-readex data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-[#00234E] dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                SEO
              </TabsTrigger>
            </TabsList>
          </div>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-0">
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className={`flex items-center gap-3 font-readex text-lg`}>
                  <div className="w-8 h-8 bg-gradient-to-r from-[#00808A] to-[#006b74] rounded-lg flex items-center justify-center">
                    <Settings className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-[#00234E] dark:text-white">
                    {currentLang === 'ar' ? 'الإعدادات العامة' : 'General Settings'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="site.name.en" className="text-sm font-medium text-gray-700 dark:text-gray-300 font-readex">
                    {currentLang === 'ar' ? 'اسم الموقع (إنجليزي)' : 'Site Name (English)'}
                  </Label>
                  <Input
                    id="site.name.en"
                    value={settings['site.name.en']}
                    onChange={(e) => handleInputChange('site.name.en', e.target.value)}
                    placeholder="National Institute for Educational Professional Development"
                    className="font-readex border-gray-300 dark:border-gray-600 focus:border-[#00808A] focus:ring-[#00808A] bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site.name.ar" className="text-sm font-medium text-gray-700 dark:text-gray-300 font-readex">
                    {currentLang === 'ar' ? 'اسم الموقع (عربي)' : 'Site Name (Arabic)'}
                  </Label>
                  <Input
                    id="site.name.ar"
                    value={settings['site.name.ar']}
                    onChange={(e) => handleInputChange('site.name.ar', e.target.value)}
                    placeholder="المعهد الوطني للتطوير المهني التعليمي"
                    dir="rtl"
                    className="font-readex text-right border-gray-300 dark:border-gray-600 focus:border-[#00808A] focus:ring-[#00808A] bg-white dark:bg-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="site.description.en" className="font-readex">{currentLang === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
                  <Textarea
                    id="site.description.en"
                    value={settings['site.description.en']}
                    onChange={(e) => handleInputChange('site.description.en', e.target.value)}
                    placeholder="Brief description of your organization"
                    rows={3}
                    className="font-readex"
                  />
                </div>
                <div>
                  <Label htmlFor="site.description.ar" className="font-readex">{currentLang === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
                  <Textarea
                    id="site.description.ar"
                    value={settings['site.description.ar']}
                    onChange={(e) => handleInputChange('site.description.ar', e.target.value)}
                    placeholder="وصف مختصر للمؤسسة"
                    rows={3}
                    dir="rtl"
                    className="font-readex text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="site.keywords.en" className="font-readex">{currentLang === 'ar' ? 'الكلمات المفتاحية (إنجليزي)' : 'Keywords (English)'}</Label>
                  <Input
                    id="site.keywords.en"
                    value={settings['site.keywords.en']}
                    onChange={(e) => handleInputChange('site.keywords.en', e.target.value)}
                    placeholder="education, professional development, training"
                    className="font-readex"
                  />
                </div>
                <div>
                  <Label htmlFor="site.keywords.ar" className="font-readex">{currentLang === 'ar' ? 'الكلمات المفتاحية (عربي)' : 'Keywords (Arabic)'}</Label>
                  <Input
                    id="site.keywords.ar"
                    value={settings['site.keywords.ar']}
                    onChange={(e) => handleInputChange('site.keywords.ar', e.target.value)}
                    placeholder="تعليم، تطوير مهني، تدريب"
                    dir="rtl"
                    className="font-readex text-right"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

          {/* Contact Settings */}
          <TabsContent value="contact" className="space-y-0">
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className={`flex items-center gap-3 font-readex text-lg`}>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-[#00234E] dark:text-white">
                    {currentLang === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contact.email" className="font-readex">{currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</Label>
                  <Input
                    id="contact.email"
                    type="email"
                    value={settings['contact.email']}
                    onChange={(e) => handleInputChange('contact.email', e.target.value)}
                    placeholder="info@niepd.sa"
                    className="font-readex"
                  />
                </div>
                <div>
                  <Label htmlFor="contact.phone" className="font-readex">{currentLang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</Label>
                  <Input
                    id="contact.phone"
                    value={settings['contact.phone']}
                    onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                    placeholder="+966 11 123 4567"
                    className="font-readex"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contact.fax" className="font-readex">{currentLang === 'ar' ? 'رقم الفاكس' : 'Fax Number'}</Label>
                <Input
                  id="contact.fax"
                  value={settings['contact.fax']}
                  onChange={(e) => handleInputChange('contact.fax', e.target.value)}
                  placeholder="+966 11 123 4568"
                  className="font-readex"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contact.address.en" className="font-readex">{currentLang === 'ar' ? 'العنوان (إنجليزي)' : 'Address (English)'}</Label>
                  <Textarea
                    id="contact.address.en"
                    value={settings['contact.address.en']}
                    onChange={(e) => handleInputChange('contact.address.en', e.target.value)}
                    placeholder="Street address, city, postal code"
                    rows={3}
                    className="font-readex"
                  />
                </div>
                <div>
                  <Label htmlFor="contact.address.ar" className="font-readex">{currentLang === 'ar' ? 'العنوان (عربي)' : 'Address (Arabic)'}</Label>
                  <Textarea
                    id="contact.address.ar"
                    value={settings['contact.address.ar']}
                    onChange={(e) => handleInputChange('contact.address.ar', e.target.value)}
                    placeholder="العنوان، المدينة، الرمز البريدي"
                    rows={3}
                    dir="rtl"
                    className="font-readex text-right"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

          {/* Social Media */}
          <TabsContent value="social" className="space-y-0">
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className={`flex items-center gap-3 font-readex text-lg`}>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-[#00234E] dark:text-white">
                    {currentLang === 'ar' ? 'روابط وسائل التواصل الاجتماعي' : 'Social Media Links'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
              {[
                { key: 'social.twitter', label: 'Twitter', labelAr: 'تويتر', placeholder: 'https://twitter.com/niepd' },
                { key: 'social.linkedin', label: 'LinkedIn', labelAr: 'لينكد إن', placeholder: 'https://linkedin.com/company/niepd' },
                { key: 'social.facebook', label: 'Facebook', labelAr: 'فيسبوك', placeholder: 'https://facebook.com/niepd' },
                { key: 'social.instagram', label: 'Instagram', labelAr: 'إنستغرام', placeholder: 'https://instagram.com/niepd' },
                { key: 'social.youtube', label: 'YouTube', labelAr: 'يوتيوب', placeholder: 'https://youtube.com/c/niepd' },
              ].map(social => (
                <div key={social.key}>
                  <Label htmlFor={social.key} className="font-readex">{currentLang === 'ar' ? social.labelAr : social.label}</Label>
                  <Input
                    id={social.key}
                    type="url"
                    value={settings[social.key as keyof SettingsData]}
                    onChange={(e) => handleInputChange(social.key as keyof SettingsData, e.target.value)}
                    placeholder={social.placeholder}
                    className="font-readex"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

          {/* Branding */}
          <TabsContent value="branding" className="space-y-0">
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className={`flex items-center gap-3 font-readex text-lg`}>
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Palette className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-[#00234E] dark:text-white">
                    {currentLang === 'ar' ? 'العلامة التجارية والتصميم' : 'Branding & Design'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="branding.logo" className="font-readex">{currentLang === 'ar' ? 'رابط الشعار' : 'Logo URL'}</Label>
                  <Input
                    id="branding.logo"
                    type="url"
                    value={settings['branding.logo']}
                    onChange={(e) => handleInputChange('branding.logo', e.target.value)}
                    placeholder="/logos/logo.png"
                    className="font-readex"
                  />
                </div>
                <div>
                  <Label htmlFor="branding.favicon" className="font-readex">{currentLang === 'ar' ? 'رابط الأيقونة المفضلة' : 'Favicon URL'}</Label>
                  <Input
                    id="branding.favicon"
                    type="url"
                    value={settings['branding.favicon']}
                    onChange={(e) => handleInputChange('branding.favicon', e.target.value)}
                    placeholder="/favicon.ico"
                    className="font-readex"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="branding.colors.primary" className="font-readex">{currentLang === 'ar' ? 'اللون الأساسي' : 'Primary Color'}</Label>
                  <div className={`flex gap-2`}>
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
                      placeholder="#00808A"
                      className="font-readex"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="branding.colors.secondary" className="font-readex">{currentLang === 'ar' ? 'اللون الثانوي' : 'Secondary Color'}</Label>
                  <div className={`flex gap-2`}>
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
                      placeholder="#00234E"
                      className="font-readex"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

          {/* SEO */}
          <TabsContent value="seo" className="space-y-0">
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className={`flex items-center gap-3 font-readex text-lg`}>
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Search className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-[#00234E] dark:text-white">
                    {currentLang === 'ar' ? 'تحسين محركات البحث والعلامات الوصفية' : 'SEO & Meta Tags'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="seo.default_meta_title.en" className="font-readex">{currentLang === 'ar' ? 'العنوان الافتراضي (إنجليزي)' : 'Default Meta Title (English)'}</Label>
                  <Input
                    id="seo.default_meta_title.en"
                    value={settings['seo.default_meta_title.en']}
                    onChange={(e) => handleInputChange('seo.default_meta_title.en', e.target.value)}
                    placeholder="NIEPD - National Institute for Educational Professional Development"
                    className="font-readex"
                  />
                </div>
                <div>
                  <Label htmlFor="seo.default_meta_title.ar" className="font-readex">{currentLang === 'ar' ? 'العنوان الافتراضي (عربي)' : 'Default Meta Title (Arabic)'}</Label>
                  <Input
                    id="seo.default_meta_title.ar"
                    value={settings['seo.default_meta_title.ar']}
                    onChange={(e) => handleInputChange('seo.default_meta_title.ar', e.target.value)}
                    placeholder="المعهد الوطني للتطوير المهني التعليمي"
                    dir="rtl"
                    className="font-readex text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="seo.default_meta_description.en" className="font-readex">{currentLang === 'ar' ? 'الوصف الافتراضي (إنجليزي)' : 'Default Meta Description (English)'}</Label>
                  <Textarea
                    id="seo.default_meta_description.en"
                    value={settings['seo.default_meta_description.en']}
                    onChange={(e) => handleInputChange('seo.default_meta_description.en', e.target.value)}
                    placeholder="Professional development and training for educators"
                    rows={3}
                    className="font-readex"
                  />
                </div>
                <div>
                  <Label htmlFor="seo.default_meta_description.ar" className="font-readex">{currentLang === 'ar' ? 'الوصف الافتراضي (عربي)' : 'Default Meta Description (Arabic)'}</Label>
                  <Textarea
                    id="seo.default_meta_description.ar"
                    value={settings['seo.default_meta_description.ar']}
                    onChange={(e) => handleInputChange('seo.default_meta_description.ar', e.target.value)}
                    placeholder="التطوير المهني والتدريب للمعلمين"
                    rows={3}
                    dir="rtl"
                    className="font-readex text-right"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
