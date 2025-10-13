'use server';

import { queryDocuments } from '@/actions/firebase/queryDocuments';
import { getDocument } from '@/actions/firebase/getDocument';

interface ConversationData {
  id: string;
  participantIds: string[];
  propertyId: string;
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  unreadCounts?: Record<string, number>;
}

interface UserData {
  id: string;
  email: string;
  role: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
  };
}

interface PropertyData {
  id: string;
  title: string;
  location?: {
    address?: string;
  };
}

export async function getConversations(userId: string) {
  try {
    // Query all conversations (Realtime Database has limited filtering)
    const result = await queryDocuments({
      collectionName: 'conversations',
      realtime: true
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error || 'Failed to fetch conversations'
      };
    }

    // Filter conversations where user is a participant and enrich with participant and property data
    const userConversations = (result.data as ConversationData[]).filter((conversation) => 
      conversation.participantIds && conversation.participantIds.includes(userId)
    );

    const enrichedConversations = await Promise.all(
      userConversations.map(async (conversation) => {
        try {
          // Get the other participant (not the current user)
          const otherParticipantId = conversation.participantIds.find((id: string) => id !== userId);
          
          if (!otherParticipantId) {
            return null;
          }

          // Get participant data
          const participantResult = await getDocument({
            collectionName: 'users', 
            documentId: otherParticipantId
          });
          
          // Get property data
          const propertyResult = await getDocument({
            collectionName: 'properties', 
            documentId: conversation.propertyId
          });

          if (!participantResult.success || !propertyResult.success) {
            return null;
          }

          const participant = participantResult.data as UserData;
          const property = propertyResult.data as PropertyData;

          if (!participant || !property) {
            return null;
          }

          return {
            id: conversation.id,
            participant: {
              id: participant.id,
              name: participant.profile?.firstName && participant.profile?.lastName 
                ? `${participant.profile.firstName} ${participant.profile.lastName}`
                : participant.email,
              avatar: participant.profile?.profilePicture || '',
              role: participant.role,
              lastSeen: 'Online' // TODO: Implement real last seen
            },
            lastMessage: conversation.lastMessage ? {
              content: conversation.lastMessage.content,
              timestamp: new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              unread: conversation.unreadCounts?.[userId] > 0 || false
            } : {
              content: 'No messages yet',
              timestamp: '',
              unread: false
            },
            property: {
              title: property.title,
              address: property.location?.address || ''
            }
          };
        } catch (error) {
          console.error('Error enriching conversation:', error);
          return null;
        }
      })
    );

    // Filter out failed conversations
    const validConversations = enrichedConversations.filter(conv => conv !== null);

    return {
      success: true,
      conversations: validConversations
    };
  } catch (error) {
    console.error('Error getting conversations:', error);
    return {
      success: false,
      error: 'Failed to fetch conversations'
    };
  }
}