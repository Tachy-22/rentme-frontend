'use server';

import { updateDocument } from '@/actions/firebase/updateDocument';

interface UpdatePropertyData {
  title: string;
  description: string;
  type: string;
  price: {
    amount: number;
    period: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    neighborhood?: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    nearbyUniversities: string[];
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    area: {
      value: number;
      unit: string;
    };
    furnished: boolean;
    petsAllowed: boolean;
    smokingAllowed: boolean;
    availableFrom?: string;
    leaseTerm: {
      min: number;
      max: number;
    };
  };
  amenities: string[];
  images: Array<{
    id: string;
    url: string;
    alt: string;
  }>;
  status: string;
}

interface UpdatePropertyResult {
  success: boolean;
  error?: string;
}

export async function updateProperty(propertyId: string, data: UpdatePropertyData): Promise<UpdatePropertyResult> {
  try {
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    const result = await updateDocument({
      collectionName: 'properties',
      documentId: propertyId,
      data: updateData
    });

    if (result.success) {
      return {
        success: true
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to update property'
      };
    }
  } catch (error) {
    console.error('Error updating property:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}