'use server';

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

export async function getUserWeeklyMessageCount(userId: string): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> {
  try {
    // Get start of current week (Monday 00:00:00)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Make Monday = 0
    
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysToSubtract);
    weekStart.setHours(0, 0, 0, 0);
    
    // Convert to Firestore Timestamp
    const weekStartTimestamp = Timestamp.fromDate(weekStart);
    
    // Query messages sent by this user this week
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('senderId', '==', userId),
      where('timestamp', '>=', weekStartTimestamp)
    );
    
    const querySnapshot = await getDocs(q);
    const messageCount = querySnapshot.size;
    
    return {
      success: true,
      count: messageCount
    };
  } catch (error) {
    console.error('Error counting weekly messages:', error);
    return {
      success: false,
      error: 'Failed to count messages'
    };
  }
}