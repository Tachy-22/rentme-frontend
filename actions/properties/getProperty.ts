'use server';

import { getDocument, updateDocument } from '@/actions/firebase';

export async function getProperty(propertyId: string) {
  try {
    const result = await getDocument({
      collectionName: 'properties',
      documentId: propertyId
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        error: 'Property not found'
      };
    }

    const property = result.data;

    // Increment view count
    try {
      await updateDocument({
        collectionName: 'properties',
        documentId: propertyId,
        data: {
          viewCount: (property.viewCount as number || 0) + 1
        }
      });
    } catch (error) {
      console.warn('Failed to update view count:', error);
    }

    // Enrich with additional data
    const enrichedProperty = {
      ...property,
      id: propertyId,
      distanceToUniversity: `${Math.floor(Math.random() * 10) + 1}km to campus`,
      isSaved: false, // Will be determined per user
      agent: {
        id: property.agentId,
        name: property.agentId, // Will be fetched separately
        profilePicture: '',
        rating: 4.5,
        verificationStatus: 'verified'
      }
    };

    return {
      success: true,
      data: enrichedProperty
    };

  } catch (error) {
    console.error('Error getting property:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get property'
    };
  }
}