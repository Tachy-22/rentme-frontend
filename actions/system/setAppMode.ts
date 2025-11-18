'use server';

import { db } from '@/lib/firebase-admin';

interface SetAppModeResult {
  success: boolean;
  error?: string;
}

export async function setAppMode(mode: 'live' | 'waitlist', adminId: string = 'admin'): Promise<SetAppModeResult> {
  try {
    // Validate mode
    if (mode !== 'live' && mode !== 'waitlist') {
      return {
        success: false,
        error: 'Invalid mode. Must be "live" or "waitlist"'
      };
    }

    const docRef = db.collection('systemSettings').doc('appMode');
    
    await docRef.set({
      mode,
      updatedAt: new Date(),
      updatedBy: adminId
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Error setting app mode:', error);
    return {
      success: false,
      error: 'Failed to set app mode'
    };
  }
}