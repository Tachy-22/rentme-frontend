'use server';

import { addDocument } from '@/actions/firebase/addDocument';

interface CreateConversationParams {
  participantIds: string[];
  propertyId: string;
  initiatedBy: string;
}

export async function createConversation(params: CreateConversationParams) {
  try {
    const conversationData = {
      participantIds: params.participantIds,
      propertyId: params.propertyId,
      initiatedBy: params.initiatedBy,
      createdAt: new Date(),
      lastMessageAt: new Date(),
      lastMessage: null,
      unreadCounts: params.participantIds.reduce((acc, id) => {
        acc[id] = 0;
        return acc;
      }, {} as Record<string, number>)
    };

    const result = await addDocument({
      collectionName: 'conversations',
      data: conversationData,
      realtime: true
    });

    if (result.success) {
      return {
        success: true,
        conversationId: result.id
      };
    } else {
      return {
        success: false,
        error: result.error
      };
    }
  } catch (error) {
    console.error('Error creating conversation:', error);
    return {
      success: false,
      error: 'Failed to create conversation'
    };
  }
}