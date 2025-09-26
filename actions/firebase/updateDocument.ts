'use server';

import { db, rtdb } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, update } from 'firebase/database';

interface UpdateDocumentParams {
  collectionName: string;
  documentId: string;
  data: Record<string, unknown>;
  realtime?: boolean;
}

interface UpdateDocumentResult {
  success: boolean;
  error?: string;
}

export async function updateDocument({ 
  collectionName, 
  documentId, 
  data, 
  realtime = false 
}: UpdateDocumentParams): Promise<UpdateDocumentResult> {
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

    if (!data || Object.keys(data).length === 0) {
      return {
        success: false,
        error: 'Update data is required'
      };
    }

    if (realtime) {
      // Use Realtime Database
      const dbRef = ref(rtdb, `${collectionName}/${documentId}`);
      await update(dbRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } else {
      // Use Firestore
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
    }

    return {
      success: true
    };
    
  } catch (error) {
    console.error('Error updating document:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}