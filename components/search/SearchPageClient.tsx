'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Property, SearchFilters, PropertyType, User } from '@/types';
import { searchProperties } from '@/actions/properties/searchProperties';
import { getSavedSearches } from '@/actions/properties/saveSearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { SavedSearches } from '@/components/search/SavedSearches';
import { LocationSearch } from '@/components/search/LocationSearch';
import {
  Search,
  Filter,
  MapPin,
  Wifi,
  Car,
  Dumbbell,
  Waves,
  Home,
  Building,
  Building2,
  PawPrint,
  Cigarette,
  Sofa,
  Heart,
  History
} from 'lucide-react';

const PROPERTY_TYPES: PropertyType[] = ['apartment', 'house', 'room', 'studio', 'shared', 'shared_room', 'lodge'];

const AMENITIES = [
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'gym', label: 'Gym', icon: Dumbbell },
  { id: 'pool', label: 'Pool', icon: Waves },
  { id: 'laundry', label: 'Laundry', icon: Home },
  { id: 'ac', label: 'Air Conditioning', icon: Building },
  { id: 'heating', label: 'Heating', icon: Building2 },
];

const UNIVERSITIES = [
  'University of Lagos (UNILAG)',
  'Lagos State University (LASU)',
  'University of Ibadan (UI)',
  'Obafemi Awolowo University (OAU)',
  'Covenant University',
  'Babcock University',
  'Pan-Atlantic University',
  'Lagos Business School',
  'Nigerian Law School',
  'Federal University of Technology, Akure (FUTA)',
  'University of Benin (UNIBEN)',
  'Delta State University (DELSU)'
];

interface SearchPageClientProps {
  initialQuery?: string;
  initialFilters?: Partial<SearchFilters>;
  initialProperties?: Property[];
  initialTotal?: number;
  initialHasMore?: boolean;
  user?: User;
}

export function SearchPageClient({
  initialQuery,
  initialFilters,
  initialProperties = [],
  initialTotal = 0,
  initialHasMore = false,
  user
}: SearchPageClientProps) {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [total, setTotal] = useState(initialTotal);
  const [searchQuery, setSearchQuery] = useState(initialQuery || searchParams.get('q') || '');
  const [filters, setFilters] = useState<Partial<SearchFilters>>(initialFilters || {
    propertyTypes: [],
    priceRange: { min: 0, max: 2000000 },
    bedrooms: { min: 0, max: 5 },
    bathrooms: { min: 0, max: 5 },
    amenities: [],
    furnished: null,
    petsAllowed: null,
    smokingAllowed: null,
    availableFrom: null,
    university: null,
    maxDistanceToUniversity: null
  });
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    city: string;
    state: string;
    coordinates: { lat: number; lng: number };
  } | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState(searchQuery);
  const [savedSearches, setSavedSearches] = useState<Array<{
    id: string;
    name: string;
    searchQuery?: string;
    filters: Partial<SearchFilters>;
    notificationsEnabled: boolean;
    createdAt: string;
  }>>([]);

  const performSearch = useCallback(async (isNewSearch = true) => {
    setIsLoading(true);
    try {
      const result = await searchProperties({
        filters,
        searchQuery: searchQuery.trim() || undefined,
        limit: 20
      });
      if (result.success) {
        if (isNewSearch) {
          setProperties(result.properties);
        } else {
          // Load more - append to existing
          setProperties(prev => [...prev, ...result.properties]);
        }
        setHasMore(result.hasMore);
        setTotal(result.total);
        setLastSearchQuery(searchQuery);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, searchQuery]);

  useEffect(() => {
    // Only perform search if filters or search query changed
    if (properties.length === 0 || lastSearchQuery !== searchQuery) {
      performSearch(true);
    }
  }, [performSearch, searchQuery, lastSearchQuery, properties.length]);

  // Load saved searches for authenticated users
  useEffect(() => {
    if (user) {
      getSavedSearches(user.id).then(result => {
        if (result.success) {
          setSavedSearches(result.searches);
        }
      });
    }
  }, [user]);

  const handleFilterChange = (key: keyof SearchFilters, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePriceRangeChange = (values: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min: values[0], max: values[1] }
    }));
  };

  const handleBedroomChange = (values: number[]) => {
    setFilters(prev => ({
      ...prev,
      bedrooms: { min: values[0], max: values[1] }
    }));
  };

  const handleBathroomChange = (values: number[]) => {
    setFilters(prev => ({
      ...prev,
      bathrooms: { min: values[0], max: values[1] }
    }));
  };

  const togglePropertyType = (type: PropertyType) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes?.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...(prev.propertyTypes || []), type]
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities?.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...(prev.amenities || []), amenity]
    }));
  };

  const clearFilters = () => {
    setFilters({
      propertyTypes: [],
      priceRange: { min: 0, max: 2000000 },
      bedrooms: { min: 0, max: 5 },
      bathrooms: { min: 0, max: 5 },
      amenities: [],
      furnished: null,
      petsAllowed: null,
      smokingAllowed: null,
      availableFrom: null,
      university: null,
      maxDistanceToUniversity: null
    });
  };

  const handleLoadSearch = (query: string, searchFilters: Partial<SearchFilters>) => {
    setSearchQuery(query);
    setFilters(searchFilters);
    setIsFilterOpen(false);
  };

  const handleLocationSelect = (location: {
    address: string;
    city: string;
    state: string;
    coordinates: { lat: number; lng: number };
  }) => {
    setSelectedLocation(location);
    setFilters(prev => ({
      ...prev,
      location: {
        address: location.address,
        city: location.city,
        state: location.state,
        coordinates: location.coordinates
      }
    }));
  };

  const getPropertyTypeLabel = (type: PropertyType): string => {
    const labels: Record<PropertyType, string> = {
      apartment: 'Apartment',
      house: 'House',
      room: 'Room',
      studio: 'Studio',
      shared: 'Shared',
      shared_room: 'Shared Room',
      lodge: 'Lodge'
    };
    return labels[type];
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Property Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Property Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_TYPES.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={filters.propertyTypes?.includes(type) || false}
                onCheckedChange={() => togglePropertyType(type)}
              />
              <Label htmlFor={type} className="text-sm">
                {getPropertyTypeLabel(type)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Price Range: ₦{filters.priceRange?.min?.toLocaleString()} - ₦{filters.priceRange?.max?.toLocaleString()}
        </Label>
        <Slider
          value={[filters.priceRange?.min || 0, filters.priceRange?.max || 2000000]}
          onValueChange={handlePriceRangeChange}
          max={2000000}
          min={0}
          step={10000}
          className="w-full"
        />
      </div>

      <Separator />

      {/* Bedrooms */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Bedrooms: {filters.bedrooms?.min} - {filters.bedrooms?.max}
        </Label>
        <Slider
          value={[filters.bedrooms?.min || 0, filters.bedrooms?.max || 5]}
          onValueChange={handleBedroomChange}
          max={5}
          min={0}
          step={1}
          className="w-full"
        />
      </div>

      <Separator />

      {/* Bathrooms */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Bathrooms: {filters.bathrooms?.min} - {filters.bathrooms?.max}
        </Label>
        <Slider
          value={[filters.bathrooms?.min || 0, filters.bathrooms?.max || 5]}
          onValueChange={handleBathroomChange}
          max={5}
          min={0}
          step={1}
          className="w-full"
        />
      </div>

      <Separator />

      {/* University */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Name of University</Label>
        <Select
          value={filters.university || 'any'}
          onValueChange={(value) => handleFilterChange('university', value === 'any' ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select university" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            {UNIVERSITIES.map((uni) => (
              <SelectItem key={uni} value={uni}>
                {uni}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Available From */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Available From</Label>
        <Input
          type="date"
          value={filters.availableFrom || ''}
          onChange={(e) => handleFilterChange('availableFrom', e.target.value || null)}
        />
      </div>

      <Separator />

      {/* Amenities */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Amenities</Label>
        <div className="grid grid-cols-2 gap-2">
          {AMENITIES.map((amenity) => {
            const Icon = amenity.icon;
            return (
              <div key={amenity.id} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity.id}
                  checked={filters.amenities?.includes(amenity.id) || false}
                  onCheckedChange={() => toggleAmenity(amenity.id)}
                />
                <Label htmlFor={amenity.id} className="text-sm flex items-center space-x-1">
                  <Icon className="h-3 w-3" />
                  <span>{amenity.label}</span>
                </Label>
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Additional Options */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Additional Options</Label>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="furnished"
            checked={filters.furnished === true}
            onCheckedChange={(checked) =>
              handleFilterChange('furnished', checked ? true : null)
            }
          />
          <Label htmlFor="furnished" className="text-sm flex items-center space-x-1">
            <Sofa className="h-3 w-3" />
            <span>Furnished</span>
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="pets"
            checked={filters.petsAllowed === true}
            onCheckedChange={(checked) =>
              handleFilterChange('petsAllowed', checked ? true : null)
            }
          />
          <Label htmlFor="pets" className="text-sm flex items-center space-x-1">
            <PawPrint className="h-3 w-3" />
            <span>Pets Allowed</span>
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="smoking"
            checked={filters.smokingAllowed === true}
            onCheckedChange={(checked) =>
              handleFilterChange('smokingAllowed', checked ? true : null)
            }
          />
          <Label htmlFor="smoking" className="text-sm flex items-center space-x-1">
            <Cigarette className="h-3 w-3" />
            <span>Smoking Allowed</span>
          </Label>
        </div>
      </div>

      <Separator />

      <Button onClick={clearFilters} variant="outline" className="w-full">
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="lg:max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 ">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Find Your Perfect Rental</h1>
        <p className="text-muted-foreground">
          Discover amazing properties that match your lifestyle and budget
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 space-y-4">
        {/* Location Search */}
        <LocationSearch onLocationSelect={handleLocationSelect} />

        {/* Keywords and Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by State, Area, or amenities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && performSearch(true)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => performSearch(true)} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="shrink-0">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {(filters.propertyTypes?.length || 0) + (filters.amenities?.length || 0) > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {(filters.propertyTypes?.length || 0) + (filters.amenities?.length || 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Search & Filters</SheetTitle>
                <SheetDescription>
                  Narrow down your search and manage saved searches
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 px-4 pb-4">
                {user ? (
                  <Tabs defaultValue="filters" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="filters">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </TabsTrigger>
                      <TabsTrigger value="saved">
                        <Heart className="h-4 w-4 mr-2" />
                        Saved
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="filters" className="mt-4">
                      <FilterContent />
                    </TabsContent>
                    <TabsContent value="saved" className="mt-4">
                      <SavedSearches
                        userId={user.id}
                        currentSearchQuery={searchQuery}
                        currentFilters={filters}
                        savedSearches={savedSearches}
                        onLoadSearch={handleLoadSearch}
                      />
                    </TabsContent>
                  </Tabs>
                ) : (
                  <FilterContent />
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedLocation || (filters.propertyTypes?.length || 0) > 0 || (filters.amenities?.length || 0) > 0) && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {selectedLocation && (
              <Badge variant="outline" className="cursor-pointer"
                onClick={() => {
                  setSelectedLocation(null);
                  setFilters(prev => {
                    const { location, ...rest } = prev;
                    return rest;
                  });
                }}>
                <MapPin className="h-3 w-3 mr-1" />
                {selectedLocation.address} ×
              </Badge>
            )}
            {filters.propertyTypes?.map((type) => (
              <Badge key={type} variant="secondary" className="cursor-pointer"
                onClick={() => togglePropertyType(type)}>
                {getPropertyTypeLabel(type)} ×
              </Badge>
            ))}
            {filters.amenities?.map((amenity) => (
              <Badge key={amenity} variant="secondary" className="cursor-pointer"
                onClick={() => toggleAmenity(amenity)}>
                {AMENITIES.find(a => a.id === amenity)?.label} ×
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {isLoading ? 'Searching...' : `Found ${total} properties`}
        </p>
      </div>

      {/* Property Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* Loading State */}
      {isLoading && properties.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Searching for properties...</p>
          </div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && properties.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button onClick={() => performSearch(false)} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load More Properties'}
          </Button>
        </div>
      )}
    </div>
  );
}