'use server';

import { addDocument } from '@/actions/firebase/addDocument';

interface GoogleWaitlistData {
  uid: string;
  email: string;
  name: string;
  phoneNumber: string;
  photoURL?: string;
  provider: 'google';
}

export async function googleWaitlistSignup(data: GoogleWaitlistData) {
  try {
    // Check if user already exists in waitlist
    const { queryDocuments } = await import('@/actions/firebase/queryDocuments');
    const existingUser = await queryDocuments({
      collectionName: 'renters-waitlist',
      filters: [{ field: 'uid', operator: '==', value: data.uid }]
    });

    if (existingUser.success && existingUser.data && existingUser.data.length > 0) {
      return { 
        success: false, 
        message: 'You are already on the waitlist!',
        alreadyExists: true 
      };
    }

    // Create waitlist entry with Google user data
    const waitlistEntry = {
      uid: data.uid,
      email: data.email,
      name: data.name,
      phoneNumber: data.phoneNumber,
      photoURL: data.photoURL,
      provider: data.provider,
      createdAt: new Date().toISOString(),
      status: 'pending',
      role: 'renter' // Default role for waitlist
    };

    const result = await addDocument({
      collectionName: 'renters-waitlist',
      data: waitlistEntry
    });
    
    if (result.success) {
      return { 
        success: true, 
        message: 'Successfully joined the waitlist with Google!',
        userId: data.uid 
      };
    } else {
      return { 
        success: false, 
        message: result.error || 'Failed to join waitlist' 
      };
    }
  } catch (error) {
    console.error('Error in Google waitlist signup:', error);
    return { 
      success: false, 
      message: 'An error occurred while joining the waitlist' 
    };
  }
}