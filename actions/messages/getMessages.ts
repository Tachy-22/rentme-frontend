'use server';

import { queryDocuments } from '@/actions/firebase/queryDocuments';

interface MessageData {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type?: string;
  createdAt: string;
  readBy?: string[];
}

export async function getMessages(conversationId: string) {
  try {
    const result = await queryDocuments({
      collectionName: 'messages',
      realtime: true
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error || 'Failed to fetch messages'
      };
    }

    // Filter messages by conversation ID (client-side filtering for realtime DB)
    const conversationMessages = (result.data as MessageData[]).filter((message) => 
      message.conversationId === conversationId
    );

    const messages = conversationMessages.map((message) => ({
      id: message.id,
      senderId: message.senderId,
      content: message.content,
      type: message.type || 'text',
      createdAt: message.createdAt,
      readBy: message.readBy || []
    }));

    return {
      success: true,
      messages
    };
  } catch (error) {
    console.error('Error getting messages:', error);
    return {
      success: false,
      error: 'Failed to fetch messages'
    };
  }
}