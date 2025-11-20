'use server';

import { cookies } from 'next/headers';
import { queryDocuments, getDocument } from '@/actions/firebase';

export async function getConversations() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;

    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Get all conversations where user is a participant
    const result = await queryDocuments({
      collectionName: 'conversations',
      filters: [
        { field: 'participants', operator: 'array-contains', value: userId }
      ],
      orderByField: 'updatedAt',
      orderDirection: 'desc'
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        error: 'Failed to fetch conversations'
      };
    }

    // Enrich conversations with participant details
    const enrichedConversations = await Promise.all(
      result.data.map(async (conversation: Record<string, unknown>) => {
        const otherParticipantId = conversation.participants.find((id: string) => id !== userId);
        
        if (!otherParticipantId) {
          return conversation;
        }

        // Get other participant details
        const participantResult = await getDocument({
          collectionName: 'users',
          documentId: otherParticipantId
        });

        let otherParticipant = null;
        if (participantResult.success && participantResult.data) {
          const userData = participantResult.data as any;
          const firstName = userData.profile?.firstName || '';
          const lastName = userData.profile?.lastName || '';
          const fullName = `${firstName} ${lastName}`.trim() || userData.name || 'Unknown User';
          
          otherParticipant = {
            id: otherParticipantId,
            name: fullName,
            profilePicture: userData.profile?.profilePicture || null,
            role: userData.role,
            verificationStatus: userData.profile?.verificationStatus || 'unverified',
            isOnline: userData.lastSeen ? 
              (new Date().getTime() - new Date(userData.lastSeen).getTime()) < 300000 : false // 5 minutes
          };
        }

        // Get property details if conversation is about a property
        let property = null;
        if (conversation.propertyId) {
          const propertyResult = await getDocument({
            collectionName: 'properties',
            documentId: conversation.propertyId
          });

          if (propertyResult.success && propertyResult.data) {
            property = {
              id: conversation.propertyId,
              title: propertyResult.data.title,
              price: propertyResult.data.price,
              images: propertyResult.data.images || []
            };
          }
        }

        return {
          ...conversation,
          otherParticipant,
          property,
          unreadCount: conversation.unreadCount?.[userId] || 0
        };
      })
    );

    return {
      success: true,
      data: enrichedConversations
    };

  } catch (error) {
    console.error('Error getting conversations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get conversations'
    };
  }
}