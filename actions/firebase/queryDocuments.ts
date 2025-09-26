'use server';

import { db, rtdb } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, QueryConstraint } from 'firebase/firestore';
import { ref, query as rtQuery, orderByChild, orderByKey, equalTo, limitToFirst, limitToLast, get } from 'firebase/database';

interface QueryDocumentsParams {
  collectionName: string;
  filters?: {
    field: string;
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=';
    value: string | number | boolean;
  }[];
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  limitCount?: number;
  realtime?: boolean;
}

interface QueryDocumentsResult {
  success: boolean;
  data?: Record<string, unknown>[];
  error?: string;
}

export async function queryDocuments({ 
  collectionName, 
  filters = [],
  orderByField,
  orderDirection = 'asc',
  limitCount,
  realtime = false 
}: QueryDocumentsParams): Promise<QueryDocumentsResult> {
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
      let dbRef = ref(rtdb, collectionName);
      let rtQueryRef = rtQuery(dbRef);

      // Apply ordering (Realtime Database has limited query capabilities)
      if (orderByField) {
        rtQueryRef = rtQuery(dbRef, orderByChild(orderByField));
      } else {
        rtQueryRef = rtQuery(dbRef, orderByKey());
      }

      // Apply limit
      if (limitCount) {
        if (orderDirection === 'desc') {
          rtQueryRef = rtQuery(dbRef, orderByChild(orderByField || '.key'), limitToLast(limitCount));
        } else {
          rtQueryRef = rtQuery(dbRef, orderByChild(orderByField || '.key'), limitToFirst(limitCount));
        }
      }

      // Apply simple equality filter (only first filter, as Realtime Database has limited filtering)
      if (filters.length > 0 && filters[0].operator === '==') {
        rtQueryRef = rtQuery(dbRef, orderByChild(filters[0].field), equalTo(filters[0].value));
      }

      const snapshot = await get(rtQueryRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        documents = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));

        // Apply client-side filtering for complex queries (not ideal, but necessary for Realtime Database)
        if (filters.length > 0) {
          documents = documents.filter(doc => {
            return filters.every(filter => {
              const docValue = doc[filter.field] as string | number | boolean;
              const filterValue = filter.value;
              switch (filter.operator) {
                case '==':
                  return docValue === filterValue;
                case '!=':
                  return docValue !== filterValue;
                case '<':
                  return docValue < filterValue;
                case '<=':
                  return docValue <= filterValue;
                case '>':
                  return docValue > filterValue;
                case '>=':
                  return docValue >= filterValue;
                default:
                  return true;
              }
            });
          });
        }
      }
    } else {
      // Use Firestore
      const constraints: QueryConstraint[] = [];

      // Apply filters
      filters.forEach(filter => {
        constraints.push(where(filter.field, filter.operator, filter.value));
      });

      // Apply ordering
      if (orderByField) {
        constraints.push(orderBy(orderByField, orderDirection));
      }

      // Apply limit
      if (limitCount) {
        constraints.push(limit(limitCount));
      }

      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      
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
    console.error('Error querying documents:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}