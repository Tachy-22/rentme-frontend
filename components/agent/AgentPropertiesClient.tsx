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
import { Search, Plus, Eye, Edit, Trash2, MapPin, Bed, Bath, Square, DollarSign } from 'lucide-react';

interface AgentPropertiesClientProps {
  user: User;
  properties: Property[];
}

export function AgentPropertiesClient({ user, properties }: AgentPropertiesClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location?.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    const matchesType = typeFilter === 'all' || property.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'rented':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      apartment: 'Apartment',
      house: 'House',
      room: 'Room',
      studio: 'Studio',
      shared: 'Shared',
      shared_room: 'Shared Room',
      lodge: 'Lodge'
    };
    return labels[type] || type;
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
            <p className="text-muted-foreground">
              Manage your property listings and track their performance.
            </p>
          </div>
          <Button asChild>
            <Link href="/properties/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="room">Room</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="shared">Shared</SelectItem>
              <SelectItem value="shared_room">Shared Room</SelectItem>
              <SelectItem value="lodge">Lodge</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <Card className=''>
            <CardContent className="flex flex-col items-center justify-center pb-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">
                  {properties.length === 0 ? 'No Properties Yet' : 'No Properties Found'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {properties.length === 0 
                    ? "You haven't added any properties yet. Start by adding your first property listing."
                    : "No properties match your current filters. Try adjusting your search criteria."
                  }
                </p>
                {properties.length === 0 && (
                  <Button asChild>
                    <Link href="/properties/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Property
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="group hover:shadow-lg transition-shadow pt-0">
                <div className="relative">
                  {/* Property Image */}
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
                    
                    {/* Status badge */}
                    <Badge className={`absolute top-2 left-2 ${getStatusColor(property.status)}`}>
                      {property.status}
                    </Badge>
                    
                    {/* Type badge */}
                    <Badge variant="outline" className="absolute top-2 right-2 bg-white">
                      {getTypeLabel(property.type)}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="space-y-1">
                    <CardTitle className="text-lg line-clamp-1">{property.title}</CardTitle>
                    <CardDescription className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{property.location?.address}</span>
                    </CardDescription>
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
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="text-xl font-bold">
                        ${property.price.amount.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">
                        / {property.price.period}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/properties/${property.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/properties/${property.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        {properties.length > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Showing {filteredProperties.length} of {properties.length} properties
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}