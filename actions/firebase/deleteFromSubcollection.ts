'use server';

import { db, rtdb } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, remove } from 'firebase/database';

interface DeleteFromSubcollectionParams {
  collectionName: string;
  documentId: string;
  subcollectionName: string;
  subdocumentId: string;
  realtime?: boolean;
}

interface DeleteFromSubcollectionResult {
  success: boolean;
  error?: string;
}

export async function deleteFromSubcollection({ 
  collectionName, 
  documentId, 
  subcollectionName, 
  subdocumentId, 
  realtime = false 
}: DeleteFromSubcollectionParams): Promise<DeleteFromSubcollectionResult> {
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

    if (!subcollectionName) {
      return {
        success: false,
        error: 'Subcollection name is required'
      };
    }

    if (!subdocumentId) {
      return {
        success: false,
        error: 'Subdocument ID is required'
      };
    }

    if (realtime) {
      // Use Realtime Database
      const dbRef = ref(rtdb, `${collectionName}/${documentId}/${subcollectionName}/${subdocumentId}`);
      await remove(dbRef);
    } else {
      // Use Firestore
      const parentDocRef = doc(db, collectionName, documentId);
      const subdocRef = doc(parentDocRef, subcollectionName, subdocumentId);
      await deleteDoc(subdocRef);
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting document from subcollection:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}