'use client';

import { useState, useMemo } from 'react';
import { Property, User, StudentProfile } from '../types';
import { SearchBar, SearchFilters } from './SearchBar';
import { PropertyCard } from './PropertyCard';

interface SearchablePropertyFeedProps {
  properties: Property[];
  currentUser: User;
}

export function SearchablePropertyFeed({ properties, currentUser }: SearchablePropertyFeedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    propertyTypes: [],
    priceRange: { min: 0, max: 1000000 },
    amenities: []
  });

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Text search
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesText = (
          property.title.toLowerCase().includes(searchLower) ||
          property.description.toLowerCase().includes(searchLower) ||
          property.location.address.toLowerCase().includes(searchLower) ||
          property.location.city.toLowerCase().includes(searchLower) ||
          property.location.nearbyUniversities.some(uni =>
            uni.toLowerCase().includes(searchLower)
          )
        );
        if (!matchesText) return false;
      }

      // Property type filter
      if (filters.propertyTypes.length > 0) {
        if (!filters.propertyTypes.includes(property.type)) {
          return false;
        }
      }

      // Price range filter
      if (property.price.amount < filters.priceRange.min ||
        property.price.amount > filters.priceRange.max) {
        return false;
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity =>
          property.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    });
  }, [properties, searchQuery, filters]);

  return (
    <>
      {/* Search Section */}
      <div className="bg-white border-b border-gray-200 md:rounded-lg md:mb-6 md:border md:shadow-sm">
        <div className="px-4 py-4 md:px-6">
          <SearchBar
            onSearch={setSearchQuery}
            onFilterChange={setFilters}
            selectedFilters={filters}
          />
        </div>
      </div>

      {/* Feed Content */}
      <div className="px-4 py-6 space-y-6 md:px-0">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 md:mb-8">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
            Welcome back, {currentUser.profile.firstName}!
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Discover your perfect accommodation near {(currentUser.profile as StudentProfile).university}
          </p>
        </div>

        {/* Results Header */}
        <div>
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              {searchQuery || filters.propertyTypes.length > 0 || filters.amenities.length > 0
                ? `${filteredProperties.length} results found`
                : 'Recommended for you'
              }
            </h2>
            <button className="text-orange-600 text-sm font-medium hover:text-orange-700">
              See all
            </button>
          </div>

          {/* No Results */}
          {filteredProperties.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters to find more properties.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    propertyTypes: [],
                    priceRange: { min: 0, max: 1000000 },
                    amenities: []
                  });
                }}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            /* Property Grid - Mobile: Stack, Desktop: Grid */
            <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  currentUserId={currentUser.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}