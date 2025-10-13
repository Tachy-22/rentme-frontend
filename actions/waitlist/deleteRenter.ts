'use server'

import { deleteDocument } from '@/actions/firebase/deleteDocument'

export async function deleteRenter(renterId: string) {
  try {
    if (!renterId) {
      return { success: false, error: 'Renter ID is required' }
    }

    const result = await deleteDocument({
      collectionName: 'renters-waitlist',
      documentId: renterId
    })

    if (result.success) {
      return { success: true, message: 'Renter deleted successfully' }
    } else {
      return { success: false, error: result.error || 'Failed to delete renter' }
    }
  } catch (error) {
    console.error('Error deleting renter:', error)
    return { success: false, error: 'An error occurred while deleting renter' }
  }
}