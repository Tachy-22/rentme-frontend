'use server';

import { db, rtdb } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, remove } from 'firebase/database';

interface DeleteDocumentParams {
  collectionName: string;
  documentId: string;
  realtime?: boolean;
}

interface DeleteDocumentResult {
  success: boolean;
  error?: string;
}

export async function deleteDocument({ 
  collectionName, 
  documentId, 
  realtime = false 
}: DeleteDocumentParams): Promise<DeleteDocumentResult> {
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

    if (realtime) {
      // Use Realtime Database
      const dbRef = ref(rtdb, `${collectionName}/${documentId}`);
      await remove(dbRef);
    } else {
      // Use Firestore
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting document:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}