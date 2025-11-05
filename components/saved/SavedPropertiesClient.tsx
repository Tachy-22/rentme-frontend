'use client';

import { useState, useEffect } from 'react';
import { User, Property } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Heart,
  Search,
  MapPin,
  Bed,
  Bath,
  Eye,
  Calendar,
  Trash2,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getSavedProperties } from '@/actions/properties/getSavedProperties';
import { saveProperty } from '@/actions/properties/saveProperty';
import { toast } from 'sonner';

interface SavedPropertiesClientProps {
  user: User;
  initialProperties: Property[];
}

export default function SavedPropertiesClient({ user, initialProperties }: SavedPropertiesClientProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(initialProperties);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    filterProperties();
  }, [searchQuery, properties]);

  const filterProperties = () => {
    if (!searchQuery) {
      setFilteredProperties(properties);
      return;
    }

    const filtered = properties.filter(property =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredProperties(filtered);
  };

  const handleUnsaveProperty = async (propertyId: string) => {
    try {
      setIsLoading(true);
      const result = await saveProperty(propertyId);
      
      if (result.success) {
        // Remove from local state
        setProperties(prev => prev.filter(p => p.id !== propertyId));
        toast.success('Property removed from saved');
      } else {
        toast.error(result.error || 'Failed to remove property');
      }
    } catch (error) {
      toast.error('Failed to remove property');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Saved Properties</h1>
        <p className="text-muted-foreground">
          Properties you've saved for later review
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search saved properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Properties Count */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          {filteredProperties.length} saved {filteredProperties.length === 1 ? 'property' : 'properties'}
        </p>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="relative h-48 rounded-t-lg overflow-hidden">
                  <Image
                    src={property.images[0]?.url || '/placeholder.jpg'}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-3 right-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                      onClick={() => handleUnsaveProperty(property.id)}
                      disabled={isLoading}
                    >
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </Button>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge 
                      className={cn(
                        'capitalize',
                        property.status === 'available' ? 'bg-green-100 text-green-800' :
                        property.status === 'rented' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      )}
                    >
                      {property.status}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg leading-tight">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3" />
                        {property.location.city}, {property.location.state}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary">
                        ₦{property.price.amount.toLocaleString()}
                        <span className="text-sm font-normal text-muted-foreground">
                          /{property.price.period}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Bed className="w-3 h-3" />
                          {property.details.bedrooms}
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-3 h-3" />
                          {property.details.bathrooms}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Saved {formatDate(property.savedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {property.viewCount || 0} views
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button asChild className="flex-1">
                        <Link href={`/properties/${property.id}`}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnsaveProperty(property.id)}
                        disabled={isLoading}
                        className="px-3"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No saved properties yet</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? 'No properties match your search criteria.' 
                : 'Start exploring properties and save your favorites here.'
              }
            </p>
            <Button asChild>
              <Link href="/properties">
                <Search className="w-4 h-4 mr-2" />
                Browse Properties
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}