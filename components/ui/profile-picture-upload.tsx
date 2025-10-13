'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Camera, Loader2, User } from 'lucide-react';
import { uploadImage, deleteImage } from '@/actions/upload/uploadImage';

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  currentPublicId?: string;
  onUpload: (url: string, publicId: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProfilePictureUpload({
  currentImageUrl,
  currentPublicId,
  onUpload,
  onRemove,
  disabled = false,
  size = 'md',
  className,
}: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };


  const handleFileSelect = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError('');
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload to Cloudinary with profile picture transformations
      setUploadProgress(25);
      const result = await uploadImage(file, 'rentme/profiles', {
        width: 400,
        height: 400,
        crop: 'fill',
        gravity: 'face',
        quality: 'auto',
        format: 'webp',
      });

      setUploadProgress(75);

      if (result.success && result.url && result.publicId) {
        // Delete old image if exists
        if (currentPublicId) {
          await deleteImage(currentPublicId);
        }

        onUpload(result.url, result.publicId);
        setUploadProgress(100);
      } else {
        setError(result.error || 'Failed to upload image');
      }
    } catch (err) {
      setError('An error occurred while uploading the image');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async () => {
    if (!currentPublicId || disabled) return;

    try {
      await deleteImage(currentPublicId);
      if (onRemove) {
        onRemove();
      }
    } catch (err) {
      setError('Failed to remove image');
    }
  };

  return (
    <div className={className}>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Uploading profile picture...</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      <div className="flex items-center space-x-4">
        {/* Profile Picture Display */}
        <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden bg-muted flex items-center justify-center`}>
          {currentImageUrl ? (
            <Image
              src={currentImageUrl}
              alt="Profile picture"
              fill
              className="object-cover"
            />
          ) : (
            <User className="h-8 w-8 text-muted-foreground" />
          )}
          
          {/* Upload Overlay */}
          {!disabled && (
            <button
              type="button"
              onClick={handleFileSelect}
              disabled={isUploading}
              className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              {isUploading ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <Camera className="h-6 w-6 text-white" />
              )}
            </button>
          )}
        </div>

        {/* Upload Controls */}
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFileSelect}
              disabled={disabled || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  {currentImageUrl ? 'Change' : 'Upload'}
                </>
              )}
            </Button>

            {currentImageUrl && !disabled && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                Remove
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            JPG, PNG or WebP. Max size: 5MB
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}