'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Property, PropertyType, CloudinaryImage } from '@/types';
import { createProperty } from '@/actions/properties/createProperty';
import { updateProperty } from '@/actions/properties/updateProperty';
import { uploadImage } from '@/actions/upload/uploadImage';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Upload, X } from 'lucide-react';

interface PropertyFormClientProps {
  user: User;
  mode: 'create' | 'edit';
  property?: Property;
}

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'room', label: 'Room' },
  { value: 'studio', label: 'Studio' },
  { value: 'shared', label: 'Shared' },
  { value: 'shared_room', label: 'Shared Room' },
  { value: 'lodge', label: 'Lodge' }
];

const AMENITIES = [
  'wifi', 'parking', 'gym', 'pool', 'laundry', 'ac', 'heating', 
  'dishwasher', 'microwave', 'balcony', 'garden', 'elevator',
  'security', 'concierge', 'storage', 'bike_storage'
];

const UNIVERSITIES = [
  'University of Toronto',
  'York University', 
  'Ryerson University',
  'OCAD University',
  'George Brown College',
  'Centennial College',
  'Seneca College',
  'Humber College'
];

export function PropertyFormClient({ user, mode, property }: PropertyFormClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    type: property?.type || '' as PropertyType,
    price: {
      amount: property?.price.amount || 0,
      period: property?.price.period || 'month' as 'month' | 'week' | 'day'
    },
    location: {
      address: property?.location.address || '',
      city: property?.location.city || '',
      state: property?.location.state || '',
      zipCode: (property?.location as unknown as { zipCode?: string })?.zipCode || '',
      neighborhood: (property?.location as unknown as { neighborhood?: string })?.neighborhood || '',
      coordinates: property?.location.coordinates ? { lat: property.location.coordinates.latitude, lng: property.location.coordinates.longitude } : { lat: 0, lng: 0 },
      nearbyUniversities: property?.location.nearbyUniversities || [] as string[]
    },
    details: {
      bedrooms: property?.details.bedrooms || 1,
      bathrooms: property?.details.bathrooms || 1,
      area: {
        value: property?.details.area.value || 0,
        unit: property?.details.area.unit || 'sqft' as 'sqft' | 'sqm'
      },
      furnished: property?.details.furnished || false,
      petsAllowed: property?.details.petsAllowed || false,
      smokingAllowed: property?.details.smokingAllowed || false,
      availableFrom: property?.details.availableFrom || '',
      leaseTerm: {
        min: (property?.details as unknown as { leaseTerm?: { min?: number; max?: number } })?.leaseTerm?.min || 6,
        max: (property?.details as unknown as { leaseTerm?: { min?: number; max?: number } })?.leaseTerm?.max || 12
      }
    },
    amenities: property?.amenities || [] as string[],
    images: property?.images || [] as Array<CloudinaryImage | { id: string; url: string; alt: string }>,
    status: property?.status || 'available'
  });

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else if (keys.length === 2) {
        const currentValue = prev[keys[0] as keyof typeof prev];
        return {
          ...prev,
          [keys[0]]: {
            ...(typeof currentValue === 'object' && currentValue !== null ? currentValue : {} as Record<string, unknown>),
            [keys[1]]: value
          }
        };
      } else if (keys.length === 3) {
        const currentValue = prev[keys[0] as keyof typeof prev];
        const nestedValue = typeof currentValue === 'object' && currentValue !== null ? (currentValue as Record<string, unknown>)[keys[1]] : null;
        return {
          ...prev,
          [keys[0]]: {
            ...(typeof currentValue === 'object' && currentValue !== null ? currentValue : {} as Record<string, unknown>),
            [keys[1]]: {
              ...(typeof nestedValue === 'object' && nestedValue !== null ? nestedValue : {} as Record<string, unknown>),
              [keys[2]]: value
            }
          }
        };
      }
      return prev;
    });
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const toggleUniversity = (university: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        nearbyUniversities: prev.location.nearbyUniversities.includes(university)
          ? prev.location.nearbyUniversities.filter(u => u !== university)
          : [...prev.location.nearbyUniversities, university]
      }
    }));
  };

  const handleImageUpload = async (files: FileList) => {
    if (!files.length) return;

    setUploadingImages(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file));
      const results = await Promise.all(uploadPromises);
      
      const newImages = results
        .filter(result => result.success)
        .map(result => ({
          id: Date.now().toString() + Math.random(),
          url: result.url!,
          alt: formData.title || 'Property image'
        }));

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (imageId: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => ('id' in img ? img.id : img.publicId) !== imageId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        // Transform data to match createProperty interface
        const createPropertyData = {
          agentId: user.id,
          title: formData.title,
          description: formData.description,
          type: formData.type,
          price: {
            amount: formData.price.amount,
            currency: 'CAD',
            period: formData.price.period === 'month' ? 'monthly' as const : 
                    formData.price.period === 'week' ? 'weekly' as const : 'yearly' as const
          },
          location: {
            address: formData.location.address,
            city: formData.location.city,
            state: formData.location.state,
            coordinates: {
              latitude: (formData.location.coordinates as unknown as { lat?: number; latitude?: number }).lat || (formData.location.coordinates as unknown as { lat?: number; latitude?: number }).latitude || 0,
              longitude: (formData.location.coordinates as unknown as { lng?: number; longitude?: number }).lng || (formData.location.coordinates as unknown as { lng?: number; longitude?: number }).longitude || 0
            },
            nearbyUniversities: formData.location.nearbyUniversities
          },
          details: {
            bedrooms: formData.details.bedrooms,
            bathrooms: formData.details.bathrooms,
            area: {
              value: formData.details.area.value,
              unit: formData.details.area.unit as 'sqm' | 'sqft'
            },
            furnished: formData.details.furnished,
            petsAllowed: formData.details.petsAllowed,
            smokingAllowed: formData.details.smokingAllowed,
            availableFrom: formData.details.availableFrom || new Date().toISOString().split('T')[0],
            leaseDuration: {
              min: formData.details.leaseTerm.min,
              max: formData.details.leaseTerm.max,
              unit: 'months' as const
            }
          },
          amenities: formData.amenities,
          images: formData.images.map(img => ({
            url: img.url,
            publicId: ('id' in img ? img.id : img.publicId),
            width: ('width' in img ? img.width : 800) || 800,
            height: ('height' in img ? img.height : 600) || 600,
            format: ('format' in img ? img.format : 'jpg') || 'jpg',
            caption: ('alt' in img ? img.alt : img.caption)
          })),
          virtualTourUrl: '',
          utilities: {
            included: [],
            excluded: []
          },
          rules: []
        };

        const result = await createProperty(createPropertyData);
        if (result.success) {
          router.push('/agent/properties');
        } else {
          console.error('Error creating property:', result.error);
        }
      } else {
        // Update property
        const updatePropertyData = {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          price: formData.price,
          location: {
            ...formData.location,
            coordinates: {
              lat: (formData.location.coordinates as unknown as { lat?: number; latitude?: number }).lat || (formData.location.coordinates as unknown as { lat?: number; latitude?: number }).latitude || 0,
              lng: (formData.location.coordinates as unknown as { lng?: number; longitude?: number }).lng || (formData.location.coordinates as unknown as { lng?: number; longitude?: number }).longitude || 0
            }
          },
          details: formData.details,
          amenities: formData.amenities,
          images: formData.images,
          status: formData.status
        };

        const result = await updateProperty(property!.id, updatePropertyData);
        if (result.success) {
          router.push('/agent/properties');
        } else {
          console.error('Error updating property:', result.error);
        }
      }
    } catch (error) {
      console.error('Error saving property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {mode === 'create' ? 'Add New Property' : 'Edit Property'}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'create' 
                ? 'Create a new property listing for renters to discover.'
                : 'Update your property information and details.'
              }
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide the essential details about your property.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Modern 2BR Apartment in Downtown"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Property Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your property, its features, and what makes it special..."
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>
                Set your rental price and payment terms.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Rental Price *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.price.amount}
                    onChange={(e) => handleInputChange('price.amount', Number(e.target.value))}
                    placeholder="2500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Payment Period *</Label>
                  <Select value={formData.price.period} onValueChange={(value) => handleInputChange('price.period', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Per Day</SelectItem>
                      <SelectItem value="week">Per Week</SelectItem>
                      <SelectItem value="month">Per Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>
                Provide the property address and location details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={formData.location.address}
                  onChange={(e) => handleInputChange('location.address', e.target.value)}
                  placeholder="123 Main Street"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.location.city}
                    onChange={(e) => handleInputChange('location.city', e.target.value)}
                    placeholder="Toronto"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province *</Label>
                  <Input
                    id="state"
                    value={formData.location.state}
                    onChange={(e) => handleInputChange('location.state', e.target.value)}
                    placeholder="ON"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Postal Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.location.zipCode}
                    onChange={(e) => handleInputChange('location.zipCode', e.target.value)}
                    placeholder="M5V 3A8"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Neighborhood</Label>
                <Input
                  id="neighborhood"
                  value={formData.location.neighborhood}
                  onChange={(e) => handleInputChange('location.neighborhood', e.target.value)}
                  placeholder="Downtown, Financial District, etc."
                />
              </div>
              
              {/* Nearby Universities */}
              <div className="space-y-3">
                <Label>Nearby Universities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {UNIVERSITIES.map((university) => (
                    <div key={university} className="flex items-center space-x-2">
                      <Checkbox
                        id={university}
                        checked={formData.location.nearbyUniversities.includes(university)}
                        onCheckedChange={() => toggleUniversity(university)}
                      />
                      <Label htmlFor={university} className="text-sm">
                        {university}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>
                Specify the property size, rooms, and features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={formData.details.bedrooms}
                    onChange={(e) => handleInputChange('details.bedrooms', Number(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.details.bathrooms}
                    onChange={(e) => handleInputChange('details.bathrooms', Number(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area *</Label>
                  <Input
                    id="area"
                    type="number"
                    min="1"
                    value={formData.details.area.value}
                    onChange={(e) => handleInputChange('details.area.value', Number(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit *</Label>
                  <Select value={formData.details.area.unit} onValueChange={(value) => handleInputChange('details.area.unit', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sqft">sq ft</SelectItem>
                      <SelectItem value="sqm">sq m</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availableFrom">Available From</Label>
                  <Input
                    id="availableFrom"
                    type="date"
                    value={formData.details.availableFrom}
                    onChange={(e) => handleInputChange('details.availableFrom', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="minLease">Min Lease (months)</Label>
                    <Input
                      id="minLease"
                      type="number"
                      min="1"
                      value={formData.details.leaseTerm.min}
                      onChange={(e) => handleInputChange('details.leaseTerm.min', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLease">Max Lease (months)</Label>
                    <Input
                      id="maxLease"
                      type="number"
                      min="1"
                      value={formData.details.leaseTerm.max}
                      onChange={(e) => handleInputChange('details.leaseTerm.max', Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Property Features</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="furnished"
                      checked={formData.details.furnished}
                      onCheckedChange={(checked) => handleInputChange('details.furnished', checked)}
                    />
                    <Label htmlFor="furnished">Furnished</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="petsAllowed"
                      checked={formData.details.petsAllowed}
                      onCheckedChange={(checked) => handleInputChange('details.petsAllowed', checked)}
                    />
                    <Label htmlFor="petsAllowed">Pets Allowed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="smokingAllowed"
                      checked={formData.details.smokingAllowed}
                      onCheckedChange={(checked) => handleInputChange('details.smokingAllowed', checked)}
                    />
                    <Label htmlFor="smokingAllowed">Smoking Allowed</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
              <CardDescription>
                Select all amenities available in your property.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {AMENITIES.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <Label htmlFor={amenity} className="text-sm capitalize">
                      {amenity.replace('_', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
              
              {formData.amenities.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium">Selected amenities:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="capitalize">
                        {amenity.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Property Images</CardTitle>
              <CardDescription>
                Upload high-quality photos of your property.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {uploadingImages ? 'Uploading images...' : 'Click to upload images or drag and drop'}
                  </p>
                </Label>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image) => (
                    <div key={('id' in image ? image.id : image.publicId)} className="relative group">
                      <img
                        src={image.url}
                        alt={('alt' in image ? image.alt : image.caption) || ''}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(('id' in image ? image.id : image.publicId))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (mode === 'create' ? 'Creating...' : 'Updating...')
                : (mode === 'create' ? 'Create Property' : 'Update Property')
              }
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}