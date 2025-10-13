'use server';

import { queryDocuments } from '@/actions/firebase/queryDocuments';
import { createConversation } from './createConversation';

interface ConversationData {
  id: string;
  participantIds: string[];
  propertyId: string;
}

export async function findOrCreateConversation(userId: string, otherUserId: string, propertyId: string) {
  try {
    // First, try to find existing conversation between these users for this property
    const result = await queryDocuments({
      collectionName: 'conversations',
      realtime: true
    });

    if (result.success && result.data) {
      // Check if any conversation includes both users for this property
      const existingConversation = (result.data as unknown as ConversationData[]).find((conv) => 
        conv.participantIds && 
        conv.participantIds.includes(userId) &&
        conv.participantIds.includes(otherUserId) &&
        conv.propertyId === propertyId
      );

      if (existingConversation) {
        return {
          success: true,
          conversationId: existingConversation.id,
          isNew: false
        };
      }
    }

    // If no existing conversation found, create a new one
    const createResult = await createConversation({
      participantIds: [userId, otherUserId],
      propertyId,
      initiatedBy: userId
    });

    if (createResult.success) {
      return {
        success: true,
        conversationId: createResult.conversationId,
        isNew: true
      };
    } else {
      return {
        success: false,
        error: createResult.error
      };
    }
  } catch (error) {
    console.error('Error finding or creating conversation:', error);
    return {
      success: false,
      error: 'Failed to find or create conversation'
    };
  }
}