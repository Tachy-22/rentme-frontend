'use server';

import { db, rtdb } from '@/lib/firebase';
import { collection, getDocs, doc } from 'firebase/firestore';
import { ref, get } from 'firebase/database';

interface GetSubcollectionParams {
  collectionName: string;
  documentId: string;
  subcollectionName: string;
  realtime?: boolean;
}

interface GetSubcollectionResult {
  success: boolean;
  data?: Record<string, unknown>[];
  error?: string;
}

export async function getSubcollection({ 
  collectionName, 
  documentId, 
  subcollectionName, 
  realtime = false 
}: GetSubcollectionParams): Promise<GetSubcollectionResult> {
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

    let documents: Record<string, unknown>[] = [];

    if (realtime) {
      // Use Realtime Database
      const dbRef = ref(rtdb, `${collectionName}/${documentId}/${subcollectionName}`);
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
      const docRef = doc(db, collectionName, documentId);
      const subcollectionRef = collection(docRef, subcollectionName);
      const querySnapshot = await getDocs(subcollectionRef);
      
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
    console.error('Error getting subcollection:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}