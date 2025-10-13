'use server';

import { queryDocuments } from '@/actions/firebase/queryDocuments';
import { serializeDocumentArray } from '@/lib/firestore-serializer';
import { Property, SearchFilters } from '@/types';

interface SearchPropertiesParams {
  filters?: Partial<SearchFilters>;
  searchQuery?: string;
  limit?: number;
  lastVisible?: string;
}

interface SearchPropertiesResult {
  success: boolean;
  properties: Property[];
  hasMore: boolean;
  lastVisible?: string;
  total: number;
  error?: string;
}

export async function searchProperties(params: SearchPropertiesParams = {}): Promise<SearchPropertiesResult> {
  try {
    const { filters = {}, searchQuery, limit = 20 } = params;
    
    // Build query conditions based on filters
    const queries: Array<{
      field: string;
      operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in';
      value: any;
    }> = [];

    // Status filter - only show available properties by default
    queries.push({
      field: 'status',
      operator: '==',
      value: 'available'
    });

    // Property type filter
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      queries.push({
        field: 'type',
        operator: 'in',
        value: filters.propertyTypes
      });
    }

    // Price range filter
    if (filters.priceRange) {
      if (filters.priceRange.min > 0) {
        queries.push({
          field: 'price.amount',
          operator: '>=',
          value: filters.priceRange.min
        });
      }
      if (filters.priceRange.max > 0) {
        queries.push({
          field: 'price.amount',
          operator: '<=',
          value: filters.priceRange.max
        });
      }
    }

    // Bedroom filter
    if (filters.bedrooms) {
      if (filters.bedrooms.min >= 0) {
        queries.push({
          field: 'details.bedrooms',
          operator: '>=',
          value: filters.bedrooms.min
        });
      }
      if (filters.bedrooms.max >= 0) {
        queries.push({
          field: 'details.bedrooms',
          operator: '<=',
          value: filters.bedrooms.max
        });
      }
    }

    // Bathroom filter
    if (filters.bathrooms) {
      if (filters.bathrooms.min >= 0) {
        queries.push({
          field: 'details.bathrooms',
          operator: '>=',
          value: filters.bathrooms.min
        });
      }
      if (filters.bathrooms.max >= 0) {
        queries.push({
          field: 'details.bathrooms',
          operator: '<=',
          value: filters.bathrooms.max
        });
      }
    }

    // Furnished filter
    if (filters.furnished !== null && filters.furnished !== undefined) {
      queries.push({
        field: 'details.furnished',
        operator: '==',
        value: filters.furnished
      });
    }

    // Pets allowed filter
    if (filters.petsAllowed !== null && filters.petsAllowed !== undefined) {
      queries.push({
        field: 'details.petsAllowed',
        operator: '==',
        value: filters.petsAllowed
      });
    }

    // Smoking allowed filter
    if (filters.smokingAllowed !== null && filters.smokingAllowed !== undefined) {
      queries.push({
        field: 'details.smokingAllowed',
        operator: '==',
        value: filters.smokingAllowed
      });
    }

    // University filter
    if (filters.university) {
      queries.push({
        field: 'location.nearbyUniversities',
        operator: 'array-contains',
        value: filters.university
      });
    }

    // Available from filter
    if (filters.availableFrom) {
      queries.push({
        field: 'details.availableFrom',
        operator: '<=',
        value: filters.availableFrom
      });
    }

    // Amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      // For multiple amenities, we need to use array-contains-any
      // In a real implementation, you might want to do multiple queries or use a different approach
      queries.push({
        field: 'amenities',
        operator: 'array-contains-any',
        value: filters.amenities
      });
    }

    // For text search, we'll get all properties and filter on the client side
    // In a production app, you'd use Elasticsearch, Algolia, or Firestore's full-text search
    const result = await queryDocuments({
      collectionName: 'properties',
      filters: queries,
      orderByField: 'createdAt',
      orderDirection: 'desc',
      limitCount: searchQuery ? 1000 : limit // Get more for text filtering
    });

    if (result.success) {
      let rawProperties = result.data || [];
      let properties = serializeDocumentArray<Property>(rawProperties);

      // Apply text search filtering if search query exists
      if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        properties = properties.filter(property => {
          return (
            property.title.toLowerCase().includes(query) ||
            property.description?.toLowerCase().includes(query) ||
            property.location.address.toLowerCase().includes(query) ||
            property.location.city?.toLowerCase().includes(query) ||
            property.location.state?.toLowerCase().includes(query) ||
            (property.location as { neighborhood?: string })?.neighborhood?.toLowerCase().includes(query) ||
            (property.location.nearbyUniversities || []).some(uni => 
              uni.toLowerCase().includes(query)
            ) ||
            (property.amenities || []).some(amenity => 
              amenity.toLowerCase().includes(query)
            )
          );
        });
      }

      // Apply pagination after text search
      const total = properties.length;
      const paginatedProperties = searchQuery ? properties.slice(0, limit) : properties;
      const hasMore = total > limit;

      return {
        success: true,
        properties: paginatedProperties,
        hasMore,
        lastVisible: paginatedProperties.length > 0 ? paginatedProperties[paginatedProperties.length - 1].id : undefined,
        total
      };
    } else {
      return {
        success: false,
        properties: [],
        hasMore: false,
        total: 0,
        error: result.error || 'Failed to search properties'
      };
    }
  } catch (error) {
    console.error('Error searching properties:', error);
    return {
      success: false,
      properties: [],
      hasMore: false,
      total: 0,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}