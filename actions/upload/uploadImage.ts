'use server';

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadImageResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

export async function uploadImage(
  file: File,
  folder: string = 'rentme',
  transformation?: Record<string, unknown>
): Promise<UploadImageResult> {
  try {
    if (!file) {
      return {
        success: false,
        error: 'No file provided'
      };
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder,
      transformation,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image'
    };
  }
}

export async function uploadMultipleImages(
  imageDataArray: string[],
  folder: string = 'rentme',
  transformation?: Record<string, unknown>
): Promise<{
  success: boolean;
  results?: { url: string; publicId: string }[];
  error?: string;
}> {
  try {
    if (!imageDataArray || imageDataArray.length === 0) {
      return {
        success: false,
        error: 'No image data provided'
      };
    }

    const uploadPromises = imageDataArray.map(imageData =>
      cloudinary.uploader.upload(imageData, {
        folder,
        transformation,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
      })
    );

    const results = await Promise.all(uploadPromises);

    return {
      success: true,
      results: results.map(result => ({
        url: result.secure_url,
        publicId: result.public_id,
      })),
    };
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload images'
    };
  }
}

export async function deleteImage(publicId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!publicId) {
      return {
        success: false,
        error: 'No public ID provided'
      };
    }

    await cloudinary.uploader.destroy(publicId);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete image'
    };
  }
}