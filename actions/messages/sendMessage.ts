'use server';

import { cookies } from 'next/headers';
import { addDocument, updateDocument } from '@/actions/firebase';

interface SendMessageParams {
  conversationId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  attachmentUrl?: string;
  propertyId?: string;
}

export async function sendMessage(params: SendMessageParams) {
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

    // Create message document
    const messageData = {
      conversationId: params.conversationId,
      senderId: userId,
      senderRole: userRole,
      content: params.content,
      type: params.type,
      attachmentUrl: params.attachmentUrl || null,
      propertyId: params.propertyId || null,
      sentAt: new Date().toISOString(),
      isRead: false,
      isEdited: false,
      editedAt: null
    };

    const messageResult = await addDocument({
      collectionName: 'messages',
      data: messageData
    });

    if (!messageResult.success) {
      return {
        success: false,
        error: 'Failed to send message'
      };
    }

    // Update conversation with last message info
    const updateResult = await updateDocument({
      collectionName: 'conversations',
      documentId: params.conversationId,
      data: {
        lastMessage: params.content,
        lastMessageAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        [`unreadCount.${userId}`]: 0, // Reset sender's unread count
      }
    });

    if (!updateResult.success) {
      console.warn('Failed to update conversation metadata');
    }

    return {
      success: true,
      messageId: messageResult.data?.id,
      data: messageResult.data
    };

  } catch (error) {
    console.error('Error sending message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message'
    };
  }
}

export async function markMessageAsRead(messageId: string) {
  try {
    const result = await updateDocument({
      collectionName: 'messages',
      documentId: messageId,
      data: {
        isRead: true,
        readAt: new Date().toISOString()
      }
    });

    return result;
  } catch (error) {
    console.error('Error marking message as read:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark message as read'
    };
  }
}