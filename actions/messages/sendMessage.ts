'use server';

import { addDocument } from '@/actions/firebase/addDocument';
import { updateDocument } from '@/actions/firebase/updateDocument';

interface SendMessageParams {
  conversationId: string;
  senderId: string;
  content: string;
  type?: 'text' | 'image' | 'file';
}

export async function sendMessage(params: SendMessageParams) {
  try {
    const messageData = {
      conversationId: params.conversationId,
      senderId: params.senderId,
      content: params.content,
      type: params.type || 'text',
      createdAt: new Date(),
      readBy: [params.senderId]
    };

    // Add message to messages collection
    const messageResult = await addDocument({
      collectionName: 'messages',
      data: messageData,
      realtime: true
    });
    
    if (!messageResult.success) {
      return {
        success: false,
        error: messageResult.error
      };
    }

    // Update conversation with last message info
    const conversationUpdate = {
      lastMessage: {
        id: messageResult.id,
        content: params.content,
        senderId: params.senderId,
        createdAt: new Date()
      },
      lastMessageAt: new Date()
    };

    const conversationResult = await updateDocument({
      collectionName: 'conversations',
      documentId: params.conversationId,
      data: conversationUpdate,
      realtime: true
    });
    
    return {
      success: true,
      messageId: messageResult.id
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      success: false,
      error: 'Failed to send message'
    };
  }
}