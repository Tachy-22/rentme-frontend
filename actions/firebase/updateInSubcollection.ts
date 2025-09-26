'use server';

import { db, rtdb } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, update } from 'firebase/database';

interface UpdateInSubcollectionParams {
  collectionName: string;
  documentId: string;
  subcollectionName: string;
  subdocumentId: string;
  data: Record<string, unknown>;
  realtime?: boolean;
}

interface UpdateInSubcollectionResult {
  success: boolean;
  error?: string;
}

export async function updateInSubcollection({ 
  collectionName, 
  documentId, 
  subcollectionName, 
  subdocumentId, 
  data, 
  realtime = false 
}: UpdateInSubcollectionParams): Promise<UpdateInSubcollectionResult> {
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

    if (!data || Object.keys(data).length === 0) {
      return {
        success: false,
        error: 'Update data is required'
      };
    }

    if (realtime) {
      // Use Realtime Database
      const dbRef = ref(rtdb, `${collectionName}/${documentId}/${subcollectionName}/${subdocumentId}`);
      await update(dbRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } else {
      // Use Firestore
      const parentDocRef = doc(db, collectionName, documentId);
      const subdocRef = doc(parentDocRef, subcollectionName, subdocumentId);
      await updateDoc(subdocRef, {
        ...data,
        updatedAt: new Date()
      });
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating document in subcollection:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}