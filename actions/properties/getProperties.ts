'use server';

import { queryDocuments } from '@/actions/firebase';

interface GetPropertiesParams {
  limit?: number;
  offset?: number;
  filters?: {
    city?: string;
    state?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
    furnished?: boolean;
  };
  search?: string;
  sortBy?: 'price' | 'createdAt' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}

export async function getProperties(params: GetPropertiesParams = {}) {
  try {
    const {
      limit = 20,
      offset = 0,
      filters = {},
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params;

    // Build query conditions
    const whereConditions: { field: string; operator: string; value: string | number | boolean }[] = [
      { field: 'status', operator: '==', value: 'available' }
    ];

    // Add filters
    if (filters.city) {
      whereConditions.push({ field: 'location.city', operator: '==', value: filters.city });
    }
    
    if (filters.state) {
      whereConditions.push({ field: 'location.state', operator: '==', value: filters.state });
    }
    
    if (filters.type) {
      whereConditions.push({ field: 'type', operator: '==', value: filters.type });
    }
    
    if (filters.bedrooms) {
      whereConditions.push({ field: 'details.bedrooms', operator: '==', value: filters.bedrooms });
    }
    
    if (filters.bathrooms) {
      whereConditions.push({ field: 'details.bathrooms', operator: '==', value: filters.bathrooms });
    }
    
    if (filters.furnished !== undefined) {
      whereConditions.push({ field: 'furnished', operator: '==', value: filters.furnished });
    }

    // Price range filters
    if (filters.minPrice) {
      whereConditions.push({ field: 'price.amount', operator: '>=', value: filters.minPrice });
    }
    
    if (filters.maxPrice) {
      whereConditions.push({ field: 'price.amount', operator: '<=', value: filters.maxPrice });
    }

    const result = await queryDocuments({
      collectionName: 'properties',
      filters: whereConditions.map(condition => ({
        ...condition,
        operator: condition.operator as any
      })),
      orderByField: sortBy,
      orderDirection: sortOrder as any,
      limitCount: limit + offset // We'll handle offset in client-side filtering for now
    });

    if (!result.success) {
      return {
        success: false,
        error: 'Failed to fetch properties'
      };
    }

    let properties = result.data || [];

    // Client-side search filtering (since Firestore doesn't support complex text search)
    if (search) {
      const searchLower = search.toLowerCase();
      properties = properties.filter((property: Record<string, unknown>) => 
        (property.title as string)?.toLowerCase().includes(searchLower) ||
        (property.description as string)?.toLowerCase().includes(searchLower) ||
        ((property.location as Record<string, unknown>)?.address as string)?.toLowerCase().includes(searchLower) ||
        ((property.location as Record<string, unknown>)?.city as string)?.toLowerCase().includes(searchLower) ||
        (property.amenities as string[])?.some((amenity: string) => 
          amenity.toLowerCase().includes(searchLower)
        )
      );
    }

    // Client-side amenities filtering
    if (filters.amenities && filters.amenities.length > 0) {
      properties = properties.filter((property: Record<string, unknown>) => 
        filters.amenities!.every(amenity => 
          (property.amenities as string[])?.includes(amenity)
        )
      );
    }

    // Apply offset and limit
    const paginatedProperties = properties.slice(offset, offset + limit);

    // Return properties with their actual data
    const enrichedProperties = paginatedProperties.map((property: Record<string, unknown>) => ({
      ...property,
      distanceToUniversity: property.distanceToUniversity || 'Distance not calculated',
      isSaved: false, // Will be determined per user in client components
      agent: property.agent || {
        id: property.agentId,
        name: 'Unknown Agent',
        profilePicture: '',
        rating: 0
      }
    }));

    return {
      success: true,
      data: enrichedProperties,
      total: properties.length,
      hasMore: offset + limit < properties.length
    };

  } catch (error) {
    console.error('Error getting properties:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get properties'
    };
  }
}