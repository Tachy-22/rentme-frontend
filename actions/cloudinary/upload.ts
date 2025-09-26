'use server';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadParams {
  file: string | Buffer;
  folder?: string;
  publicId?: string;
  transformation?: Record<string, unknown>;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
}

interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  secureUrl?: string;
  width?: number;
  height?: number;
  format?: string;
  resourceType?: string;
  error?: string;
}

export async function uploadToCloudinary({
  file,
  folder,
  publicId,
  transformation,
  resourceType = 'auto'
}: UploadParams): Promise<UploadResult> {
  try {
    if (!file) {
      return {
        success: false,
        error: 'File is required for upload'
      };
    }

    const uploadOptions = {
      folder,
      public_id: publicId,
      transformation,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: !publicId,
    };

    const result = await cloudinary.uploader.upload(file.toString(), uploadOptions);

    return {
      success: true,
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      resourceType: result.resource_type
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred during upload'
    };
  }
}