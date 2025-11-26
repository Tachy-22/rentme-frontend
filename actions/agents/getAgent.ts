'use server';

import { getDocument } from '@/actions/firebase/getDocument';

export async function getAgent(agentId: string) {
  try {
    if (!agentId) {
      return {
        success: false,
        error: 'Agent ID is required'
      };
    }

    const result = await getDocument({
      collectionName: 'users',
      documentId: agentId
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        error: 'Agent not found'
      };
    }

    // Only return if it's actually an agent
    if (result.data.role !== 'agent') {
      return {
        success: false,
        error: 'User is not an agent'
      };
    }

    return {
      success: true,
      agent: result.data
    };
  } catch (error) {
    console.error('Error fetching agent:', error);
    return {
      success: false,
      error: 'Failed to fetch agent details'
    };
  }
}