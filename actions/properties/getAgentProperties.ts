'use server';

import { cookies } from 'next/headers';
import { queryDocuments } from '@/actions/firebase';

export async function getAgentProperties() {
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

    const result = await queryDocuments({
      collectionName: 'properties',
      filters: [
        { field: 'agentId', operator: '==', value: userId }
      ],
      orderByField: 'createdAt',
      orderDirection: 'desc'
    });

    if (!result.success) {
      return {
        success: false,
        error: 'Failed to fetch properties'
      };
    }

    const properties = (result.data || [])
      .filter((property: Record<string, unknown>) => property.status !== 'deleted') // Filter out deleted properties
      .map((property: Record<string, unknown>) => ({
        ...property,
        distanceToUniversity: `${Math.floor(Math.random() * 10) + 1}km to campus`,
        viewCount: property.viewCount || 0,
        inquiries: property.inquiries || 0,
        applications: property.applications || 0
      }));

    return {
      success: true,
      data: properties
    };

  } catch (error) {
    console.error('Error getting agent properties:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get agent properties'
    };
  }
}

