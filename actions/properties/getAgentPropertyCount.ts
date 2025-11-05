'use server';

import { cookies } from 'next/headers';
import { queryDocuments } from '@/actions/firebase';

export async function getAgentPropertyCount() {
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

    // Get all properties for this agent
    const result = await queryDocuments({
      collectionName: 'properties',
      filters: [
        { field: 'agentId', operator: '==', value: userId }
      ]
    });

    const count = result.success ? (result.data?.length || 0) : 0;

    return {
      success: true,
      count
    };

  } catch (error) {
    console.error('Error getting agent property count:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get property count'
    };
  }
}