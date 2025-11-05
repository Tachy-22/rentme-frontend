'use client';

import { useState, useEffect, useRef } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, onValue, push, set, off, serverTimestamp } from 'firebase/database';
import { getMessages } from '@/actions/messages/getMessages';
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

interface UseRealTimeMessagesProps {
  conversationId: string | null;
  userId: string;
}

export function useRealTimeMessages({ conversationId, userId }: UseRealTimeMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesRef = useRef<any>(null);

  // Load initial messages from Firestore (with sender details)
  const loadInitialMessages = async (convId: string) => {
    if (!convId) return;
    
    setIsLoading(true);
    try {
      const result = await getMessages({ conversationId: convId });
      if (result.success && result.data) {
        setMessages(result.data);
      }
    } catch (error) {
      console.error('Error loading initial messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time listener for new messages
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    // Load initial messages first
    loadInitialMessages(conversationId);

    // Set up real-time listener for new messages
    messagesRef.current = ref(rtdb, `messages/${conversationId}`);
    
    console.log('Setting up real-time listener for conversation:', conversationId);
    
    const unsubscribe = onValue(messagesRef.current, (snapshot) => {
      console.log('Real-time update received for conversation:', conversationId);
      if (snapshot.exists()) {
        const realtimeMessages = snapshot.val();
        const messageIds = Object.keys(realtimeMessages);
        console.log('Real-time messages data:', realtimeMessages);
        console.log('Current user ID:', userId);
        
        // Get the latest message to check if it's new
        const latestMessageKey = messageIds[messageIds.length - 1];
        const latestMessage = realtimeMessages[latestMessageKey];
        
        console.log('Latest message:', latestMessage);
        
        // Always reload messages when there's an update (but add a small delay to prevent loops)
        setTimeout(() => {
          loadInitialMessages(conversationId);
        }, 100);
      } else {
        console.log('No real-time messages data exists yet for conversation:', conversationId);
      }
    });

    return () => {
      if (messagesRef.current) {
        off(messagesRef.current);
      }
    };
  }, [conversationId, userId]);

  // Send message to both Firestore and Realtime Database
  const sendMessage = async (content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!conversationId || !content.trim()) return false;

    setIsSending(true);
    try {
      // First send to Firestore via server action for proper data structure
      const result = await sendMessageAction({
        conversationId,
        content: content.trim(),
        type
      });

      if (result.success) {
        console.log('Firestore message sent successfully, now sending to RTDB...');
        
        // Also push to Realtime Database for real-time updates
        const messagesRtdbRef = ref(rtdb, `messages/${conversationId}`);
        const rtdbMessageData = {
          senderId: userId,
          content: content.trim(),
          type,
          sentAt: serverTimestamp(),
          conversationId
        };
        
        console.log('Pushing to RTDB:', rtdbMessageData);
        await push(messagesRtdbRef, rtdbMessageData);

        // Update conversation's last message in RTDB
        const conversationRtdbRef = ref(rtdb, `conversations/${conversationId}`);
        const conversationData = {
          lastMessage: content.trim(),
          lastMessageAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        console.log('Updating conversation in RTDB:', conversationData);
        await set(conversationRtdbRef, conversationData);

        console.log('Real-time message sent successfully!');
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