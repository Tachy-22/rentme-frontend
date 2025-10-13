'use server';

import { getDocument } from '@/actions/firebase/getDocument';
import { updateDocument } from '@/actions/firebase/updateDocument';

interface SavePropertyResult {
  success: boolean;
  isSaved?: boolean;
  error?: string;
}

export async function saveProperty(userId: string, propertyId: string): Promise<SavePropertyResult> {
  try {
    if (!userId || !propertyId) {
      return {
        success: false,
        error: 'User ID and Property ID are required'
      };
    }

    // Get current user data
    const userResult = await getDocument({
      collectionName: 'users',
      documentId: userId
    });

    if (!userResult.success || !userResult.data) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    const userData = userResult.data as Record<string, unknown>;
    const currentSavedProperties = (userData.savedProperties as string[]) || [];
    
    let updatedSavedProperties: string[];
    let isSaved: boolean;

    if (currentSavedProperties.includes(propertyId)) {
      // Remove from saved properties
      updatedSavedProperties = currentSavedProperties.filter(id => id !== propertyId);
      isSaved = false;
    } else {
      // Add to saved properties
      updatedSavedProperties = [...currentSavedProperties, propertyId];
      isSaved = true;
    }

    // Update user document
    const updateResult = await updateDocument({
      collectionName: 'users',
      documentId: userId,
      data: {
        savedProperties: updatedSavedProperties,
        updatedAt: new Date().toISOString()
      }
    });

    if (updateResult.success) {
      // Update property save count
      await updatePropertySaveCount(propertyId, isSaved);

      return {
        success: true,
        isSaved
      };
    } else {
      return {
        success: false,
        error: updateResult.error || 'Failed to save property'
      };
    }
  } catch (error) {
    console.error('Error saving property:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

async function updatePropertySaveCount(propertyId: string, increment: boolean): Promise<void> {
  try {
    // Get current property to update save count
    const result = await getDocument({
      collectionName: 'properties',
      documentId: propertyId
    });

    if (result.success && result.data) {
      const propertyData = result.data as Record<string, unknown>;
      const currentSaveCount = (propertyData.saveCount as number) || 0;
      const newSaveCount = increment ? currentSaveCount + 1 : Math.max(0, currentSaveCount - 1);
      
      await updateDocument({
        collectionName: 'properties',
        documentId: propertyId,
        data: {
          saveCount: newSaveCount,
          updatedAt: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error('Error updating property save count:', error);
    // Don't throw error as this is not critical for the main functionality
  }
}