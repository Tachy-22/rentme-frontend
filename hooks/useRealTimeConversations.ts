'use client';

import { useState, useEffect, useRef } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, onValue, off } from 'firebase/database';
import { getConversations } from '@/actions/messages/getConversations';
import { toast } from 'sonner';

interface Conversation {
  id: string;
  participants: string[];
  propertyId?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  otherParticipant: {
    id: string;
    name: string;
    profilePicture?: string;
    role: string;
    verificationStatus: string;
    isOnline: boolean;
  };
  property?: {
    id: string;
    title: string;
    price: { amount: number; currency: string };
    images: Array<{ url: string }>;
  };
}

interface UseRealTimeConversationsProps {
  userId: string;
  initialConversations: Conversation[];
}

export function useRealTimeConversations({ userId, initialConversations }: UseRealTimeConversationsProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [isLoading, setIsLoading] = useState(false);
  const conversationsRef = useRef<any>(null);

  // Load conversations from Firestore (with full participant details)
  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const result = await getConversations();
      if (result.success && result.data) {
        setConversations(result.data);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time listener for conversation updates
  useEffect(() => {
    if (!userId) return;

    // Set up real-time listener for conversation updates
    conversationsRef.current = ref(rtdb, 'conversations');
    
    const unsubscribe = onValue(conversationsRef.current, (snapshot) => {
      if (snapshot.exists()) {
        // When any conversation is updated, reload all conversations
        // This ensures we get the latest lastMessage updates
        loadConversations();
      }
    });

    return () => {
      if (conversationsRef.current) {
        off(conversationsRef.current);
      }
    };
  }, [userId]);

  return {
    conversations,
    isLoading,
    loadConversations
  };
}