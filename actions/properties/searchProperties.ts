'use server';

import { getProperties } from './getProperties';

interface SearchPropertiesParams {
  query?: string;
  location?: string;
  city?: string;
  state?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  furnished?: boolean;
  sortBy?: 'price' | 'createdAt' | 'viewCount' | 'relevance';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function searchProperties(params: SearchPropertiesParams) {
  try {
    const {
      query,
      location,
      city,
      state,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      amenities,
      furnished,
      sortBy = 'relevance',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = params;

    const offset = (page - 1) * limit;

    // Build search query
    let searchQuery = query || '';
    if (location) {
      searchQuery += ` ${location}`;
    }

    const filters: any = {};

    if (city) filters.city = city;
    if (state) filters.state = state;
    if (propertyType) filters.type = propertyType;
    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;
    if (bedrooms) filters.bedrooms = bedrooms;
    if (bathrooms) filters.bathrooms = bathrooms;
    if (amenities && amenities.length > 0) filters.amenities = amenities;
    if (furnished !== undefined) filters.furnished = furnished;

    const result = await getProperties({
      limit,
      offset,
      filters,
      search: searchQuery.trim(),
      sortBy: sortBy === 'relevance' ? 'createdAt' : sortBy,
      sortOrder
    });

    if (!result.success) {
      return result;
    }

    // Add search relevance scoring for 'relevance' sort
    if (sortBy === 'relevance' && searchQuery.trim()) {
      const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 2);
      
      const scoredProperties = result?.data?.map((property: any) => {
        let score = 0;
        const searchableText = [
          property.title,
          property.description,
          property.location?.address,
          property.location?.city,
          ...(property.amenities || [])
        ].join(' ').toLowerCase();

        searchTerms.forEach(term => {
          const titleMatches = (property.title?.toLowerCase().includes(term) ? 3 : 0);
          const descriptionMatches = (searchableText.includes(term) ? 1 : 0);
          score += titleMatches + descriptionMatches;
        });

        return { ...property, relevanceScore: score };
      });

      // Sort by relevance score
      scoredProperties?.sort((a, b) => {
        if (sortOrder === 'desc') {
          return b.relevanceScore - a.relevanceScore;
        }
        return a.relevanceScore - b.relevanceScore;
      });

      result.data = scoredProperties;
    }

    return {
      ...result,
      query: searchQuery.trim(),
      filters,
      page,
      totalPages: Math.ceil((result.total || 0) / limit)
    };

  } catch (error) {
    console.error('Error searching properties:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search properties'
    };
  }
}

export async function getPropertyStats() {
  try {
    const result = await getProperties({ limit: 1000 }); // Get all properties for stats
    
    if (!result.success || !result.data) {
      return {
        success: false,
        error: 'Failed to fetch property stats'
      };
    }

    const properties = result.data;
    
    const stats = {
      total: properties.length,
      available: properties.filter((p: any) => p.status === 'available').length,
      rented: properties.filter((p: any) => p.status === 'rented').length,
      averagePrice: properties.length > 0 
        ? Math.round(properties.reduce((sum: number, p: any) => sum + (p.price?.amount || 0), 0) / properties.length)
        : 0,
      cityCounts: properties.reduce((acc: any, p: any) => {
        const city = p.location?.city || 'Unknown';
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {}),
      typeCounts: properties.reduce((acc: any, p: any) => {
        const type = p.type || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {}),
      thisWeek: properties.filter((p: any) => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(p.createdAt) >= weekAgo;
      }).length
    };

    return {
      success: true,
      data: stats
    };

  } catch (error) {
    console.error('Error getting property stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get property stats'
    };
  }
}