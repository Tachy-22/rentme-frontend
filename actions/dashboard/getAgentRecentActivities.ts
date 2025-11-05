'use server';

import { cookies } from 'next/headers';
import { queryDocuments, getDocument } from '@/actions/firebase';
import { DashboardActivity } from '@/types';

export async function getAgentRecentActivities(): Promise<{
  success: boolean;
  data?: DashboardActivity[];
  error?: string;
}> {
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

    const activities: DashboardActivity[] = [];

    // Get recent applications (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const applicationsResult = await queryDocuments({
      collectionName: 'applications',
      filters: [
        { field: 'agentId', operator: '==', value: userId }
      ],
      orderByField: 'submittedAt',
      orderDirection: 'desc',
      limitCount: 10
    });

    if (applicationsResult.success && applicationsResult.data) {
      for (const application of applicationsResult.data) {
        const submittedDate = new Date(application.submittedAt as string);
        if (submittedDate >= sevenDaysAgo) {
          // Get property details
          const propertyResult = await getDocument({
            collectionName: 'properties',
            documentId: application.propertyId as string
          });

          if (propertyResult.success && propertyResult.data) {
            const property = propertyResult.data;
            const personalInfo = application.personalInfo as any;
            const firstName = personalInfo?.firstName || 'Someone';
            activities.push({
              id: `app-${application.id}`,
              type: 'new_application',
              title: 'New application received',
              description: `${firstName} applied for ${property.title as string}`,
              timestamp: application.submittedAt as string,
              actionUrl: `/agent/applications`
            });
          }
        }
      }
    }

    // Get recent conversations (last 7 days)
    const conversationsResult = await queryDocuments({
      collectionName: 'conversations',
      filters: [
        { field: 'participants', operator: 'array-contains', value: userId }
      ],
      orderByField: 'updatedAt',
      orderDirection: 'desc',
      limitCount: 10
    });

    if (conversationsResult.success && conversationsResult.data) {
      for (const conversation of conversationsResult.data) {
        const updatedDate = new Date(conversation.updatedAt as string);
        const lastMessage = conversation.lastMessage as any;
        if (updatedDate >= sevenDaysAgo && lastMessage) {
          // Only show if the last message was from someone else
          if (lastMessage.senderId !== userId) {
            // Get other participant details
            const participants = conversation.participants as string[];
            const otherParticipantId = participants.find((id: string) => id !== userId);
            if (otherParticipantId) {
              const participantResult = await getDocument({
                collectionName: 'users',
                documentId: otherParticipantId
              });

              if (participantResult.success && participantResult.data) {
                const participant = participantResult.data;
                const profile = participant.profile as any;
                const participantName = profile?.firstName || 'Someone';
                
                activities.push({
                  id: `msg-${conversation.id}`,
                  type: 'new_inquiry',
                  title: `New message from ${participantName}`,
                  description: lastMessage.content.length > 50 
                    ? `${lastMessage.content.substring(0, 50)}...`
                    : lastMessage.content,
                  timestamp: lastMessage.sentAt as string,
                  actionUrl: `/agent/messages`
                });
              }
            }
          }
        }
      }
    }

    // Get recently created properties (last 7 days)
    const propertiesResult = await queryDocuments({
      collectionName: 'properties',
      filters: [
        { field: 'agentId', operator: '==', value: userId }
      ],
      orderByField: 'createdAt',
      orderDirection: 'desc',
      limitCount: 10 // Get more to compensate for filtering
    });

    if (propertiesResult.success && propertiesResult.data) {
      const nonDeletedProperties = propertiesResult.data.filter((p: any) => p.status !== 'deleted');
      for (const property of nonDeletedProperties) {
        const createdDate = new Date(property.createdAt as string);
        if (createdDate >= sevenDaysAgo) {
          activities.push({
            id: `prop-${property.id}`,
            type: 'property_viewed',
            title: 'Property listed successfully',
            description: `${property.title as string} is now live and available for viewing`,
            timestamp: property.createdAt as string,
            actionUrl: `/properties/${property.id}`
          });
        }
      }
    }

    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Return only the 5 most recent activities
    return {
      success: true,
      data: activities.slice(0, 5)
    };

  } catch (error) {
    console.error('Error getting agent recent activities:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get recent activities'
    };
  }
}