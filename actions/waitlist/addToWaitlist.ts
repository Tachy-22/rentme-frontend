'use server'

import { addDocument } from '@/actions/firebase/addDocument'

interface WaitlistData {
  name: string
  email: string
}

export async function addToWaitlist(data: WaitlistData) {
  try {
    const waitlistEntry = {
      ...data,
      createdAt: new Date(),
      status: 'pending'
    }

    const result = await addDocument({
      collectionName: 'renters-waitlist',
      data: waitlistEntry
    })
    
    if (result.success) {
      return { success: true, message: 'Successfully added to waitlist!' }
    } else {
      return { success: false, message: result.error || 'Failed to add to waitlist' }
    }
  } catch (error) {
    console.error('Error adding to waitlist:', error)
    return { success: false, message: 'An error occurred while adding to waitlist' }
  }
}