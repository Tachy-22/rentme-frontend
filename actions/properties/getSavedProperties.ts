'use server';

import { queryDocuments } from '@/actions/firebase/queryDocuments';
import { getDocument } from '@/actions/firebase/getDocument';
import { Property } from '@/types';

// Helper function to recursively serialize Firestore Timestamps
function serializeFirestoreData(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'object') {
    // Check if it's a Firestore Timestamp
    const timestamp = obj as { seconds?: number; nanoseconds?: number; toDate?: () => Date };
    if (timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
      return new Date(timestamp.seconds * 1000).toISOString();
    }
    
    // If it's an array, recursively serialize each element
    if (Array.isArray(obj)) {
      return obj.map(item => serializeFirestoreData(item));
    }
    
    // If it's an object, recursively serialize each property
    const serialized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      serialized[key] = serializeFirestoreData(value);
    }
    return serialized;
  }
  
  return obj;
}

interface GetSavedPropertiesResult {
  success: boolean;
  properties: Property[];
  error?: string;
}

export async function getSavedProperties(userId: string): Promise<GetSavedPropertiesResult> {
  try {
    // Get saved property records for this user
    const savedRecordsResult = await queryDocuments({
      collectionName: 'savedProperties',
      filters: [{ field: 'renterId', operator: '==', value: userId }],
      orderByField: 'savedAt',
      orderDirection: 'desc'
    });

    if (!savedRecordsResult.success || !savedRecordsResult.data) {
      return {
        success: false,
        properties: [],
        error: savedRecordsResult.error || 'Failed to get saved properties'
      };
    }

    const properties: Property[] = [];
    
    // Fetch each property's details
    for (const record of savedRecordsResult.data) {
      const savedRecord = record as { propertyId: string; savedAt: string };
      
      try {
        const propertyResult = await getDocument({
          collectionName: 'properties',
          documentId: savedRecord.propertyId
        });
        
        if (propertyResult.success && propertyResult.data) {
          const serializedProperty = serializeFirestoreData(propertyResult.data) as Property;
          properties.push(serializedProperty);
        }
      } catch (error) {
        console.error('Error fetching saved property:', error);
        // Continue with other properties even if one fails
      }
    }

    return {
      success: true,
      properties
    };
  } catch (error) {
    console.error('Error getting saved properties:', error);
    return {
      success: false,
      properties: [],
      error: error instanceof Error ? error.message : 'Failed to get saved properties'
    };
  }
}