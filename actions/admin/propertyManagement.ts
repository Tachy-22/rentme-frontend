'use server';

import { cookies } from 'next/headers';
import { queryDocuments, updateDocument, deleteDocument, getDocument } from '@/actions/firebase';

export async function getAllProperties() {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('user-role')?.value;

    if (userRole !== 'admin') {
      return {
        success: false,
        error: 'Unauthorized access'
      };
    }

    const result = await queryDocuments({
      collectionName: 'properties',
      orderByField: 'createdAt',
      orderDirection: 'desc'
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        error: 'Failed to fetch properties'
      };
    }

    // Enrich with agent details
    const enrichedProperties = await Promise.all(
      result.data.map(async (property: Record<string, unknown>) => {
        const agentResult = await getDocument({
          collectionName: 'users',
          documentId: property.agentId
        });

        let agent = null;
        if (agentResult.success && agentResult.data) {
          const agentData = agentResult.data as any;
          agent = {
            id: property.agentId,
            name: agentData.profile?.firstName && agentData.profile?.lastName 
              ? `${agentData.profile.firstName} ${agentData.profile.lastName}`
              : agentData.profile?.fullName || 'Unknown Agent',
            email: agentData.email,
            company: agentData.profile?.company || null,
            verificationStatus: agentData.profile?.verificationStatus || 'unverified'
          };
        }

        return {
          ...property,
          agent
        };
      })
    );

    return {
      success: true,
      data: enrichedProperties
    };

  } catch (error) {
    console.error('Error getting all properties:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get properties'
    };
  }
}

export async function getPropertyStats() {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('user-role')?.value;

    if (userRole !== 'admin') {
      return {
        success: false,
        error: 'Unauthorized access'
      };
    }

    const result = await queryDocuments({
      collectionName: 'properties'
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        error: 'Failed to fetch property stats'
      };
    }

    const properties = result.data;
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const stats = {
      total: properties.length,
      available: properties.filter((p: Record<string, unknown>) => p.status === 'available').length,
      rented: properties.filter((p: Record<string, unknown>) => p.status === 'rented').length,
      pending: properties.filter((p: Record<string, unknown>) => p.status === 'pending').length,
      maintenance: properties.filter((p: Record<string, unknown>) => p.status === 'maintenance').length,
      thisWeek: properties.filter((p: Record<string, unknown>) => {
        const propertyDate = new Date(p.createdAt);
        return propertyDate >= weekAgo;
      }).length,
      totalViews: properties.reduce((sum: number, p: Record<string, unknown>) => sum + (p.viewCount || 0), 0),
      averagePrice: properties.length > 0 
        ? Math.round(properties.reduce((sum: number, p: Record<string, unknown>) => sum + (p.price?.amount || 0), 0) / properties.length)
        : 0
    };

    return {
      success: true,
      data: stats
    };

  } catch (error) {
    console.error('Error getting property stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get property stats'
    };
  }
}

interface UpdatePropertyStatusParams {
  propertyId: string;
  status: 'available' | 'rented' | 'pending' | 'maintenance' | 'deleted';
  reason?: string;
}

export async function updatePropertyStatus(params: UpdatePropertyStatusParams) {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('user-id')?.value;
    const userRole = cookieStore.get('user-role')?.value;

    if (userRole !== 'admin') {
      return {
        success: false,
        error: 'Unauthorized access'
      };
    }

    const result = await updateDocument({
      collectionName: 'properties',
      documentId: params.propertyId,
      data: {
        status: params.status,
        ...(params.reason && { adminNotes: params.reason }),
        ...(params.status === 'deleted' && { deletedAt: new Date().toISOString(), deletedBy: adminId }),
        updatedAt: new Date().toISOString()
      }
    });

    if (!result.success) {
      return {
        success: false,
        error: 'Failed to update property status'
      };
    }

    return {
      success: true,
      message: `Property status updated to ${params.status} successfully`
    };

  } catch (error) {
    console.error('Error updating property status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update property status'
    };
  }
}

export async function deleteProperty(propertyId: string) {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('user-role')?.value;

    if (userRole !== 'admin') {
      return {
        success: false,
        error: 'Unauthorized access'
      };
    }

    const result = await deleteDocument({
      collectionName: 'properties',
      documentId: propertyId
    });

    if (!result.success) {
      return {
        success: false,
        error: 'Failed to delete property'
      };
    }

    return {
      success: true,
      message: 'Property deleted successfully'
    };

  } catch (error) {
    console.error('Error deleting property:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete property'
    };
  }
}