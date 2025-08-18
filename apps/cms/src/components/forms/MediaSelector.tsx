'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Image, Upload, X, Search } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/media?type=image', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMedia(data.media);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
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
              <div className="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="col-span-4 text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  </div>
                ) : filteredMedia.length === 0 ? (
                  <div className="col-span-4 text-center py-8">
                    <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      {searchTerm ? 'No images found' : 'No images available'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Upload some images to the media library first
                    </p>
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
                          target.src = '/placeholder-image.png'; // You might want to add a placeholder
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity" />
                      <div className="absolute bottom-1 left-1 right-1">
                        <p className="text-xs text-white bg-black bg-opacity-50 px-1 py-0.5 rounded truncate">
                          {item.originalName}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
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
