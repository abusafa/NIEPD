'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Trash2, 
  Download,
  Copy,
  Upload,
  Image,
  File,
  Video,
  Music,
  FileText,
  Grid3X3,
  List,
  Eye,
  Edit2
} from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import { useCRUD } from '@/hooks/useCRUD';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { ConfirmationModal, useConfirmationModal } from '@/components/ui/confirmation-modal';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  alt?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MediaPage() {
  const { currentLang, t, isRTL } = useLanguage();
  const { modalState, showConfirmation, hideConfirmation, setLoading } = useConfirmationModal();
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteItem = async (item: MediaItem) => {
    showConfirmation({
      title: currentLang === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion',
      description: currentLang === 'ar' 
        ? `هل أنت متأكد من أنك تريد حذف "${item.originalName}"؟ لا يمكن التراجع عن هذا الإجراء.`
        : `Are you sure you want to delete "${item.originalName}"? This action cannot be undone.`,
      confirmText: currentLang === 'ar' ? 'حذف' : 'Delete',
      cancelText: currentLang === 'ar' ? 'إلغاء' : 'Cancel',
      variant: 'destructive',
      onConfirm: async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/media/${item.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (response.ok) {
            actions.refresh?.(); // Refresh the list
            // Don't show toast here as it's handled by the API success
          } else {
            const error = await response.json();
            toast.error(error.error || (currentLang === 'ar' ? 'فشل في حذف الملف' : 'Failed to delete file'));
          }
        } catch (error) {
          console.error('Delete error:', error);
          toast.error(currentLang === 'ar' ? 'فشل في حذف الملف' : 'Failed to delete file');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const [state, actions] = useCRUD<MediaItem>({
    endpoint: '/api/media',
    resourceName: 'Media File',
  });

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || (currentLang === 'ar' ? 'تم رفع الملفات بنجاح' : 'Files uploaded successfully'));
        actions.refresh?.(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.error || (currentLang === 'ar' ? 'فشل في رفع الملفات' : 'Failed to upload files'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(currentLang === 'ar' ? 'فشل في رفع الملفات' : 'Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(window.location.origin + item.path);
    toast.success(currentLang === 'ar' ? 'تم نسخ الرابط إلى الحافظة' : 'URL copied to clipboard');
  };

  const handleView = (item: MediaItem) => {
    window.open(item.path, '_blank');
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (mimeType.startsWith('video/')) return <Video className="h-5 w-5" />;
    if (mimeType.startsWith('audio/')) return <Music className="h-5 w-5" />;
    if (mimeType === 'application/pdf') return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return currentLang === 'ar' ? '0 بايت' : '0 Bytes';
    const k = 1024;
    const sizesEn = ['Bytes', 'KB', 'MB', 'GB'];
    const sizesAr = ['بايت', 'ك.ب', 'م.ب', 'ج.ب'];
    const sizes = currentLang === 'ar' ? sizesAr : sizesEn;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeFromMimeType = (mimeType: string) => {
    const typeMap = {
      image: { en: 'image', ar: 'صورة' },
      video: { en: 'video', ar: 'فيديو' },
      audio: { en: 'audio', ar: 'صوت' },
      document: { en: 'document', ar: 'مستند' },
      other: { en: 'other', ar: 'أخرى' }
    };
    
    let type: keyof typeof typeMap;
    if (mimeType.startsWith('image/')) type = 'image';
    else if (mimeType.startsWith('video/')) type = 'video';
    else if (mimeType.startsWith('audio/')) type = 'audio';
    else if (mimeType === 'application/pdf') type = 'document';
    else type = 'other';
    
    return currentLang === 'ar' ? typeMap[type].ar : typeMap[type].en;
  };

  const columns = [
    {
      key: 'file',
      label: currentLang === 'ar' ? 'الملف' : 'File',
      labelAr: 'الملف',
      render: (_: unknown, item: MediaItem) => (
        <div className={`flex items-center gap-3`}>
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            {item.mimeType.startsWith('image/') ? (
              <img
                src={item.path}
                alt={item.alt || item.originalName}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : (
              getFileIcon(item.mimeType)
            )}
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <div className="font-medium text-sm font-readex">{item.originalName}</div>
            <div className="text-xs text-gray-500 font-readex">
              {formatFileSize(item.size)} • {item.mimeType.split('/')[1].toUpperCase()}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      label: currentLang === 'ar' ? 'الوصف' : 'Description',
      labelAr: 'الوصف',
      render: (_: unknown, item: MediaItem) => (
        <div className={`text-sm text-gray-600 max-w-xs truncate font-readex ${isRTL ? 'text-right' : 'text-left'}`}>
          {item.description || '-'}
        </div>
      ),
    },
    {
      key: 'mimeType',
      label: currentLang === 'ar' ? 'النوع' : 'Type',
      labelAr: 'النوع',
      render: (_: unknown, item: MediaItem) => (
        <Badge variant="outline" className="text-xs font-readex">
          {getFileTypeFromMimeType(item.mimeType)}
        </Badge>
      ),
    },
    {
      key: 'size',
      label: currentLang === 'ar' ? 'الحجم' : 'Size',
      labelAr: 'الحجم',
      render: (_: unknown, item: MediaItem) => (
        <span className="text-sm font-readex">{formatFileSize(item.size)}</span>
      ),
    },
    {
      key: 'createdAt',
      label: currentLang === 'ar' ? 'تاريخ الرفع' : 'Uploaded',
      labelAr: 'تاريخ الرفع',
      render: (_: unknown, item: MediaItem) => (
        <span className="text-sm font-readex">
          {new Date(item.createdAt).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}
        </span>
      ),
    },
  ];

  const tableActions = [
    {
      label: currentLang === 'ar' ? 'عرض' : 'View',
      labelAr: 'عرض',
      icon: <Eye className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: handleView,
    },
    {
      label: currentLang === 'ar' ? 'نسخ الرابط' : 'Copy URL',
      labelAr: 'نسخ الرابط',
      icon: <Copy className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: handleCopyUrl,
    },
    {
      label: currentLang === 'ar' ? 'تحميل' : 'Download',
      labelAr: 'تحميل',
      icon: <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: handleView,
    },
    {
      label: currentLang === 'ar' ? 'حذف' : 'Delete',
      labelAr: 'حذف',
      icon: <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />,
      onClick: (item: MediaItem) => handleDeleteItem(item),
      variant: 'destructive' as const,
    },
  ];

  const filterOptions = [
    {
      key: 'mimeType',
      label: currentLang === 'ar' ? 'النوع' : 'Type',
      labelAr: 'النوع',
      options: [
        { value: 'image', label: 'Images', labelAr: 'صور' },
        { value: 'video', label: 'Videos', labelAr: 'فيديوهات' },
        { value: 'audio', label: 'Audio', labelAr: 'ملفات صوتية' },
        { value: 'document', label: 'Documents', labelAr: 'مستندات' },
        { value: 'other', label: 'Other', labelAr: 'أخرى' },
      ],
    },
  ];

  const stats = [
    {
      label: currentLang === 'ar' ? 'إجمالي الملفات' : 'Total Files',
      value: state.items?.length ?? 0,
      description: currentLang === 'ar' ? 'العدد الإجمالي' : 'Total count'
    },
    {
      label: currentLang === 'ar' ? 'الصور' : 'Images',
      value: (state.items ?? []).filter(m => m.mimeType.startsWith('image/')).length,
      description: currentLang === 'ar' ? 'ملفات الصور' : 'Image files'
    },
    {
      label: currentLang === 'ar' ? 'الفيديوهات' : 'Videos',
      value: (state.items ?? []).filter(m => m.mimeType.startsWith('video/')).length,
      description: currentLang === 'ar' ? 'ملفات الفيديو' : 'Video files'
    },
    {
      label: currentLang === 'ar' ? 'المستندات' : 'Documents',
      value: (state.items ?? []).filter(m => m.mimeType === 'application/pdf' || m.mimeType.startsWith('text/')).length,
      description: currentLang === 'ar' ? 'الملفات النصية' : 'Document files'
    },
    {
      label: currentLang === 'ar' ? 'إجمالي الحجم' : 'Total Size',
      value: formatFileSize((state.items ?? []).reduce((sum, m) => sum + m.size, 0)),
      description: currentLang === 'ar' ? 'مساحة التخزين المستخدمة' : 'Storage used'
    },
  ];

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <ConfirmationModal
        open={modalState.open}
        onOpenChange={hideConfirmation}
        title={modalState.title}
        description={modalState.description}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        onConfirm={modalState.onConfirm}
        loading={modalState.loading}
        variant={modalState.variant}
        icon={modalState.icon}
      />
      {/* Upload Area */}
      <Card className="border-2 border-[#00808A]/10">
        <CardContent className="pt-6">
          <div
            className="border-2 border-dashed border-[#00808A]/30 rounded-lg p-8 text-center hover:border-[#00808A]/50 transition-colors bg-gradient-to-br from-[#00808A]/5 to-[#00234E]/5"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="mx-auto h-12 w-12 text-[#00808A] mb-4" />
            <h3 className="text-lg font-medium text-[#00234E] mb-2 font-readex">
              {currentLang === 'ar' ? 'اسحب الملفات هنا أو انقر للرفع' : 'Drop files here or click to upload'}
            </h3>
            <p className="text-gray-600 mb-4 font-readex">
              {currentLang === 'ar' 
                ? 'يدعم ملفات JPG وPNG وPDF وMP4 والصيغ الشائعة الأخرى'
                : 'Support for JPG, PNG, PDF, MP4, and other common file formats'
              }
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-gradient-to-r from-[#00808A] to-[#006b74] hover:from-[#006b74] hover:to-[#00808A] font-readex"
            >
              {uploading 
                ? (currentLang === 'ar' ? 'جاري الرفع...' : 'Uploading...') 
                : (currentLang === 'ar' ? 'اختيار الملفات' : 'Select Files')
              }
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            />
          </div>
        </CardContent>
      </Card>

      {/* Media DataTable */}
      <DataTable
        title={t('media.title')}
        description={currentLang === 'ar' ? 'رفع وإدارة ملفات الوسائط الخاصة بك' : 'Upload and manage your media files'}
        data={state.items}
        columns={columns}
        actions={tableActions}
        loading={state.loading}
        searchPlaceholder={currentLang === 'ar' ? 'البحث في ملفات الوسائط...' : 'Search media files...'}
        emptyMessage={currentLang === 'ar' ? 'لا توجد ملفات وسائط' : 'No media files found'}
        emptyDescription={currentLang === 'ar' ? 'ارفع بعض الملفات للبدء' : 'Upload some files to get started'}
        filters={filterOptions}
        stats={stats}
        showSearch={true}
        showFilters={true}
        showStats={true}
      />
    </div>
  );
}
