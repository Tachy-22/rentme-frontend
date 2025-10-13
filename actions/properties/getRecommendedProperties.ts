'use server';

import { getDocument } from '@/actions/firebase/getDocument';
import { queryDocuments } from '@/actions/firebase/queryDocuments';
import { Property, User, RenterProfile } from '@/types';

interface GetRecommendedPropertiesResult {
  success: boolean;
  properties: Property[];
  error?: string;
}

export async function getRecommendedProperties(
  renterId: string,
  limit?: number
): Promise<GetRecommendedPropertiesResult> {
  try {
    // Get renter profile for preferences
    const renterResult = await getDocument({
      collectionName: 'users',
      documentId: renterId
    });
    
    let renterProfile: RenterProfile | null = null;
    
    if (renterResult.success && renterResult.data) {
      const renterData = renterResult.data as unknown as User;
      renterProfile = renterData.profile as RenterProfile;
    }

    // Start with available properties
    const propertiesResult = await queryDocuments({
      collectionName: 'properties',
      filters: [{ field: 'status', operator: '==', value: 'available' }],
      orderByField: 'createdAt',
      orderDirection: 'desc',
      limitCount: limit ? limit * 2 : undefined // Get more to filter based on preferences
    });

    if (!propertiesResult.success || !propertiesResult.data) {
      return {
        success: false,
        properties: [],
        error: propertiesResult.error
      };
    }
    
    let properties: Property[] = propertiesResult.data as unknown as Property[];

    // Filter based on renter preferences if available
    if (renterProfile) {
      properties = properties.filter(property => {
        // Filter by budget
        if (renterProfile.preferredBudget?.max && property.price.amount > renterProfile.preferredBudget.max) {
          return false;
        }
        if (renterProfile.preferredBudget?.min && property.price.amount < renterProfile.preferredBudget.min) {
          return false;
        }

        // Filter by property type
        if (renterProfile.preferredPropertyTypes && renterProfile.preferredPropertyTypes.length > 0) {
          if (!renterProfile.preferredPropertyTypes.includes(property.type)) {
            return false;
          }
        }

        // Filter by pet policy
        if (renterProfile.preferences?.petsAllowed && !property.details.petsAllowed) {
          return false;
        }

        // Filter by smoking policy
        if (renterProfile.preferences?.smokingAllowed !== undefined && property.details.smokingAllowed !== renterProfile.preferences.smokingAllowed) {
          return false;
        }

        // Filter by furnished preference
        if (renterProfile.preferences?.furnished !== undefined && property.details.furnished !== renterProfile.preferences.furnished) {
          return false;
        }

        return true;
      });
    }

    // Sort by relevance (view count, recent, etc.)
    properties.sort((a, b) => {
      // Prioritize recently added properties with higher view counts
      const scoreA = (a.viewCount || 0) + (Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60 * 24); // Days factor
      const scoreB = (b.viewCount || 0) + (Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return scoreB - scoreA;
    });

    // Apply final limit
    if (limit) {
      properties = properties.slice(0, limit);
    }

    return {
      success: true,
      properties
    };
  } catch (error) {
    console.error('Error getting recommended properties:', error);
    return {
      success: false,
      properties: [],
      error: error instanceof Error ? error.message : 'Failed to get recommended properties'
    };
  }
}