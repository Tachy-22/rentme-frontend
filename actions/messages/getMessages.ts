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

    const conversation = conversationResult.data as Record<string, unknown>;
    const participants = conversation.participants as string[] | undefined;
    if (!participants?.includes(userId)) {
      return {
        success: false,
        error: 'Unauthorized access to conversation'
      };
    }

    // Get messages for this conversation
    const queryOptions: {
      collectionName: string;
      filters: Array<{ field: string; operator: string; value: string }>;
      orderByField: string;
      orderDirection: string;
      limitCount: number;
    } = {
      collectionName: 'messages',
      filters: [
        { field: 'conversationId', operator: '==', value: params.conversationId }
      ],
      orderByField: 'sentAt',
      orderDirection: 'desc' as const,
      limitCount: params.limit || 50
    };

    const result = await queryDocuments({
      ...queryOptions,
      orderDirection: queryOptions.orderDirection as 'desc',
      filters: queryOptions.filters.map(f => ({
        ...f,
        operator: f.operator as '=='
      }))
    });

    if (!result.success) {
      return {
        success: false,
        error: 'Failed to fetch messages'
      };
    }

    // Enrich messages with sender details
    const enrichedMessages = await Promise.all(
      (result.data || []).map(async (message: Record<string, unknown>) => {
        // Get sender details
        const senderResult = await getDocument({
          collectionName: 'users',
          documentId: message.senderId as string
        });

        let sender = null;
        if (senderResult.success && senderResult.data) {
          const userData = senderResult.data as Record<string, unknown>;
          const profile = userData.profile as Record<string, unknown> | undefined;
          const firstName = profile?.firstName || '';
          const lastName = profile?.lastName || '';
          const fullName = `${firstName} ${lastName}`.trim() || userData.name || 'Unknown User';
          
          sender = {
            id: message.senderId,
            name: fullName,
            profilePicture: (userData.profile as Record<string, unknown>)?.profilePicture as string || null,
            role: userData.role,
            verificationStatus: (userData.profile as Record<string, unknown>)?.verificationStatus as string || 'unverified'
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
        otherParticipantId: (conversation.participants as string[]).find((id: string) => id !== userId)
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