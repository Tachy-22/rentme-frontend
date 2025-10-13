'use server';

import { queryDocuments } from '@/actions/firebase/queryDocuments';
import { getDocument } from '@/actions/firebase/getDocument';
import { serializeFirestoreData } from '@/lib/firestore-serializer';
import { Application, User, Property } from '@/types';

interface EnrichedApplication extends Application {
  renter?: User;
  property?: Property;
}

interface GetAgentApplicationsResult {
  success: boolean;
  applications: EnrichedApplication[];
  error?: string;
}

export async function getAgentApplications(
  agentId: string, 
  limit: number = 20
): Promise<GetAgentApplicationsResult> {
  try {
    if (!agentId) {
      return {
        success: false,
        applications: [],
        error: 'Agent ID is required'
      };
    }

    // Get applications for this agent's properties
    const result = await queryDocuments({
      collectionName: 'applications',
      filters: [
        {
          field: 'agentId',
          operator: '==',
          value: agentId
        }
      ],
      orderByField: 'submittedAt',
      orderDirection: 'desc',
      limitCount: limit
    });

    if (!result.success) {
      return {
        success: false,
        applications: [],
        error: result.error || 'Failed to fetch applications'
      };
    }

    const applications = result.data || [];
    const enrichedApplications: EnrichedApplication[] = [];

    // Enrich applications with renter and property data
    for (const app of applications) {
      const applicationData = {
        id: app.id as string,
        ...(app as Record<string, unknown>)
      } as Application;

      try {
        // Get renter information
        const renterResult = await getDocument({
          collectionName: 'users',
          documentId: applicationData.renterId
        });

        // Get property information
        const propertyResult = await getDocument({
          collectionName: 'properties',
          documentId: applicationData.propertyId
        });

        const enrichedApp: EnrichedApplication = {
          ...(serializeFirestoreData(applicationData) as Application),
          renter: renterResult.success ? {
            id: applicationData.renterId,
            ...(serializeFirestoreData(renterResult.data) as Record<string, unknown>)
          } as User : undefined,
          property: propertyResult.success ? {
            id: applicationData.propertyId,
            ...(serializeFirestoreData(propertyResult.data) as Record<string, unknown>)
          } as Property : undefined
        };

        enrichedApplications.push(enrichedApp);
      } catch (error) {
        console.error('Error enriching application data:', error);
        // Still add the application even if enrichment fails
        enrichedApplications.push(applicationData);
      }
    }

    return {
      success: true,
      applications: enrichedApplications
    };
  } catch (error) {
    console.error('Error fetching agent applications:', error);
    return {
      success: false,
      applications: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}