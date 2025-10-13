'use server';

import { cookies } from 'next/headers';
import { getDocument } from '@/actions/firebase/getDocument';
import { serializeUserData } from '@/lib/firestore-serializer';
import { User } from '@/types';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    // In a real implementation, you would verify the JWT token
    // For now, we'll extract the user ID from the cookie
    const userIdCookie = cookieStore.get('user-id')?.value;
    
    if (!userIdCookie) {
      return null;
    }

    // Get user document from Firestore
    const userDoc = await getDocument({
      collectionName: 'users',
      documentId: userIdCookie
    });

    if (userDoc.success && userDoc.data) {
      const userData = userDoc.data as Record<string, unknown>;
      
      // The data should already be serialized by getDocument
      return {
        id: userIdCookie,
        ...userData
      } as User;
    }

    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}