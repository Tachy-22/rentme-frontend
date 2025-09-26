'use server';

import { db, rtdb } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { push, ref } from 'firebase/database';

interface AddDocumentParams {
  collectionName: string;
  data: Record<string, unknown>;
  realtime?: boolean;
}

interface AddDocumentResult {
  success: boolean;
  id?: string;
  error?: string;
}

export async function addDocument({ 
  collectionName, 
  data, 
  realtime = false 
}: AddDocumentParams): Promise<AddDocumentResult> {
  try {
    if (!collectionName) {
      return {
        success: false,
        error: 'Collection name is required'
      };
    }

    if (!data || Object.keys(data).length === 0) {
      return {
        success: false,
        error: 'Document data is required'
      };
    }

    let documentId: string;

    if (realtime) {
      // Use Realtime Database
      const dbRef = ref(rtdb, collectionName);
      const newRef = push(dbRef, {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      documentId = newRef.key!;
    } else {
      // Use Firestore
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      documentId = docRef.id;
    }

    return {
      success: true,
      id: documentId
    };
  } catch (error) {
    console.error('Error adding document:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}