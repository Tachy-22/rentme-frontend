'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Property } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Heart, MapPin, Bed, Bath, Square, Eye, HeartOff } from 'lucide-react';

interface SavedPropertiesClientProps {
  user: User;
  savedProperties: Property[];
}

export function SavedPropertiesClient({ user, savedProperties }: SavedPropertiesClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('saved_date');

  const filteredProperties = savedProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location?.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || property.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price.amount - b.price.amount;
      case 'price_high':
        return b.price.amount - a.price.amount;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'saved_date':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Default sort by creation date
    }
  });

  const handleRemoveFromSaved = async (propertyId: string) => {
    // TODO: Implement remove from saved functionality
    console.log('Removing property from saved:', propertyId);
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

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Properties</h1>
          <p className="text-muted-foreground">
            Your wishlist of favorite properties.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search saved properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="saved_date">Recently Saved</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest Listed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Properties Grid */}
        {sortedProperties.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Saved Properties</h3>
              <p className="text-muted-foreground text-center mb-4">
                {savedProperties.length === 0 
                  ? "You haven't saved any properties yet." 
                  : "No properties match your current filters."
                }
              </p>
              {savedProperties.length === 0 && (
                <Button asChild>
                  <Link href="/search">
                    Start Searching Properties
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProperties.map((property) => (
              <Card key={property.id} className="group hover:shadow-lg transition-shadow">
                <div className="relative">
                  {/* Property Image Placeholder */}
                  <div className="aspect-video bg-muted rounded-t-lg relative overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0].url}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-muted-foreground">No Image</div>
                      </div>
                    )}
                    
                    {/* Remove from saved button */}
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveFromSaved(property.id)}
                    >
                      <HeartOff className="h-4 w-4" />
                    </Button>
                    
                    {/* Status badge */}
                    <Badge className={`absolute bottom-2 left-2 ${getStatusColor(property.status)}`}>
                      {property.status}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg line-clamp-1">{property.title}</CardTitle>
                      <CardDescription className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{property.location?.address}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Property Details */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          <span>{property.details.bedrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          <span>{property.details.bathrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <Square className="h-4 w-4 mr-1" />
                          <span>{property.details.area.value} {property.details.area.unit}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">
                          ${property.price.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          per {property.price.period}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/properties/${property.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      <Button size="sm" className="flex-1" asChild>
                        <Link href={`/apply/${property.id}`}>
                          Apply Now
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        {savedProperties.length > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Showing {sortedProperties.length} of {savedProperties.length} saved properties
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}