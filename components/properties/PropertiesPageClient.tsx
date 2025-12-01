'use client';

import { useState, useEffect } from 'react';
import { User, PropertyType, Property } from '@/types';

type EnhancedProperty = Property & {
  distanceToUniversity: string;
  isSaved: boolean;
  agent: {
    id?: string;
    name: string;
    profilePicture: string;
    rating: number;
  };
};
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search,
  Filter, 
  MapPin, 
  Bed, 
  Bath, 
  Heart,
  Star,
  Wifi,
  Car,
  Utensils,
  Shield,
  X,
  Loader2
} from 'lucide-react';
import PropertyCard from './PropertyCard';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { searchProperties } from '@/actions/properties/searchProperties';
import { toast } from 'sonner';

interface PropertiesPageClientProps {
  user: User;
  initialProperties?: Property[];
}

const PROPERTY_TYPES: PropertyType[] = ['apartment', 'house', 'room', 'studio', 'shared', 'shared_room', 'lodge', 'self con.', '2 bed room'];
const AMENITIES = ['WiFi', 'Parking', 'Kitchen', 'Air Conditioning', 'Laundry', 'Security', 'Gym', 'Pool'];
const NIGERIAN_CITIES = ['Lagos', 'Abuja', 'Ondo', 'Ibadan', ];

// Helper function to enhance properties with required fields
const enhanceProperty = (property: Property): EnhancedProperty => {
  const propertyWithExtras = property as Property & Record<string, unknown>;
  return {
    ...property,
    distanceToUniversity: (propertyWithExtras.distanceToUniversity as string) || 'Distance not calculated',
    isSaved: (propertyWithExtras.isSaved as boolean) || false,
    agent: (propertyWithExtras.agent as EnhancedProperty['agent']) || {
      id: property.agentId,
      name: 'Unknown Agent',
      profilePicture: '',
      rating: 0
    }
  };
};

export default function PropertiesPageClient({ user: _user, initialProperties = [] }: PropertiesPageClientProps) {
  const [properties, setProperties] = useState(initialProperties.map(enhanceProperty));
  const [filteredProperties, setFilteredProperties] = useState(initialProperties.map(enhanceProperty));
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  // Suppress unused variable warnings
  void properties;
  void hasMore;

  const [filters, setFilters] = useState({
    city: 'all',
    propertyType: 'all',
    minPrice: 0,
    maxPrice: 1000000,
    bedrooms: 'any',
    bathrooms: 'any',
    amenities: [] as string[],
    furnished: undefined as boolean | undefined
  });

  useEffect(() => {
    handleSearch();
  }, [filters, currentPage]);

  const handleSearch = async (query?: string) => {
    setIsLoading(true);
    try {
      const currentSearchQuery = query !== undefined ? query : searchQuery;
      
      const result = await searchProperties({
        query: currentSearchQuery,
        city: filters.city && filters.city !== 'all' ? filters.city : undefined,
        propertyType: filters.propertyType && filters.propertyType !== 'all' ? filters.propertyType : undefined,
        minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
        maxPrice: filters.maxPrice < 1000000 ? filters.maxPrice : undefined,
        bedrooms: filters.bedrooms && filters.bedrooms !== 'any' ? parseInt(filters.bedrooms) : undefined,
        bathrooms: filters.bathrooms && filters.bathrooms !== 'any' ? parseInt(filters.bathrooms) : undefined,
        amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
        furnished: filters.furnished,
        page: currentPage,
        limit: 12
      });

      if (result.success) {
        const enhancedProperties = (result.data || []).map((item: unknown) => enhanceProperty(item as Property));
        setProperties(enhancedProperties);
        setFilteredProperties(enhancedProperties);
        setTotalPages((result as { totalPages?: number }).totalPages || 1);
        setHasMore(result.hasMore || false);
      } else {
        toast.error(result.error || 'Failed to search properties');
        setProperties([]);
        setFilteredProperties([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('An error occurred while searching');
      setProperties([]);
      setFilteredProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    handleSearch(searchQuery);
  };

  const handleFilterChange = (key: string, value: string | number | boolean | string[]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      city: 'all',
      propertyType: 'all',
      minPrice: 0,
      maxPrice: 1000000,
      bedrooms: 'any',
      bathrooms: 'any',
      amenities: [],
      furnished: undefined
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'number') return value !== 0 && value !== 1000000;
    if (key === 'city') return value !== 'all';
    if (key === 'propertyType') return value !== 'all';
    if (key === 'bedrooms' || key === 'bathrooms') return value !== 'any';
    return value !== undefined;
  }).length;

  const FilterContent = () => (
    <div className="space-y-6 p-4">
      {/* Location Filter */}
      <div>
        <Label className="text-sm font-medium">City</Label>
        <Select value={filters.city} onValueChange={(value) => handleFilterChange('city', value)}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent className="z-[100]">
            <SelectItem value="all">All Cities</SelectItem>
            {NIGERIAN_CITIES.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Property Type Filter */}
      <div>
        <Label className="text-sm font-medium">Property Type</Label>
        <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange('propertyType', value)}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="z-[100]">
            <SelectItem value="all">All Types</SelectItem>
            {PROPERTY_TYPES.map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range Filter */}
      <div>
        <Label className="text-sm font-medium">
          Price Range: ₦{filters.minPrice.toLocaleString()} - ₦{filters.maxPrice.toLocaleString()}
        </Label>
        <div className="mt-3">
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={([min, max]) => {
              setFilters(prev => ({
                ...prev,
                minPrice: min,
                maxPrice: max
              }));
              setCurrentPage(1);
            }}
            max={1000000}
            min={0}
            step={10000}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>₦0</span>
            <span>₦1,000,000</span>
          </div>
        </div>
      </div>

      {/* Bedrooms & Bathrooms */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Bedrooms</Label>
          <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange('bedrooms', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent className="z-[100]">
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Bathrooms</Label>
          <Select value={filters.bathrooms} onValueChange={(value) => handleFilterChange('bathrooms', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent className="z-[100]">
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Furnished Filter */}
      <div>
        <Label className="text-sm font-medium">Furnishing</Label>
        <Select 
          value={filters.furnished === undefined ? 'any' : filters.furnished.toString()} 
          onValueChange={(value) => handleFilterChange('furnished', value === 'any' ? 'any' : value === 'true')}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent className="z-[100]">
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="true">Furnished</SelectItem>
            <SelectItem value="false">Unfurnished</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Amenities Filter */}
      <div>
        <Label className="text-sm font-medium">Amenities</Label>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {AMENITIES.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={filters.amenities.includes(amenity)}
                onCheckedChange={() => handleAmenityToggle(amenity)}
              />
              <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full">
        <X className="w-4 h-4 mr-2" />
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="l g:pl-64 min-h-screen bg-background overflow-auto pb-[10rem]">
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Property Listings</h1>
          <p className="text-muted-foreground">
            Discover your perfect home near campus
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-80 space-y-6">
            <Card>
              <CardContent className="p-6 flex flex-col">
                <div className="flex items-center justify-start gap-2 ">
                  <h3 className="font-semibold">Filters</h3>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary">{activeFiltersCount}</Badge>
                  )}
                </div>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar and Mobile Filter Button */}
            <div className="flex gap-3 mb-6">
              <form onSubmit={handleSearchSubmit} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search properties, locations, neighborhoods..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>

              {/* Mobile Filter Button */}
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden relative">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="flex flex-col">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-auto mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-muted-foreground">
                {isLoading ? 'Searching...' : `${filteredProperties.length} properties found`}
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            )}

            {/* Properties Grid */}
            {!isLoading && (
              <>
                {filteredProperties.length === 0 ? (
                  <Card className="p-12 text-center">
                    <div className="text-muted-foreground">
                      <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No properties found</h3>
                      <p>Try adjusting your search criteria or clearing some filters.</p>
                      <Button variant="outline" onClick={clearFilters} className="mt-4">
                        Clear Filters
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center mt-8 space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1 || isLoading}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            disabled={isLoading}
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages || isLoading}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}