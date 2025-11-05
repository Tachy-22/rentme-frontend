'use server';

import { cookies } from 'next/headers';
import { addDocument, deleteDocument, queryDocuments } from '@/actions/firebase';

interface SavePropertyParams {
  propertyId: string;
  notes?: string;
}

export async function saveProperty(params: SavePropertyParams | string) {
  // Handle both string and object parameters
  const propertyId = typeof params === 'string' ? params : params.propertyId;
  const notes = typeof params === 'string' ? '' : (params.notes || '');
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;

    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Check if already saved
    const existingResult = await queryDocuments({
      collectionName: 'savedProperties',
      filters: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'propertyId', operator: '==', value: propertyId }
      ]
    });

    if (existingResult.success && existingResult.data && existingResult.data.length > 0) {
      return {
        success: false,
        error: 'Property already saved'
      };
    }

    const savedProperty = {
      userId,
      propertyId: propertyId,
      notes: notes,
      savedAt: new Date().toISOString()
    };

    const result = await addDocument({
      collectionName: 'savedProperties',
      data: savedProperty
    });

    return result;
  } catch (error) {
    console.error('Error saving property:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save property'
    };
  }
}

export async function unsaveProperty(propertyId: string) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;

    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Find the saved property
    const existingResult = await queryDocuments({
      collectionName: 'savedProperties',
      filters: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'propertyId', operator: '==', value: propertyId }
      ]
    });

    if (!existingResult.success || !existingResult.data || existingResult.data.length === 0) {
      return {
        success: false,
        error: 'Saved property not found'
      };
    }

    const savedPropertyDoc = existingResult.data[0] as any;
    const result = await deleteDocument({
      collectionName: 'savedProperties',
      documentId: savedPropertyDoc.id
    });

    return result;
  } catch (error) {
    console.error('Error unsaving property:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to unsave property'
    };
  }
}

export async function getSavedProperties() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;

    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    const result = await queryDocuments({
      collectionName: 'savedProperties',
      filters: [{ field: 'userId', operator: '==', value: userId }],
      orderByField: 'savedAt',
      orderDirection: 'desc'
    });

    return result;
  } catch (error) {
    console.error('Error getting saved properties:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get saved properties'
    };
  }
}

export async function checkIfPropertySaved(propertyId: string) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;

    if (!userId) {
      return {
        success: true,
        isSaved: false
      };
    }

    const result = await queryDocuments({
      collectionName: 'savedProperties',
      filters: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'propertyId', operator: '==', value: propertyId }
      ]
    });

    return {
      success: true,
      isSaved: result.success && result.data && result.data.length > 0
    };
  } catch (error) {
    console.error('Error checking if property is saved:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check saved status'
    };
  }
}