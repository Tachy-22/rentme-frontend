'use server';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface DeleteParams {
  publicId: string;
  resourceType?: 'image' | 'video' | 'raw';
}

interface DeleteResult {
  success: boolean;
  result?: string;
  error?: string;
}

export async function deleteFromCloudinary({
  publicId,
  resourceType = 'image'
}: DeleteParams): Promise<DeleteResult> {
  try {
    if (!publicId) {
      return {
        success: false,
        error: 'Public ID is required for deletion'
      };
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });

    if (result.result === 'ok') {
      return {
        success: true,
        result: result.result
      };
    } else {
      return {
        success: false,
        error: `Failed to delete resource: ${result.result}`
      };
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred during deletion'
    };
  }
}