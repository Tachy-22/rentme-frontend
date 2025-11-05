'use server';

import { cookies } from 'next/headers';
import { getDocument } from '@/actions/firebase/getDocument';
import { User } from '@/types';

interface GetCurrentUserResult {
  success: boolean;
  user?: User;
  error?: string;
}

export async function getCurrentUser(): Promise<GetCurrentUserResult> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;

    if (!userId) {
      return {
        success: false,
        error: 'No user ID found'
      };
    }

    const result = await getDocument({
      collectionName: 'users',
      documentId: userId,
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Convert Firestore timestamps to strings
    const rawData = result.data as Record<string, unknown>;
    const serializedData = { ...rawData };

    // Handle common Firestore Timestamp fields
    if (serializedData.createdAt && typeof serializedData.createdAt === 'object' && serializedData.createdAt !== null) {
      const timestamp = serializedData.createdAt as { seconds: number; nanoseconds: number };
      if ('seconds' in timestamp && 'nanoseconds' in timestamp) {
        serializedData.createdAt = new Date(timestamp.seconds * 1000).toISOString();
      }
    }

    if (serializedData.updatedAt && typeof serializedData.updatedAt === 'object' && serializedData.updatedAt !== null) {
      const timestamp = serializedData.updatedAt as { seconds: number; nanoseconds: number };
      if ('seconds' in timestamp && 'nanoseconds' in timestamp) {
        serializedData.updatedAt = new Date(timestamp.seconds * 1000).toISOString();
      }
    }

    if (serializedData.lastLoginAt && typeof serializedData.lastLoginAt === 'object' && serializedData.lastLoginAt !== null) {
      const timestamp = serializedData.lastLoginAt as { seconds: number; nanoseconds: number };
      if ('seconds' in timestamp && 'nanoseconds' in timestamp) {
        serializedData.lastLoginAt = new Date(timestamp.seconds * 1000).toISOString();
      }
    }

    const user = {
      id: userId,
      ...serializedData,
    } as User;

    return {
      success: true,
      user
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}