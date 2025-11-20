'use server';

import { cookies } from 'next/headers';
import { queryDocuments } from '@/actions/firebase';

export async function getRenterDashboardData() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;
    const userRole = cookieStore.get('user-role')?.value;

    if (!userId || userRole !== 'renter') {
      return { success: false, error: 'Unauthorized access' };
    }

    // Get stats in parallel
    const [
      savedPropertiesResult,
      applicationsResult,
      conversationsResult
    ] = await Promise.all([
      // Get saved properties count
      queryDocuments({
        collectionName: 'saved_properties',
        filters: [{ field: 'userId', operator: '==', value: userId }],
        limitCount: 1000
      }),
      // Get applications count
      queryDocuments({
        collectionName: 'applications',
        filters: [{ field: 'renterId', operator: '==', value: userId }],
        limitCount: 1000
      }),
      // Get conversations count
      queryDocuments({
        collectionName: 'conversations',
        filters: [{ field: 'participants', operator: 'array-contains', value: userId }],
        limitCount: 1000
      })
    ]);

    // Calculate stats
    const savedProperties = savedPropertiesResult.success ? (savedPropertiesResult.data?.length || 0) : 0;
    const applications = applicationsResult.success ? (applicationsResult.data?.length || 0) : 0;
    const conversations = conversationsResult.success ? (conversationsResult.data?.length || 0) : 0;
    
    // Calculate pending and approved applications
    const applicationData = applicationsResult.success ? (applicationsResult.data || []) : [];
    const pendingApplications = applicationData.filter((app: Record<string, unknown>) => app.status === 'pending').length;
    const approvedApplications = applicationData.filter((app: Record<string, unknown>) => app.status === 'approved').length;

    // Calculate messages this week (simplified for now)
    const messagesThisWeek = conversations * 2; // Rough estimate

    const stats = {
      savedProperties,
      applications,
      conversations,
      messagesThisWeek,
      pendingApplications,
      approvedApplications
    };

    // Get recent activities (simplified - based on recent applications and property views)
    const recentActivities = [];
    
    // Add recent applications to activities
    const recentApplications = applicationData
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) => new Date(b.submittedAt as string).getTime() - new Date(a.submittedAt as string).getTime())
      .slice(0, 2);
    
    for (const app of recentApplications) {
      recentActivities.push({
        id: `app-${app.id}`,
        type: 'application',
        title: `Application ${app.status}`,
        description: `Application for property`,
        time: getRelativeTime(app.submittedAt),
        icon: 'FileText'
      });
    }

    // Get recommended properties (recent available properties matching user preferences)
    const recommendedPropertiesResult = await queryDocuments({
      collectionName: 'properties',
      filters: [
        { field: 'status', operator: '==', value: 'available' }
      ],
      orderByField: 'createdAt',
      orderDirection: 'desc',
      limitCount: 4
    });

    const recommendedProperties = recommendedPropertiesResult.success 
      ? (recommendedPropertiesResult.data || []).slice(0, 2)
      : [];

    return {
      success: true,
      data: {
        stats,
        recentActivities,
        recommendedProperties
      }
    };

  } catch (error) {
    console.error('Error getting renter dashboard data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get dashboard data'
    };
  }
}

function getRelativeTime(dateString: string | unknown): string {
  if (typeof dateString !== 'string') return 'Unknown time';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  } catch {
    return 'Unknown time';
  }
}