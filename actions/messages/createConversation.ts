'use server';

import { cookies } from 'next/headers';
import { addDocument, queryDocuments } from '@/actions/firebase';

interface CreateConversationParams {
  participantId: string;
  propertyId?: string;
  initialMessage?: string;
}

export async function createConversation(params: CreateConversationParams) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;
    const userRole = cookieStore.get('user-role')?.value;

    if (!userId || !userRole) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Check if conversation already exists
    const existingResult = await queryDocuments({
      collectionName: 'conversations',
      filters: [
        { field: 'participants', operator: 'array-contains', value: userId }
      ]
    });

    if (existingResult.success && existingResult.data) {
      // Find conversation with both participants
      const existingConversation = existingResult.data.find((conv: Record<string, unknown>) => 
        (conv.participants as string[]).includes(params.participantId)
      );

      if (existingConversation) {
        return {
          success: true,
          conversationId: existingConversation.id,
          data: existingConversation
        };
      }
    }

    // Create new conversation
    const conversationData = {
      participants: [userId, params.participantId],
      propertyId: params.propertyId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessage: params.initialMessage || null,
      lastMessageAt: params.initialMessage ? new Date().toISOString() : null,
      unreadCount: {
        [userId]: 0,
        [params.participantId]: params.initialMessage ? 1 : 0
      },
      isActive: true
    };

    const result = await addDocument({
      collectionName: 'conversations',
      data: conversationData
    });

    if (!result.success) {
      return {
        success: false,
        error: 'Failed to create conversation'
      };
    }

    // Send initial message if provided
    if (params.initialMessage && result.id) {
      const { sendMessage } = await import('./sendMessage');
      await sendMessage({
        conversationId: result.id,
        content: params.initialMessage,
        type: 'text'
      });
    }

    return {
      success: true,
      conversationId: result.id,
      data: result.data
    };

  } catch (error) {
    console.error('Error creating conversation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create conversation'
    };
  }
}

export async function findOrCreateConversation(params: CreateConversationParams) {
  return createConversation(params);
}