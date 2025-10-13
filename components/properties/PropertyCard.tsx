'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property, PropertyType } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car, 
  Wifi, 
  Dumbbell, 
  Heart,
  Eye,
  Calendar
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSave?: (propertyId: string) => void;
  isSaved?: boolean;
}

export function PropertyCard({ 
  property, 
  onSave, 
  isSaved = false
}: PropertyCardProps) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'rented':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: { amount: number; currency: string; period: string }) => {
    return `₦${price.amount.toLocaleString()}/${price.period}`;
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      wifi: Wifi,
      parking: Car,
      gym: Dumbbell,
    };
    return icons[amenity] || (() => null);
  };

  const mainImage = property.images?.[0] 
    ? typeof property.images[0] === 'string' 
      ? property.images[0] 
      : (property.images[0] as { url: string }).url
    : '/placeholder-property.jpg';

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden p-0">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={mainImage}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <Badge className={getStatusColor(property.status)}>
            {property.status}
          </Badge>
        </div>

        {/* Property Type Badge */}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary">
            {getPropertyTypeLabel(property.type)}
          </Badge>
        </div>

        {/* Save Button */}
        {onSave && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onSave(property.id);
            }}
            className="absolute bottom-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <Heart 
              className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>
        )}

        {/* View Count */}
        <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded text-xs">
          <Eye className="h-3 w-3" />
          <span>{property.viewCount || 0}</span>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title and Price */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg line-clamp-1 mb-1">
            {property.title}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-primary">
              {formatPrice(property.price)}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1 shrink-0" />
          <span className="text-sm line-clamp-1">
            {property.location.address}, {property.location.city}
          </span>
        </div>

        {/* Property Details */}
        <div className="flex items-center space-x-4 mb-3 text-sm text-muted-foreground">
          {property.details.bedrooms > 0 && (
            <div className="flex items-center space-x-1">
              <Bed className="h-4 w-4" />
              <span>{property.details.bedrooms}</span>
            </div>
          )}
          {property.details.bathrooms > 0 && (
            <div className="flex items-center space-x-1">
              <Bath className="h-4 w-4" />
              <span>{property.details.bathrooms}</span>
            </div>
          )}
          {property.details.area && (
            <div className="flex items-center space-x-1">
              <Square className="h-4 w-4" />
              <span>
                {typeof property.details.area === 'object' 
                  ? `${property.details.area.value} ${property.details.area.unit}`
                  : `${property.details.area} sq ft`
                }
              </span>
            </div>
          )}
        </div>

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {property.amenities.slice(0, 3).map((amenity) => {
              const Icon = getAmenityIcon(amenity);
              return (
                <Badge key={amenity} variant="outline" className="text-xs">
                  <Icon className="h-3 w-3 mr-1" />
                  {amenity}
                </Badge>
              );
            })}
            {property.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{property.amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Available From */}
        {property.details.availableFrom && (
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Available from {new Date(property.details.availableFrom).toLocaleDateString()}</span>
          </div>
        )}

      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Button asChild className="flex-1">
            <Link href={`/properties/${property.id}`}>
              View Details
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/contact/${property.agentId}?property=${property.id}`}>
              Contact
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}