'use server';

import { queryDocuments } from '@/actions/firebase/queryDocuments';
import { getDocument } from '@/actions/firebase/getDocument';
import { serializeFirestoreData } from '@/lib/firestore-serializer';
import { Application, Property } from '@/types';

interface EnrichedApplication extends Application {
  property?: Property;
}

interface GetRenterApplicationsResult {
  success: boolean;
  applications: EnrichedApplication[];
  error?: string;
}

export async function getRenterApplications(
  renterId: string,
  limit?: number
): Promise<GetRenterApplicationsResult> {
  try {
    // Get applications for this renter
    const applicationsResult = await queryDocuments({
      collectionName: 'applications',
      filters: [
        { field: 'renterId', operator: '==', value: renterId }
      ],
      orderByField: 'submittedAt',
      orderDirection: 'desc',
      limitCount: limit
    });

    if (!applicationsResult.success) {
      return {
        success: false,
        applications: [],
        error: applicationsResult.error
      };
    }

    const applications: EnrichedApplication[] = [];
    
    if (applicationsResult.data) {
      for (const applicationData of applicationsResult.data as Application[]) {
        // Fetch property details
        let property: Property | undefined;
        try {
          const propertyResult = await getDocument({
            collectionName: 'properties',
            documentId: applicationData.propertyId
          });
          
          if (propertyResult.success && propertyResult.data) {
            property = serializeFirestoreData(propertyResult.data) as Property;
          }
        } catch (error) {
          console.error('Error fetching property for application:', error);
        }
        
        applications.push({
          ...(serializeFirestoreData(applicationData) as Application),
          property
        });
      }
    }

    return {
      success: true,
      applications
    };
  } catch (error) {
    console.error('Error getting renter applications:', error);
    return {
      success: false,
      applications: [],
      error: error instanceof Error ? error.message : 'Failed to get applications'
    };
  }
}