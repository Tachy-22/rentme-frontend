import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import serviceAccount from '../serviceAccountKey.json';

// Initialize Firebase Admin SDK
function createFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }
  
  return initializeApp({
    credential: cert(serviceAccount as import('firebase-admin').ServiceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
}

const adminApp = createFirebaseAdminApp();

export const db = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
export const adminRtdb = getDatabase(adminApp);
export { adminApp };