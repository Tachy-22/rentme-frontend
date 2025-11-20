'use server';

import { cookies } from 'next/headers';
import { queryDocuments } from '@/actions/firebase';

export async function getRenterStats() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;
    const userRole = cookieStore.get('user-role')?.value;

    if (!userId || userRole !== 'renter') {
      return {
        success: false,
        error: 'Unauthorized access'
      };
    }

    // Get saved properties count
    const savedPropertiesResult = await queryDocuments({
      collectionName: 'savedProperties',
      filters: [{ field: 'userId', operator: '==', value: userId }]
    });

    // Get applications count
    const applicationsResult = await queryDocuments({
      collectionName: 'applications',
      filters: [{ field: 'renterId', operator: '==', value: userId }]
    });

    // Get conversations count
    const conversationsResult = await queryDocuments({
      collectionName: 'conversations',
      filters: [{ field: 'participants', operator: 'array-contains', value: userId }]
    });

    // Get messages count (this week)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const messagesResult = await queryDocuments({
      collectionName: 'messages',
      filters: [
        { field: 'senderId', operator: '==', value: userId },
        { field: 'sentAt', operator: '>=', value: weekAgo.toISOString() }
      ]
    });

    const stats = {
      savedProperties: savedPropertiesResult.success ? (savedPropertiesResult.data?.length || 0) : 0,
      applications: applicationsResult.success ? (applicationsResult.data?.length || 0) : 0,
      conversations: conversationsResult.success ? (conversationsResult.data?.length || 0) : 0,
      messagesThisWeek: messagesResult.success ? (messagesResult.data?.length || 0) : 0,
      pendingApplications: applicationsResult.success ? 
        (applicationsResult.data?.filter((app: Record<string, unknown>) => app.status === 'pending').length || 0) : 0,
      approvedApplications: applicationsResult.success ? 
        (applicationsResult.data?.filter((app: Record<string, unknown>) => app.status === 'approved').length || 0) : 0
    };

    return {
      success: true,
      data: stats
    };

  } catch (error) {
    console.error('Error getting renter stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get renter stats'
    };
  }
}