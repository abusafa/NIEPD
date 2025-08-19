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
  const [state, actions] = useCRUD<MediaItem>({
    endpoint: '/api/media',
    resourceName: 'Media File',
  });
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        toast.success(data.message);
        actions.refresh?.(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to upload files');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
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
    toast.success('URL copied to clipboard');
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
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeFromMimeType = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType === 'application/pdf') return 'document';
    return 'other';
  };

  const columns = [
    {
      key: 'file',
      label: 'File',
      render: (_, item: MediaItem) => (
        <div className="flex items-center gap-3">
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
          <div>
            <div className="font-medium text-sm">{item.originalName}</div>
            <div className="text-xs text-gray-500">
              {formatFileSize(item.size)} • {item.mimeType.split('/')[1].toUpperCase()}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (description: string) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {description || '-'}
        </div>
      ),
    },
    {
      key: 'mimeType',
      label: 'Type',
      render: (mimeType: string) => (
        <Badge variant="outline" className="text-xs">
          {getFileTypeFromMimeType(mimeType)}
        </Badge>
      ),
    },
    {
      key: 'size',
      label: 'Size',
      render: (size: number) => (
        <span className="text-sm">{formatFileSize(size)}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Uploaded',
      render: (date: string) => (
        <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
      ),
    },
  ];

  const tableActions = [
    {
      label: 'View',
      icon: <Eye className="mr-2 h-4 w-4" />,
      onClick: handleView,
    },
    {
      label: 'Copy URL',
      icon: <Copy className="mr-2 h-4 w-4" />,
      onClick: handleCopyUrl,
    },
    {
      label: 'Download',
      icon: <Download className="mr-2 h-4 w-4" />,
      onClick: handleView,
    },
    {
      label: 'Delete',
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: actions.deleteItem,
      variant: 'destructive' as const,
    },
  ];

  const filterOptions = [
    {
      key: 'mimeType',
      label: 'Type',
      options: [
        { value: 'image', label: 'Images' },
        { value: 'video', label: 'Videos' },
        { value: 'audio', label: 'Audio' },
        { value: 'document', label: 'Documents' },
        { value: 'other', label: 'Other' },
      ],
    },
  ];

  const stats = [
    {
      label: 'Total Files',
      value: state.items?.length ?? 0,
    },
    {
      label: 'Images',
      value: (state.items ?? []).filter(m => m.mimeType.startsWith('image/')).length,
    },
    {
      label: 'Videos',
      value: (state.items ?? []).filter(m => m.mimeType.startsWith('video/')).length,
    },
    {
      label: 'Documents',
      value: (state.items ?? []).filter(m => m.mimeType === 'application/pdf' || m.mimeType.startsWith('text/')).length,
    },
    {
      label: 'Total Size',
      value: formatFileSize((state.items ?? []).reduce((sum, m) => sum + m.size, 0)),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardContent className="pt-6">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to upload
            </h3>
            <p className="text-gray-600 mb-4">
              Support for JPG, PNG, PDF, MP4, and other common file formats
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Select Files'}
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
        title="Media Library"
        description="Upload and manage your media files"
        data={state.items}
        columns={columns}
        actions={tableActions}
        loading={state.loading}
        searchPlaceholder="Search media files..."
        emptyMessage="No media files found"
        emptyDescription="Upload some files to get started"
        filters={filterOptions}
        stats={stats}
        showSearch={true}
        showFilters={true}
        showStats={true}
      />
    </div>
  );
}
