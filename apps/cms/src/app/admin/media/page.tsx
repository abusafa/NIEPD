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
  Filter,
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
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, [typeFilter]);

  const fetchMedia = async () => {
    try {
      const params = new URLSearchParams();
      if (typeFilter !== 'all') params.set('type', typeFilter);
      
      const response = await fetch(`/api/media?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMedia(data.media);
      } else {
        // Fallback to mock data
        const mockMedia: MediaItem[] = [
        {
          id: '1',
          filename: 'conference-2024.jpg',
          originalName: 'NIEPD Conference 2024.jpg',
          mimeType: 'image/jpeg',
          size: 2048576, // 2MB
          path: '/uploads/media/conference-2024.jpg',
          alt: 'NIEPD Conference 2024',
          description: 'Annual NIEPD professional development conference',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          filename: 'training-materials.pdf',
          originalName: 'Teacher Training Materials.pdf',
          mimeType: 'application/pdf',
          size: 5242880, // 5MB
          path: '/uploads/media/training-materials.pdf',
          description: 'Comprehensive training materials for teachers',
          createdAt: '2024-01-14T15:20:00Z',
          updatedAt: '2024-01-14T15:20:00Z',
        },
        {
          id: '3',
          filename: 'workshop-video.mp4',
          originalName: 'Digital Learning Workshop.mp4',
          mimeType: 'video/mp4',
          size: 104857600, // 100MB
          path: '/uploads/media/workshop-video.mp4',
          alt: 'Digital Learning Workshop Video',
          description: 'Workshop on digital learning strategies',
          createdAt: '2024-01-12T09:15:00Z',
          updatedAt: '2024-01-12T09:15:00Z',
        },
        {
          id: '4',
          filename: 'logo-niepd.png',
          originalName: 'NIEPD Logo.png',
          mimeType: 'image/png',
          size: 512000, // 512KB
          path: '/uploads/media/logo-niepd.png',
          alt: 'NIEPD Official Logo',
          description: 'Official NIEPD logo for use in publications',
          createdAt: '2024-01-10T14:30:00Z',
          updatedAt: '2024-01-10T14:30:00Z',
        }
              ];
        setMedia(mockMedia);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
      // Use empty array as fallback
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

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
        setMedia(prev => [...data.files, ...prev]);
        toast.success(data.message);
        fetchMedia(); // Refresh the list
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setMedia(prev => prev.filter(item => item.id !== id));
        toast.success('File deleted successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete file');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleCopyUrl = (path: string) => {
    navigator.clipboard.writeText(window.location.origin + path);
    toast.success('URL copied to clipboard');
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

  const filteredMedia = media.filter(item => {
    const matchesSearch = 
      item.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || getFileTypeFromMimeType(item.mimeType) === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const groupedStats = {
    total: media.length,
    images: media.filter(m => m.mimeType.startsWith('image/')).length,
    videos: media.filter(m => m.mimeType.startsWith('video/')).length,
    documents: media.filter(m => m.mimeType === 'application/pdf' || m.mimeType.startsWith('text/')).length,
    totalSize: media.reduce((sum, m) => sum + m.size, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600">Upload and manage your media files</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

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

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search media files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="document">Documents</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{groupedStats.total}</div>
            <p className="text-xs text-muted-foreground">Total Files</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{groupedStats.images}</div>
            <p className="text-xs text-muted-foreground">Images</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{groupedStats.videos}</div>
            <p className="text-xs text-muted-foreground">Videos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{groupedStats.documents}</div>
            <p className="text-xs text-muted-foreground">Documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{formatFileSize(groupedStats.totalSize)}</div>
            <p className="text-xs text-muted-foreground">Total Size</p>
          </CardContent>
        </Card>
      </div>

      {/* Media Grid/List */}
      <Card>
        <CardHeader>
          <CardTitle>Media Files ({filteredMedia.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
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
                      <div className="text-gray-400">
                        {getFileIcon(item.mimeType)}
                      </div>
                    )}
                    <div className="hidden text-gray-400 text-4xl">
                      {getFileIcon(item.mimeType)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm truncate" title={item.originalName}>
                      {item.originalName}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatFileSize(item.size)}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.mimeType.split('/')[1].toUpperCase()}
                      </Badge>
                    </div>
                    
                    {item.description && (
                      <p className="text-xs text-gray-600 line-clamp-2" title={item.description}>
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleCopyUrl(item.path)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => window.open(item.path, '_blank')}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMedia.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getFileIcon(item.mimeType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.originalName}</h3>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(item.size)} • {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                    {item.description && (
                      <p className="text-xs text-gray-600 truncate">{item.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {item.mimeType.split('/')[1].toUpperCase()}
                    </Badge>
                    
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleCopyUrl(item.path)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => window.open(item.path, '_blank')}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredMedia.length === 0 && (
            <div className="text-center py-12">
              <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No media files found</h3>
              <p className="text-gray-600">
                {searchTerm || typeFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Upload some files to get started'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
