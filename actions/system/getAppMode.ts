'use server';

import { db } from '@/lib/firebase-admin';

interface AppModeResult {
  success: boolean;
  mode?: 'live' | 'waitlist';
  error?: string;
}

export async function getAppMode(): Promise<AppModeResult> {
  try {
    const docRef = db.collection('systemSettings').doc('appMode');
    const doc = await docRef.get();

    if (!doc.exists) {
      // If no document exists, create it with default mode
      const defaultMode = (process.env.NEXT_PUBLIC_DEFAULT_APP_MODE as 'live' | 'waitlist') || 'waitlist';
      
      await docRef.set({
        mode: defaultMode,
        updatedAt: new Date(),
        updatedBy: 'system-init'
      });

      return {
        success: true,
        mode: defaultMode
      };
    }

    const data = doc.data();
    
    return {
      success: true,
      mode: data?.mode || 'waitlist'
    };
  } catch (error) {
    console.error('Error getting app mode:', error);
    return {
      success: false,
      error: 'Failed to get app mode'
    };
  }
}