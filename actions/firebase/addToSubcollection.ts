'use server';

import { db, rtdb } from '@/lib/firebase';
import { collection, addDoc, doc } from 'firebase/firestore';
import { push, ref } from 'firebase/database';

interface AddToSubcollectionParams {
  collectionName: string;
  documentId: string;
  subcollectionName: string;
  data: Record<string, unknown>;
  realtime?: boolean;
}

interface AddToSubcollectionResult {
  success: boolean;
  id?: string;
  error?: string;
}

export async function addToSubcollection({ 
  collectionName, 
  documentId, 
  subcollectionName, 
  data, 
  realtime = false 
}: AddToSubcollectionParams): Promise<AddToSubcollectionResult> {
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

    if (!data || Object.keys(data).length === 0) {
      return {
        success: false,
        error: 'Document data is required'
      };
    }

    let subdocumentId: string;

    if (realtime) {
      // Use Realtime Database
      const dbRef = ref(rtdb, `${collectionName}/${documentId}/${subcollectionName}`);
      const newRef = push(dbRef, {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      subdocumentId = newRef.key!;
    } else {
      // Use Firestore
      const docRef = doc(db, collectionName, documentId);
      const subcollectionRef = collection(docRef, subcollectionName);
      const subdocRef = await addDoc(subcollectionRef, {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      subdocumentId = subdocRef.id;
    }

    return {
      success: true,
      id: subdocumentId
    };
  } catch (error) {
    console.error('Error adding to subcollection:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}