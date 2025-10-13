'use server';

import { cookies } from 'next/headers';

export async function logout(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    
    // Remove auth cookies
    cookieStore.delete('auth-token');
    cookieStore.delete('user-id');
    
    return { success: true };
  } catch (error) {
    console.error('Error during logout:', error);
    return { success: false };
  }
}