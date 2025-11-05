'use client';

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, Unsubscribe, doc, getDoc } from 'firebase/firestore';
import { sendMessage as sendMessageAction } from '@/actions/messages/sendMessage';
import { toast } from 'sonner';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  attachmentUrl?: string;
  sentAt: string;
  isRead: boolean;
  isOwn: boolean;
  sender: {
    id: string;
    name: string;
    profilePicture?: string;
    role: string;
    verificationStatus: string;
  };
}

interface UseFirestoreRealTimeMessagesProps {
  conversationId: string | null;
  userId: string;
}

export function useFirestoreRealTimeMessages({ conversationId, userId }: UseFirestoreRealTimeMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  // Get sender details from Firestore
  const enrichMessageWithSender = async (message: any): Promise<Message> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', message.senderId));
      let sender = {
        id: message.senderId,
        name: 'Unknown User',
        profilePicture: null,
        role: 'user',
        verificationStatus: 'unverified'
      };

      if (userDoc.exists()) {
        const userData = userDoc.data();
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
        id: message.id,
        sender,
        isOwn: message.senderId === userId
      };
    } catch (error) {
      console.error('Error enriching message with sender:', error);
      return {
        ...message,
        id: message.id,
        sender: {
          id: message.senderId,
          name: 'Unknown User',
          profilePicture: null,
          role: 'user',
          verificationStatus: 'unverified'
        },
        isOwn: message.senderId === userId
      };
    }
  };

  // Set up real-time listener for messages
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    setIsLoading(true);
    console.log('Setting up Firestore real-time listener for conversation:', conversationId);

    // Clean up previous listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Create query for messages in this conversation
    const messagesQuery = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('sentAt', 'asc')
    );

    // Set up real-time listener
    unsubscribeRef.current = onSnapshot(messagesQuery, async (snapshot) => {
      console.log('Firestore real-time update received:', snapshot.docs.length, 'messages');
      
      const messagePromises = snapshot.docs.map(async (doc) => {
        const messageData = { id: doc.id, ...doc.data() };
        return await enrichMessageWithSender(messageData);
      });

      const enrichedMessages = await Promise.all(messagePromises);
      setMessages(enrichedMessages);
      setIsLoading(false);
    }, (error) => {
      console.error('Error in Firestore real-time listener:', error);
      setIsLoading(false);
      toast.error('Failed to load messages');
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [conversationId, userId]);

  // Send message
  const sendMessage = async (content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!conversationId || !content.trim()) return false;

    setIsSending(true);
    try {
      console.log('Sending message via Firestore...');
      const result = await sendMessageAction({
        conversationId,
        content: content.trim(),
        type
      });

      if (result.success) {
        console.log('Message sent successfully!');
        // The real-time listener will automatically pick up the new message
        return true;
      } else {
        toast.error(result.error || 'Failed to send message');
        return false;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return {
    messages,
    isLoading,
    isSending,
    sendMessage
  };
}