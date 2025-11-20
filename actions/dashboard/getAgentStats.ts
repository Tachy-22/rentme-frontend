'use server';

import { cookies } from 'next/headers';
import { queryDocuments } from '@/actions/firebase';

export async function getAgentStats() {
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

    // Get properties count
    const propertiesResult = await queryDocuments({
      collectionName: 'properties',
      filters: [
        { field: 'agentId', operator: '==', value: userId }
      ]
    });

    // Get applications count for agent's properties
    const applicationsResult = await queryDocuments({
      collectionName: 'applications',
      filters: [{ field: 'agentId', operator: '==', value: userId }]
    });

    // Get conversations count
    const conversationsResult = await queryDocuments({
      collectionName: 'conversations',
      filters: [{ field: 'participants', operator: 'array-contains', value: userId }]
    });

    // Calculate stats from properties
    const properties = propertiesResult.success 
      ? (propertiesResult.data || []).filter((prop: Record<string, unknown>) => prop.status !== 'deleted')
      : [];
    const totalViews = properties.reduce((sum: number, prop: Record<string, unknown>) => sum + ((prop.viewCount as number) || 0), 0);
    const totalInquiries = properties.reduce((sum: number, prop: Record<string, unknown>) => sum + ((prop.inquiries as number) || 0), 0);
    
    // Properties added this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const propertiesThisWeek = properties.filter((prop: Record<string, unknown>) => 
      new Date(prop.createdAt as string) >= weekAgo
    ).length;

    const stats = {
      totalProperties: properties.length,
      activeProperties: properties.filter((prop: Record<string, unknown>) => prop.status === 'available').length,
      rentedProperties: properties.filter((prop: Record<string, unknown>) => prop.status === 'rented').length,
      totalViews,
      totalInquiries,
      applications: applicationsResult.success ? (applicationsResult.data?.length || 0) : 0,
      conversations: conversationsResult.success ? (conversationsResult.data?.length || 0) : 0,
      propertiesThisWeek,
      pendingApplications: applicationsResult.success ? 
        (applicationsResult.data?.filter((app: Record<string, unknown>) => app.status === 'pending').length || 0) : 0,
      approvedApplications: applicationsResult.success ? 
        (applicationsResult.data?.filter((app: Record<string, unknown>) => app.status === 'approved').length || 0) : 0,
      averageRating: 4.5, // TODO: Calculate from reviews
    };

    return {
      success: true,
      data: stats
    };

  } catch (error) {
    console.error('Error getting agent stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get agent stats'
    };
  }
}