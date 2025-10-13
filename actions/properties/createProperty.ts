'use server';

import { addDocument } from '@/actions/firebase/addDocument';
import { Property, CloudinaryImage } from '@/types';

interface CreatePropertyParams {
  agentId: string;
  title: string;
  description: string;
  type: 'apartment' | 'house' | 'room' | 'studio' | 'shared';
  price: {
    amount: number;
    currency: string;
    period: 'monthly' | 'weekly' | 'yearly';
  };
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    nearbyUniversities: string[];
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    area: {
      value: number;
      unit: 'sqm' | 'sqft';
    };
    furnished: boolean;
    petsAllowed: boolean;
    smokingAllowed: boolean;
    availableFrom: string;
    leaseDuration: {
      min: number;
      max: number;
      unit: 'months';
    };
  };
  amenities: string[];
  images: CloudinaryImage[];
  virtualTourUrl?: string;
  utilities: {
    included: string[];
    excluded: string[];
  };
  rules: string[];
}

interface CreatePropertyResult {
  success: boolean;
  propertyId?: string;
  error?: string;
}

export async function createProperty(params: CreatePropertyParams): Promise<CreatePropertyResult> {
  try {
    // Validate required fields
    if (!params.agentId || !params.title || !params.description) {
      return {
        success: false,
        error: 'Agent ID, title, and description are required'
      };
    }

    if (!params.location.address || !params.location.city || !params.location.state) {
      return {
        success: false,
        error: 'Complete address information is required'
      };
    }

    if (params.price.amount <= 0) {
      return {
        success: false,
        error: 'Price must be greater than 0'
      };
    }

    if (params.details.bedrooms < 0 || params.details.bathrooms < 0) {
      return {
        success: false,
        error: 'Bedrooms and bathrooms cannot be negative'
      };
    }

    if (params.details.area.value <= 0) {
      return {
        success: false,
        error: 'Area must be greater than 0'
      };
    }

    if (params.images.length === 0) {
      return {
        success: false,
        error: 'At least one image is required'
      };
    }

    // Calculate distance to universities (this would typically call a mapping service)
    const distanceToUniversity: Property['location']['distanceToUniversity'] = {};
    params.location.nearbyUniversities.forEach(university => {
      distanceToUniversity[university] = {
        distance: 5, // This would be calculated using a real mapping service
        unit: 'km',
        transportMethods: {
          walking: 60,
          driving: 15,
          publicTransport: 25
        }
      };
    });

    const propertyData: Omit<Property, 'id'> = {
      agentId: params.agentId,
      title: params.title.trim(),
      description: params.description.trim(),
      type: params.type,
      status: 'available',
      price: params.price,
      location: {
        ...params.location,
        distanceToUniversity
      },
      details: params.details,
      amenities: params.amenities,
      images: params.images,
      virtualTourUrl: params.virtualTourUrl,
      utilities: params.utilities,
      rules: params.rules,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      saveCount: 0,
      applicationCount: 0
    };

    const result = await addDocument({
      collectionName: 'properties',
      data: propertyData
    });

    if (result.success) {
      return {
        success: true,
        propertyId: result.id
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to create property'
      };
    }
  } catch (error) {
    console.error('Error creating property:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}