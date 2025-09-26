'use server';

import { db, rtdb } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ref, get } from 'firebase/database';

interface GetDocumentsParams {
  collectionName: string;
  realtime?: boolean;
}

interface GetDocumentsResult {
  success: boolean;
  data?: Record<string, unknown>[];
  error?: string;
}

export async function getDocuments({ 
  collectionName, 
  realtime = false 
}: GetDocumentsParams): Promise<GetDocumentsResult> {
  try {
    if (!collectionName) {
      return {
        success: false,
        error: 'Collection name is required'
      };
    }

    let documents: Record<string, unknown>[] = [];

    if (realtime) {
      // Use Realtime Database
      const dbRef = ref(rtdb, collectionName);
      const snapshot = await get(dbRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        documents = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
      }
    } else {
      // Use Firestore
      const querySnapshot = await getDocs(collection(db, collectionName));
      documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }

    return {
      success: true,
      data: documents
    };
  } catch (error) {
    console.error('Error getting documents:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}