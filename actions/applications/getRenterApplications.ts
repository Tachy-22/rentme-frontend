'use server';

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';
import { cookies } from 'next/headers';
import { Application } from '@/types';

export async function getRenterApplications() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;
    
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    // Get applications for this renter
    const applicationsRef = collection(db, 'applications');
    const applicationsQuery = query(
      applicationsRef,
      where('renterId', '==', userId),
      orderBy('submittedAt', 'desc')
    );
    
    const applicationsSnapshot = await getDocs(applicationsQuery);
    
    if (applicationsSnapshot.empty) {
      return { success: true, data: [] };
    }

    // Get application details with property information
    const applications: Application[] = [];
    
    for (const appDoc of applicationsSnapshot.docs) {
      const appData = appDoc.data();
      
      // Get property details
      const propertyRef = doc(db, 'properties', appData.propertyId);
      const propertySnapshot = await getDoc(propertyRef);
      
      if (propertySnapshot.exists()) {
        const propertyData = propertySnapshot.data();
        
        applications.push({
          id: appDoc.id,
          ...appData,
          property: {
            id: propertySnapshot.id,
            title: propertyData.title,
            location: propertyData.location,
            price: propertyData.price,
            images: propertyData.images || [],
            agent: propertyData.agent
          }
        } as any);
      }
    }

    return { success: true, data: applications };
  } catch (error) {
    console.error('Error getting renter applications:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get applications' 
    };
  }
}