'use server';

import { db, rtdb } from '@/lib/firebase';
import { adminRtdb } from '@/lib/firebase-admin';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { push, ref } from 'firebase/database';

interface AddDocumentParams {
  collectionName: string;
  data: Record<string, unknown>;
  realtime?: boolean;
}

interface AddDocumentResult {
  success: boolean;
  id?: string;
  data?: Record<string, unknown>;
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
      // Use Admin Realtime Database
      const dbRef = adminRtdb.ref(collectionName);
      const newRef = dbRef.push({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      documentId = newRef.key!;
    } else {
      // Use Firestore
      // custom id if present
      const id = data.id;

      // if id is provided → use it
      // if not → let Firestore generate a random one
      const docRef = id
        ? doc(db, collectionName, id as string) // ✅ works with db + path + id
        : doc(collection(db, collectionName)); // ✅ works with collection ref only

      await setDoc(docRef, {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      documentId = docRef.id;
    }

    return {
      success: true,
      id: documentId,
      data: { id: documentId, ...data }
    };
  } catch (error) {
    console.error('Error adding document:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}