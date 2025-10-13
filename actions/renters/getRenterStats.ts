'use server';

import { queryDocuments } from '@/actions/firebase/queryDocuments';

interface RenterStats {
  savedProperties: number;
  activeApplications: number;
  unreadMessages: number;
  profileViews: number;
}

interface GetRenterStatsResult {
  success: boolean;
  stats: RenterStats;
  error?: string;
}

export async function getRenterStats(renterId: string): Promise<GetRenterStatsResult> {
  try {
    // Get saved properties count
    const savedPropertiesResult = await queryDocuments({
      collectionName: 'savedProperties',
      filters: [{ field: 'renterId', operator: '==', value: renterId }]
    });

    // Get active applications count
    const activeApplicationsResult = await queryDocuments({
      collectionName: 'applications',
      filters: [
        { field: 'renterId', operator: '==', value: renterId },
        { field: 'status', operator: 'in', value: ['pending', 'under_review'] }
      ]
    });

    // Get unread messages count
    const unreadMessagesResult = await queryDocuments({
      collectionName: 'messages',
      filters: [
        { field: 'recipientId', operator: '==', value: renterId },
        { field: 'read', operator: '==', value: false }
      ]
    });

    // Get profile views count (if you have a profileViews collection)
    let profileViewsCount = 0;
    try {
      const profileViewsResult = await queryDocuments({
        collectionName: 'profileViews',
        filters: [{ field: 'viewedUserId', operator: '==', value: renterId }]
      });
      
      if (profileViewsResult.success && profileViewsResult.data) {
        profileViewsCount = profileViewsResult.data.length;
      }
    } catch (error) {
      // Profile views collection might not exist yet
      console.log('Profile views collection not found, defaulting to 0');
    }

    const stats: RenterStats = {
      savedProperties: savedPropertiesResult.success && savedPropertiesResult.data ? savedPropertiesResult.data.length : 0,
      activeApplications: activeApplicationsResult.success && activeApplicationsResult.data ? activeApplicationsResult.data.length : 0,
      unreadMessages: unreadMessagesResult.success && unreadMessagesResult.data ? unreadMessagesResult.data.length : 0,
      profileViews: profileViewsCount
    };

    return {
      success: true,
      stats
    };
  } catch (error) {
    console.error('Error getting renter stats:', error);
    return {
      success: false,
      stats: {
        savedProperties: 0,
        activeApplications: 0,
        unreadMessages: 0,
        profileViews: 0
      },
      error: error instanceof Error ? error.message : 'Failed to get renter stats'
    };
  }
}