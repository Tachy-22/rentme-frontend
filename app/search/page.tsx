import React from 'react';
import { SearchPageClient } from '@/components/search/SearchPageClient';
import { searchProperties } from '@/actions/properties/searchProperties';
import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { SearchFilters, User, PropertyType } from '@/types';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: Promise<{ 
    q?: string; 
    type?: string; 
    city?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    bathrooms?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const initialQuery = params.q || '';
  
  // Get current user for saved searches
  const user = await getCurrentUser();
  
  // Build initial filters from URL params
  const initialFilters: Partial<SearchFilters> = {
    propertyTypes: params.type ? [params.type as PropertyType] : [],
    priceRange: {
      min: params.minPrice ? parseInt(params.minPrice) : 0,
      max: params.maxPrice ? parseInt(params.maxPrice) : 2000000
    },
    bedrooms: {
      min: params.bedrooms ? parseInt(params.bedrooms) : 0,
      max: 5
    },
    bathrooms: {
      min: params.bathrooms ? parseInt(params.bathrooms) : 0,
      max: 5
    },
    amenities: [],
    furnished: null,
    petsAllowed: null,
    smokingAllowed: null,
    availableFrom: null,
    university: null,
    maxDistanceToUniversity: null
  };

  // Perform initial search on server
  const initialSearchResult = await searchProperties({ 
    filters: initialFilters,
    searchQuery: initialQuery,
    limit: 20 
  });
  
  const initialProperties = initialSearchResult.success ? initialSearchResult.properties : [];
  const initialTotal = initialSearchResult.success ? initialSearchResult.total : 0;
  const initialHasMore = initialSearchResult.success ? initialSearchResult.hasMore : false;

  return (
    <SearchPageClient 
      initialQuery={initialQuery}
      initialFilters={initialFilters}
      initialProperties={initialProperties}
      initialTotal={initialTotal}
      initialHasMore={initialHasMore}
      user={user as User}
    />
  );
}