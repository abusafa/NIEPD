'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Image, Upload, X, Search, FolderOpen, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  path: string;
  alt?: string;
}

interface MediaSelectorProps {
  selectedImage?: string;
  onImageSelect: (url: string) => void;
  onImageRemove: () => void;
  label?: string;
  accept?: string;
}

export default function MediaSelector({
  selectedImage,
  onImageSelect,
  onImageRemove,
  label = 'Featured Image',
  accept = 'image/*',
}: MediaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const token = localStorage.getItem('token');
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh media list
        await fetchMedia();
        
        // Auto-select the first uploaded file if it's an image
        if (data.files && data.files.length > 0) {
          const firstFile = data.files[0];
          if (firstFile.mimeType.startsWith('image/')) {
            onImageSelect(firstFile.path);
            setIsOpen(false);
          }
        }
      } else {
        console.error('Upload failed:', response.statusText);
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleGoToMediaPage = () => {
    router.push('/admin/media');
    setIsOpen(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set drag over to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/media?type=image');

      if (response.ok) {
        const data = await response.json();
        setMedia(data.media || []);
      } else {
        console.error('Failed to fetch media:', response.statusText);
        setMedia([]);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      fetchMedia();
    }
  };

  const handleSelectImage = (item: MediaItem) => {
    onImageSelect(item.path);
    setIsOpen(false);
  };

  const filteredMedia = media.filter(item =>
    item.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {selectedImage ? (
        <div className="relative inline-block">
          <img
            src={selectedImage}
            alt="Selected image"
            className="w-48 h-32 object-cover rounded-lg border"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              console.log('Failed to load selected image:', selectedImage);
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDE5MiAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA2NEw2MCA4NEw5NiAxMDBMMTMyIDg0TDE1MiAxMDBWMTEySDQ4VjY0SDgwWiIgZmlsbD0iIzlDQTNBRiIvPgo8Y2lyY2xlIGN4PSI4MCIgY3k9IjU2IiByPSI4IiBmaWxsPSIjOUNBM0FGIi8+CjwvU3ZnPgo='; // Placeholder SVG for preview
            }}
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
            onClick={onImageRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Image className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">No image selected</p>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Select from Library
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Select Media</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Upload and Navigation Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={handleUploadClick}
                  disabled={uploading}
                  variant="default"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Files'}
                </Button>
                <Button
                  onClick={handleGoToMediaPage}
                  variant="outline"
                  size="sm"
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Manage Media
                </Button>
                <div className="flex-1" />
                {uploading && (
                  <div className="flex items-center text-sm text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Uploading...
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={accept}
                onChange={handleFileInputChange}
                className="hidden"
              />

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Media Grid */}
              <ScrollArea className="h-96">
                <div 
                  className={`grid grid-cols-4 gap-4 min-h-full relative transition-colors ${
                    isDragOver 
                      ? 'bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg' 
                      : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {isDragOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-50/90 backdrop-blur-sm rounded-lg z-10">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-blue-500 mb-2" />
                        <p className="text-blue-700 font-medium">Drop files here to upload</p>
                      </div>
                    </div>
                  )}
                {loading ? (
                  <div className="col-span-4 text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  </div>
                ) : filteredMedia.length === 0 ? (
                  <div className="col-span-4 text-center py-12">
                    <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">
                      {searchTerm ? 'No images found' : 'No images available'}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      {searchTerm ? 'Try a different search term' : 'Get started by uploading some images'}
                    </p>
                    {!searchTerm && (
                      <div className="space-y-2">
                        <Button
                          onClick={handleUploadClick}
                          disabled={uploading}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Upload Files
                        </Button>
                        <p className="text-xs text-gray-400">
                          Or drag and drop files here
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  filteredMedia.map((item) => (
                    <div
                      key={item.id}
                      className="relative cursor-pointer group"
                      onClick={() => handleSelectImage(item)}
                    >
                      <img
                        src={item.path}
                        alt={item.alt || item.originalName}
                        className="w-full h-24 object-cover rounded-lg border group-hover:border-blue-500 transition-colors"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          console.log('Failed to load image:', item.path);
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNSA0MEwyNSA1MEw0MCA2NUw2MCA0NUw3NSA2MFY3NUgyNVY0MEgzNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIzNSIgcj0iNSIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'; // Simple placeholder SVG
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all duration-200 pointer-events-none" />
                      <div className="absolute bottom-1 left-1 right-1">
                        <p className="text-xs text-white bg-black bg-opacity-50 px-1 py-0.5 rounded truncate">
                          {item.originalName}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>

        <Input
          placeholder="Or paste image URL"
          value={selectedImage || ''}
          onChange={(e) => onImageSelect(e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
}
