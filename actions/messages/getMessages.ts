'use server';

import { cookies } from 'next/headers';
import { queryDocuments, getDocument } from '@/actions/firebase';

interface GetMessagesParams {
  conversationId: string;
  limit?: number;
  lastMessageId?: string;
}

export async function getMessages(params: GetMessagesParams) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;

    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Verify user is participant in conversation
    const conversationResult = await getDocument({
      collectionName: 'conversations',
      documentId: params.conversationId
    });

    if (!conversationResult.success || !conversationResult.data) {
      return {
        success: false,
        error: 'Conversation not found'
      };
    }

    const conversation = conversationResult.data as any;
    if (!conversation.participants.includes(userId)) {
      return {
        success: false,
        error: 'Unauthorized access to conversation'
      };
    }

    // Get messages for this conversation
    const queryOptions: any = {
      collectionName: 'messages',
      filters: [
        { field: 'conversationId', operator: '==', value: params.conversationId }
      ],
      orderByField: 'sentAt',
      orderDirection: 'desc',
      limitCount: params.limit || 50
    };

    const result = await queryDocuments(queryOptions);

    if (!result.success) {
      return {
        success: false,
        error: 'Failed to fetch messages'
      };
    }

    // Enrich messages with sender details
    const enrichedMessages = await Promise.all(
      (result.data || []).map(async (message: any) => {
        // Get sender details
        const senderResult = await getDocument({
          collectionName: 'users',
          documentId: message.senderId
        });

        let sender = null;
        if (senderResult.success && senderResult.data) {
          const userData = senderResult.data as any;
          const firstName = userData.profile?.firstName || '';
          const lastName = userData.profile?.lastName || '';
          const fullName = `${firstName} ${lastName}`.trim() || userData.name || 'Unknown User';
          
          sender = {
            id: message.senderId,
            name: fullName,
            profilePicture: userData.profile?.profilePicture || null,
            role: userData.role,
            verificationStatus: userData.profile?.verificationStatus || 'unverified'
          };
        }

        return {
          ...message,
          sender,
          isOwn: message.senderId === userId
        };
      })
    );

    // Reverse to get chronological order (oldest first)
    enrichedMessages.reverse();

    return {
      success: true,
      data: enrichedMessages,
      conversation: {
        ...conversation,
        otherParticipantId: conversation.participants.find((id: string) => id !== userId)
      }
    };

  } catch (error) {
    console.error('Error getting messages:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get messages'
    };
  }
}