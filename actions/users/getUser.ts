'use server';

import { getDocument } from '@/actions/firebase/getDocument';
import { User } from '@/types';

interface GetUserResult {
  success: boolean;
  user?: User;
  error?: string;
}

export async function getUser(userId: string): Promise<GetUserResult> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    const result = await getDocument({
      collectionName: 'users',
      documentId: userId
    });

    if (result.success && result.data) {
      const user = result.data as unknown as User;
      return {
        success: true,
        user
      };
    } else {
      return {
        success: false,
        error: result.error || 'User not found'
      };
    }
  } catch (error) {
    console.error('Error getting user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}