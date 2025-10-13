/**
 * Utility to serialize Firestore data for client components
 * Recursively converts Firestore Timestamps to ISO strings
 */

export function serializeFirestoreData(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // Handle primitive types
  if (typeof obj !== 'object') {
    return obj;
  }
  
  // Check for serialized Firestore timestamp objects
  const serializedTimestamp = obj as { 
    type?: string; 
    seconds?: number; 
    nanoseconds?: number; 
  };
  if (serializedTimestamp.type === 'firestore/timestamp/1.0' && 
      serializedTimestamp.seconds !== undefined && 
      serializedTimestamp.nanoseconds !== undefined) {
    return new Date(serializedTimestamp.seconds * 1000).toISOString();
  }
  
  // First check if the object has a toJSON method (common for Firestore objects)
  const hasToJSON = obj as { toJSON?: () => unknown };
  if (typeof hasToJSON.toJSON === 'function') {
    // For objects with toJSON that look like timestamps, convert to ISO string
    const timestamp = obj as { 
      seconds?: number; 
      nanoseconds?: number; 
      toDate?: () => Date;
    };
    if (timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
      return new Date(timestamp.seconds * 1000).toISOString();
    }
  }
  
  // Check if it's a Firestore Timestamp
  const timestamp = obj as { 
    seconds?: number; 
    nanoseconds?: number; 
    toDate?: () => Date;
    _seconds?: number;
    _nanoseconds?: number;
  };
  
  // Detect Firestore Timestamp by checking for seconds/nanoseconds or toDate method
  // Also check for _seconds/_nanoseconds which are sometimes used
  if ((timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) || 
      (timestamp._seconds !== undefined && timestamp._nanoseconds !== undefined) ||
      (typeof timestamp.toDate === 'function')) {
    try {
      if (timestamp.seconds !== undefined) {
        return new Date(timestamp.seconds * 1000).toISOString();
      } else if (timestamp._seconds !== undefined) {
        return new Date(timestamp._seconds * 1000).toISOString();
      } else if (typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toISOString();
      }
    } catch (error) {
      console.warn('Failed to convert timestamp:', error, obj);
      return new Date().toISOString(); // Fallback to current date
    }
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => serializeFirestoreData(item));
  }
  
  // Handle objects - recursively serialize all properties
  const serialized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    serialized[key] = serializeFirestoreData(value);
  }
  
  return serialized;
}

/**
 * Serialize user data specifically
 */
export function serializeUserData(userData: Record<string, unknown>): Record<string, unknown> {
  return serializeFirestoreData(userData) as Record<string, unknown>;
}

/**
 * Serialize array of documents
 */
export function serializeDocumentArray<T>(docs: unknown[]): T[] {
  return docs.map(doc => serializeFirestoreData(doc)) as T[];
}