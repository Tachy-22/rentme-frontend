'use server';

import { db, rtdb } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ref, get } from 'firebase/database';
import { serializeFirestoreData } from '@/lib/firestore-serializer';

interface GetDocumentParams {
  collectionName: string;
  documentId: string;
  realtime?: boolean;
}

interface GetDocumentResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

export async function getDocument({ 
  collectionName, 
  documentId, 
  realtime = false 
}: GetDocumentParams): Promise<GetDocumentResult> {
  try {
    if (!collectionName) {
      return {
        success: false,
        error: 'Collection name is required'
      };
    }

    if (!documentId) {
      return {
        success: false,
        error: 'Document ID is required'
      };
    }

    let data: Record<string, unknown> | undefined;

    if (realtime) {
      // Use Realtime Database
      const dbRef = ref(rtdb, `${collectionName}/${documentId}`);
      const snapshot = await get(dbRef);
      
      if (snapshot.exists()) {
        data = {
          id: documentId,
          ...snapshot.val()
        };
      }
    } else {
      // Use Firestore
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const rawData = {
          id: docSnap.id,
          ...docSnap.data()
        };
        // Serialize all Firestore timestamps to prevent client-side issues
        data = serializeFirestoreData(rawData) as Record<string, unknown>;
      }
    }

    if (!data) {
      return {
        success: false,
        error: 'Document not found'
      };
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error getting document:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}