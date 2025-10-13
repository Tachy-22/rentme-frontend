'use server';

import { getDocument } from '@/actions/firebase/getDocument';
import { Property } from '@/types';

interface GetPropertyResult {
  success: boolean;
  property?: Property;
  error?: string;
}

export async function getProperty(propertyId: string): Promise<GetPropertyResult> {
  try {
    if (!propertyId) {
      return {
        success: false,
        error: 'Property ID is required'
      };
    }

    const result = await getDocument({
      collectionName: 'properties',
      documentId: propertyId
    });

    if (result.success && result.data) {
      // Increment view count
      await incrementPropertyView(propertyId);

      const property = result.data as unknown as Property;
      return {
        success: true,
        property
      };
    } else {
      return {
        success: false,
        error: result.error || 'Property not found'
      };
    }
  } catch (error) {
    console.error('Error getting property:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

async function incrementPropertyView(propertyId: string): Promise<void> {
  try {
    const { updateDocument } = await import('@/actions/firebase/updateDocument');
    
    // Get current property to increment view count
    const result = await getDocument({
      collectionName: 'properties',
      documentId: propertyId
    });

    if (result.success && result.data) {
      const currentViewCount = (result.data as Record<string, unknown>).viewCount as number || 0;
      
      await updateDocument({
        collectionName: 'properties',
        documentId: propertyId,
        data: {
          viewCount: currentViewCount + 1,
          lastViewedAt: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error('Error incrementing property view count:', error);
    // Don't throw error as this is not critical for the main functionality
  }
}