'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { X, Upload, ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage, uploadMultipleImages, deleteImage } from '@/actions/upload/uploadImage';

interface ImageUploadProps {
  onUpload: (urls: string[], publicIds: string[]) => void;
  onRemove?: (publicId: string) => void;
  maxFiles?: number;
  existingImages?: { url: string; publicId: string }[];
  folder?: string;
  disabled?: boolean;
  className?: string;
}

interface UploadedImage {
  url: string;
  publicId: string;
  file?: File;
}

export function ImageUpload({
  onUpload,
  onRemove,
  maxFiles = 10,
  existingImages = [],
  folder = 'rentme',
  disabled = false,
  className,
}: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(existingImages);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled) return;

    setError('');
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Check if adding these files would exceed the limit
      if (uploadedImages.length + acceptedFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} images allowed`);
        setIsUploading(false);
        return;
      }

      // Convert files to base64
      const fileDataArray: string[] = [];
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        const base64Data = await convertFileToBase64(file);
        fileDataArray.push(base64Data);
        setUploadProgress(((i + 1) / acceptedFiles.length) * 50); // First 50% for file conversion
      }

      // Upload to Cloudinary
      const result = await uploadMultipleImages(fileDataArray, folder);

      if (result.success && result.results) {
        const newImages = result.results.map((img, index) => ({
          url: img.url,
          publicId: img.publicId,
          file: acceptedFiles[index],
        }));

        const updatedImages = [...uploadedImages, ...newImages];
        setUploadedImages(updatedImages);

        // Notify parent component
        onUpload(
          updatedImages.map(img => img.url),
          updatedImages.map(img => img.publicId)
        );

        setUploadProgress(100);
      } else {
        setError(result.error || 'Failed to upload images');
      }
    } catch (err) {
      setError('An error occurred while uploading images');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [uploadedImages, maxFiles, folder, onUpload, disabled]);

  const handleRemoveImage = async (index: number) => {
    if (disabled) return;

    const imageToRemove = uploadedImages[index];
    
    try {
      // Delete from Cloudinary
      await deleteImage(imageToRemove.publicId);

      // Remove from local state
      const updatedImages = uploadedImages.filter((_, i) => i !== index);
      setUploadedImages(updatedImages);

      // Notify parent component
      onUpload(
        updatedImages.map(img => img.url),
        updatedImages.map(img => img.publicId)
      );

      if (onRemove) {
        onRemove(imageToRemove.publicId);
      }
    } catch (err) {
      setError('Failed to remove image');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxFiles: maxFiles - uploadedImages.length,
    disabled: disabled || isUploading,
  });

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
            <span className="text-sm">Uploading images...</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {uploadedImages.map((image, index) => (
            <Card key={image.publicId} className="relative group">
              <CardContent className="p-2">
                <div className="aspect-square relative">
                  <Image
                    src={image.url}
                    alt={`Uploaded image ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                  {!disabled && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Dropzone */}
      {uploadedImages.length < maxFiles && !disabled && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
            }
            ${isUploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-muted rounded-full">
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                {isDragActive ? 'Drop images here' : 'Upload Images'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop images here, or click to select files
              </p>
              <p className="text-xs text-muted-foreground">
                {uploadedImages.length}/{maxFiles} images uploaded • JPG, PNG, WebP up to 10MB
              </p>
            </div>
            <Button type="button" variant="outline" disabled={isUploading}>
              <ImageIcon className="mr-2 h-4 w-4" />
              Select Images
            </Button>
          </div>
        </div>
      )}

      {uploadedImages.length >= maxFiles && (
        <Alert>
          <AlertDescription>
            Maximum number of images ({maxFiles}) reached.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}