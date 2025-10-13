'use server'

import { queryDocuments } from '@/actions/firebase/queryDocuments'

export async function getWaitlistData() {
  try {
    const result = await queryDocuments({
      collectionName: 'renters-waitlist',
      orderByField: 'createdAt',
      orderDirection: 'desc'
    })

    if (result.success) {
      return { success: true, data: result.data }
    } else {
      return { success: false, error: result.error || 'Failed to fetch waitlist data' }
    }
  } catch (error) {
    console.error('Error fetching waitlist data:', error)
    return { success: false, error: 'An error occurred while fetching waitlist data' }
  }
}