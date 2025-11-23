'use server';

import { cookies } from 'next/headers';
import { queryDocuments, getDocument } from '@/actions/firebase';

export async function getAgentApplications() {
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

    // Get applications for this agent's properties
    const applicationsResult = await queryDocuments({
      collectionName: 'applications',
      filters: [
        { field: 'agentId', operator: '==', value: userId }
      ],
      orderByField: 'submittedAt',
      orderDirection: 'desc'
    });

    if (!applicationsResult.success || !applicationsResult.data) {
      return {
        success: true,
        data: []
      };
    }

    // Enrich applications with property and renter details
    const enrichedApplications = await Promise.all(
      applicationsResult.data.map(async (application: Record<string, unknown>) => {
        // Get property details
        const propertyResult = await getDocument({
          collectionName: 'properties',
          documentId: application.propertyId as string
        });

        // Get renter details
        const renterResult = await getDocument({
          collectionName: 'users',
          documentId: application.renterId as string
        });

        let property = null;
        let renter = null;

        if (propertyResult.success && propertyResult.data) {
          property = {
            id: application.propertyId,
            title: propertyResult.data.title,
            location: propertyResult.data.location,
            price: propertyResult.data.price,
            images: propertyResult.data.images || []
          };
        }

        if (renterResult.success && renterResult.data) {
          const userData = renterResult.data as Record<string, unknown>;
          const profile = userData.profile as Record<string, unknown> | undefined;
          const firstName = profile?.firstName || '';
          const lastName = profile?.lastName || '';
          const fullName = `${firstName} ${lastName}`.trim() || 'Unknown User';
          
          renter = {
            id: application.renterId,
            name: fullName,
            email: userData.email,
            phone: (userData.profile as Record<string, unknown>)?.phone as string,
            profilePicture: (userData.profile as Record<string, unknown>)?.profilePicture as string,
            verificationStatus: (userData.profile as Record<string, unknown>)?.verificationStatus as string || 'unverified'
          };
        }

        return {
          id: application.id,
          ...application,
          property,
          renter
        };
      })
    );

    return {
      success: true,
      data: enrichedApplications
    };

  } catch (error) {
    console.error('Error getting agent applications:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get applications'
    };
  }
}