'use server';

import { cookies } from 'next/headers';
import { updateDocument, getDocument } from '@/actions/firebase';
import { uploadImage } from '@/actions/upload/uploadImage';

interface UpdatePropertyParams {
  propertyId: string;
  updates: {
    title?: string;
    type?: string;
    price?: {
      amount: number;
      currency: string;
      period: string;
    };
    location?: {
      address: string;
      city: string;
      state: string;
    };
    details?: {
      bedrooms: number;
      bathrooms: number;
      area: {
        value: number;
        unit: string;
      };
    };
    description?: string;
    amenities?: string[];
    utilities?: {
      included: string[];
      excluded: string[];
    };
    rules?: string[];
    newImages?: File[];
    removeImages?: string[]; // URLs to remove
    availableFrom?: string;
    leaseDuration?: {
      min: number;
      max: number;
    };
    furnished?: boolean;
    status?: string;
  };
}

export async function updateProperty(params: UpdatePropertyParams) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;
    const userRole = cookieStore.get('user-role')?.value;

    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Get current property to verify ownership
    const propertyResult = await getDocument({
      collectionName: 'properties',
      documentId: params.propertyId
    });

    if (!propertyResult.success || !propertyResult.data) {
      return {
        success: false,
        error: 'Property not found'
      };
    }

    const currentProperty = propertyResult.data as any;

    // Verify ownership (agents can only edit their own properties, admin can edit any)
    if (userRole === 'agent' && currentProperty.agentId !== userId) {
      return {
        success: false,
        error: 'Unauthorized to edit this property'
      };
    }

    const { updates } = params;
    const updatedData: any = {
      updatedAt: new Date().toISOString()
    };

    // Handle image updates
    if (updates.newImages || updates.removeImages) {
      let currentImages = currentProperty.images || [];

      // Remove specified images
      if (updates.removeImages && updates.removeImages.length > 0) {
        currentImages = currentImages.filter((img: any) => 
          !updates.removeImages!.includes(img.url)
        );
      }

      // Upload new images
      if (updates.newImages && updates.newImages.length > 0) {
        for (const image of updates.newImages) {
          try {
            const uploadResult = await uploadImage(image);
            if (uploadResult.success && uploadResult.url) {
              currentImages.push({
                url: uploadResult.url,
                publicId: uploadResult.publicId || '',
                width: 800,
                height: 600,
                format: 'jpg'
              });
            }
          } catch (error) {
            console.error('Error uploading new image:', error);
          }
        }
      }

      updatedData.images = currentImages;
    }

    // Update other fields
    Object.keys(updates).forEach(key => {
      if (key !== 'newImages' && key !== 'removeImages' && updates[key as keyof typeof updates] !== undefined) {
        updatedData[key] = updates[key as keyof typeof updates];
      }
    });

    const result = await updateDocument({
      collectionName: 'properties',
      documentId: params.propertyId,
      data: updatedData
    });

    if (!result.success) {
      return {
        success: false,
        error: 'Failed to update property'
      };
    }

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    console.error('Error updating property:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update property'
    };
  }
}

export async function deleteProperty(propertyId: string) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;
    const userRole = cookieStore.get('user-role')?.value;

    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Get current property to verify ownership
    const propertyResult = await getDocument({
      collectionName: 'properties',
      documentId: propertyId
    });

    if (!propertyResult.success || !propertyResult.data) {
      return {
        success: false,
        error: 'Property not found'
      };
    }

    const currentProperty = propertyResult.data;

    // Verify ownership (agents can only delete their own properties, admin can delete any)
    if (userRole === 'agent' && currentProperty.agentId !== userId) {
      return {
        success: false,
        error: 'Unauthorized to delete this property'
      };
    }

    // Soft delete by updating status
    const result = await updateDocument({
      collectionName: 'properties',
      documentId: propertyId,
      data: {
        status: 'deleted',
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });

    return result;

  } catch (error) {
    console.error('Error deleting property:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete property'
    };
  }
}