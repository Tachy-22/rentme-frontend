'use server';

import { queryDocuments } from '@/actions/firebase/queryDocuments';
import { serializeDocumentArray } from '@/lib/firestore-serializer';
import { Property } from '@/types';

interface GetAgentPropertiesResult {
  success: boolean;
  properties: Property[];
  error?: string;
}

export async function getAgentProperties(agentId: string): Promise<GetAgentPropertiesResult> {
  try {
    if (!agentId) {
      return {
        success: false,
        properties: [],
        error: 'Agent ID is required'
      };
    }

    const result = await queryDocuments({
      collectionName: 'properties',
      filters: [
        {
          field: 'agentId',
          operator: '==',
          value: agentId
        }
      ],
      orderByField: 'createdAt',
      orderDirection: 'desc'
    });

    if (result.success) {
      const rawProperties = result?.data || [];
      const properties = serializeDocumentArray<Property>(rawProperties);

      return {
        success: true,
        properties
      };
    } else {
      return {
        success: false,
        properties: [],
        error: result.error || 'Failed to fetch properties'
      };
    }
  } catch (error) {
    console.error('Error fetching agent properties:', error);
    return {
      success: false,
      properties: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}