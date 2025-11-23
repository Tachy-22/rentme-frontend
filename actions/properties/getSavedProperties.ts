'use server';

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { cookies } from 'next/headers';
import { Property } from '@/types';

export async function getSavedProperties() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;
    
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    // Get saved property IDs
    const savedPropertiesRef = collection(db, 'users', userId, 'savedProperties');
    const savedPropertiesSnapshot = await getDocs(savedPropertiesRef);
    
    if (savedPropertiesSnapshot.empty) {
      return { success: true, data: [] };
    }

    // Get property details for each saved property
    const properties: Property[] = [];
    
    for (const savedDoc of savedPropertiesSnapshot.docs) {
      const propertyId = savedDoc.data().propertyId;
      const propertyRef = doc(db, 'properties', propertyId);
      const propertySnapshot = await getDoc(propertyRef);
      
      if (propertySnapshot.exists()) {
        const propertyData = propertySnapshot.data();
        properties.push({
          id: propertySnapshot.id,
          ...propertyData,
          savedAt: savedDoc.data().savedAt
        } as unknown as Property);
      }
    }

    // Sort by saved date (most recent first)
    properties.sort((a, b) => {
      const dateA = a.savedAt ? new Date(a.savedAt as string) : new Date(0);
      const dateB = b.savedAt ? new Date(b.savedAt as string) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    return { success: true, data: properties };
  } catch (error) {
    console.error('Error getting saved properties:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get saved properties' 
    };
  }
}