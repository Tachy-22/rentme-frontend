'use client';

import { useState } from 'react';
import { PropertyType } from '../types';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: SearchFilters) => void;
  selectedFilters?: SearchFilters;
}

export interface SearchFilters {
  propertyTypes: PropertyType[];
  priceRange: { min: number; max: number };
  amenities: string[];
}

export function SearchBar({ onSearch, onFilterChange, selectedFilters }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(
    selectedFilters || {
      propertyTypes: [],
      priceRange: { min: 0, max: 1000000 },
      amenities: []
    }
  );

  const handleQuickFilter = (filter: string) => {
    let newFilters = { ...localFilters };

    if (filter === 'All') {
      newFilters.propertyTypes = [];
      newFilters.priceRange = { min: 0, max: 1000000 };
    } else if (filter === 'Under ₦300k') {
      newFilters.priceRange = { min: 0, max: 300000 };
    } else {
      const propertyType = filter.toLowerCase() as PropertyType;
      if (newFilters.propertyTypes.includes(propertyType)) {
        newFilters.propertyTypes = newFilters.propertyTypes.filter(type => type !== propertyType);
      } else {
        newFilters.propertyTypes = [propertyType];
      }
    }

    setLocalFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleAdvancedFilter = (filterType: string, value: unknown) => {
    const newFilters = { ...localFilters };

    if (filterType === 'propertyType') {
      const propertyType = value as PropertyType;
      if (newFilters.propertyTypes.includes(propertyType)) {
        newFilters.propertyTypes = newFilters.propertyTypes.filter(type => type !== propertyType);
      } else {
        newFilters.propertyTypes.push(propertyType);
      }
    } else if (filterType === 'amenity') {
      const amenity = value as string;
      if (newFilters.amenities.includes(amenity)) {
        newFilters.amenities = newFilters.amenities.filter(a => a !== amenity);
      } else {
        newFilters.amenities.push(amenity);
      }
    } else if (filterType === 'priceRange') {
      newFilters.priceRange = value as { min: number; max: number };
    }

    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange?.(localFilters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const defaultFilters = {
      propertyTypes: [],
      priceRange: { min: 0, max: 1000000 },
      amenities: []
    };
    setLocalFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
    setShowFilters(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between">
      {/* Main Search Input */}
      <div className="relative w-full md:mx-auto ">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search properties, locations..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onSearch?.(e.target.value);
          }}
          className="block w-full pl-10 pr-12 py-3 md:py-4 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 md:text-lg"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Filter Tags */}
      <div className="flex w-full space-x-2 overflow-x-auto pb-1 md:justify-center md:flex-wrap md:overflow-visible">
        {['All', 'Studio', 'Apartment', 'Room', 'Shared', 'Under ₦300k'].map((filter) => {
          const isActive = filter === 'All' ? localFilters.propertyTypes.length === 0 :
            filter === 'Under ₦300k' ? localFilters.priceRange.max <= 300000 :
              localFilters.propertyTypes.includes(filter.toLowerCase() as PropertyType);

          return (
            <button
              key={filter}
              onClick={() => handleQuickFilter(filter)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors hover:scale-105 ${isActive
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Advanced Filters Modal/Dropdown */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Filters</h3>

          {/* Price Range */}
          <div className="mb-4 flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range (Monthly)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={localFilters.priceRange.min || ''}
                onChange={(e) => handleAdvancedFilter('priceRange', {
                  ...localFilters.priceRange,
                  min: parseInt(e.target.value) || 0
                })}
                className="w-20 px-2 py-2 border border-gray-300 rounded-md text-sm"
              />
              <span className="text-gray-500 text-sm">-</span>
              <input
                type="number"
                placeholder="Max"
                value={localFilters.priceRange.max === 1000000 ? '' : localFilters.priceRange.max}
                onChange={(e) => handleAdvancedFilter('priceRange', {
                  ...localFilters.priceRange,
                  max: parseInt(e.target.value) || 1000000
                })}
                className="w-20 px-2 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Property Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <div className="flex flex-wrap gap-2">
              {['Studio', 'Apartment', 'Room', 'House', 'Shared'].map((type) => {
                const isSelected = localFilters.propertyTypes.includes(type.toLowerCase() as PropertyType);
                return (
                  <button
                    key={type}
                    onClick={() => handleAdvancedFilter('propertyType', type.toLowerCase())}
                    className={`px-3 py-2 border rounded-md text-sm transition-colors ${isSelected
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['WiFi', 'AC', 'Kitchen', 'Parking', 'Security', 'Generator'].map((amenity) => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.amenities.includes(amenity)}
                    onChange={() => handleAdvancedFilter('amenity', amenity)}
                    className="rounded border-gray-300 mr-2"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={applyFilters}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}