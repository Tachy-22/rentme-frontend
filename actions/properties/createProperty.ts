'use server';

import { cookies } from 'next/headers';
import { addDocument, getDocument, queryDocuments } from '@/actions/firebase';
import { uploadImage } from '@/actions/upload/uploadImage';

interface CreatePropertyParams {
  title: string;
  type: string;
  price: {
    amount: number;
    currency: string;
    period: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    area: {
      value: number;
      unit: string;
    };
  };
  description: string;
  amenities: string[];
  utilities: {
    included: string[];
    excluded: string[];
  };
  rules: string[];
  images: File[];
  availableFrom: string;
  leaseDuration: {
    min: number;
    max: number;
  };
  furnished: boolean;
}

export async function createProperty(params: CreatePropertyParams) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;
    const userRole = cookieStore.get('user-role')?.value;

    if (!userId || userRole !== 'agent') {
      return {
        success: false,
        error: 'Unauthorized access'
      };
    }

    // Get agent verification status and check listing limits
    const agentResult = await getDocument({
      collectionName: 'users',
      documentId: userId
    });

    if (!agentResult.success || !agentResult.data) {
      return {
        success: false,
        error: 'Agent profile not found'
      };
    }

    const agent = agentResult.data as {
      profile?: {
        verificationStatus?: string;
      };
    };

    const isVerified = agent.profile?.verificationStatus === 'verified';

    // Check current property count
    const propertiesResult = await queryDocuments({
      collectionName: 'properties',
      filters: [
        { field: 'agentId', operator: '==', value: userId },
        { field: 'status', operator: 'in', value: ['available', 'pending'] }
      ]
    });

    const currentPropertyCount = propertiesResult.success ? (propertiesResult.data?.length || 0) : 0;
    
    // Apply listing limits based on verification status
    const maxListings = isVerified ? 50 : 3; // Verified: 50 listings, Unverified: 3 listings
    
    if (currentPropertyCount >= maxListings) {
      return {
        success: false,
        error: isVerified 
          ? 'You have reached the maximum number of active listings (50)'
          : 'VERIFICATION_REQUIRED_FOR_MORE_LISTINGS',
        message: isVerified 
          ? 'Please remove some existing listings before creating new ones'
          : `Unverified agents can list up to 3 properties. Get verified to list up to 50 properties.`,
        requiresVerification: !isVerified
      };
    }

    // Upload images
    const uploadedImages = [];
    for (const image of params.images) {
      try {
        const uploadResult = await uploadImage(image);
        if (uploadResult.success && uploadResult.url) {
          uploadedImages.push({
            url: uploadResult.url,
            publicId: uploadResult.publicId || '',
            width: 800,
            height: 600,
            format: 'jpg'
          });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    if (uploadedImages.length === 0) {
      return {
        success: false,
        error: 'At least one image must be uploaded successfully'
      };
    }

    // Create property document with verification-based features
    const propertyData = {
      title: params.title,
      type: params.type,
      price: params.price,
      location: params.location,
      details: params.details,
      description: params.description,
      amenities: params.amenities,
      utilities: params.utilities,
      rules: params.rules,
      images: uploadedImages,
      availableFrom: params.availableFrom,
      leaseDuration: params.leaseDuration,
      furnished: params.furnished,
      agentId: userId,
      status: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      inquiries: 0,
      applications: 0,
      featured: isVerified, // Only verified agents get featured listings
      verified: false,
      agentVerificationStatus: isVerified ? 'verified' : 'unverified',
      visibilityBoost: isVerified ? 1.5 : 1.0, // Verified agents get 50% visibility boost
      searchPriority: isVerified ? 'high' : 'normal'
    };

    const result = await addDocument({
      collectionName: 'properties',
      data: propertyData
    });

    if (!result.success) {
      return {
        success: false,
        error: 'Failed to create property'
      };
    }

    return {
      success: true,
      propertyId: result.data?.id,
      data: result.data
    };

  } catch (error) {
    console.error('Error creating property:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create property'
    };
  }
}