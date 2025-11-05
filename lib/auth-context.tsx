'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
  updateProfile,
  signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { User, UserRole } from '@/types';
import { getDocument } from '@/actions';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string; needsOnboarding?: boolean }>;
  completeOnboarding: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      console.log({ firebaseUser })
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDocument({
            collectionName: 'users',
            documentId: firebaseUser.uid
          });
          console.log({ userDoc })
          if (userDoc.success && userDoc.data) {
            const rawData = userDoc.data as Record<string, unknown>;

            // Convert Firestore Timestamps to strings for serialization
            const serializedData = { ...rawData };

            // Handle common Firestore Timestamp fields
            if (serializedData.createdAt && typeof serializedData.createdAt === 'object' && serializedData.createdAt !== null) {
              const timestamp = serializedData.createdAt as { seconds: number; nanoseconds: number };
              if ('seconds' in timestamp && 'nanoseconds' in timestamp) {
                serializedData.createdAt = new Date(timestamp.seconds * 1000).toISOString();
              }
            }

            if (serializedData.updatedAt && typeof serializedData.updatedAt === 'object' && serializedData.updatedAt !== null) {
              const timestamp = serializedData.updatedAt as { seconds: number; nanoseconds: number };
              if ('seconds' in timestamp && 'nanoseconds' in timestamp) {
                serializedData.updatedAt = new Date(timestamp.seconds * 1000).toISOString();
              }
            }

            if (serializedData.lastLoginAt && typeof serializedData.lastLoginAt === 'object' && serializedData.lastLoginAt !== null) {
              const timestamp = serializedData.lastLoginAt as { seconds: number; nanoseconds: number };
              if ('seconds' in timestamp && 'nanoseconds' in timestamp) {
                serializedData.lastLoginAt = new Date(timestamp.seconds * 1000).toISOString();
              }
            }

            const userData = {
              id: firebaseUser.uid,
              ...serializedData
            } as User;
            console.log({ userData })
            setUser(userData);

            // Set cookies for middleware
            document.cookie = `auth-token=${await firebaseUser.getIdToken()}; path=/; max-age=3600`;
            document.cookie = `user-role=${userData.role}; path=/; max-age=3600`;
            document.cookie = `user-id=${firebaseUser.uid}; path=/; max-age=3600`;
          } else {
            // User exists in Firebase Auth but not in Firestore
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
        // Clear cookies
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'user-id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      }

      setLoading(false);
    });
    console.log("this ran")
    return unsubscribe;
  }, []);


  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string; needsOnboarding?: boolean }> => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);

      // Check if user exists in Firestore
      const userDoc = await getDocument({
        collectionName: 'users',
        documentId: result.user.uid
      });
      console.log({ userDoc })
      
      // If user doesn't exist, they need onboarding
      if (!userDoc.success || !userDoc.data) {
        return {
          success: true,
          needsOnboarding: true
        };
      }

      return { success: true, needsOnboarding: false };
    } catch (error) {
      console.error('Google sign in error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sign in with Google'
      };
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (userData: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      if (!firebaseUser) {
        return {
          success: false,
          error: 'No authenticated user found'
        };
      }

      // Update Firebase Auth profile
      await updateProfile(firebaseUser, {
        displayName: `${userData.profile?.firstName} ${userData.profile?.lastName}`
      });

      // Create user document in Firestore
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        role: userData.role as UserRole,
        profile: userData.profile!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        emailVerified: firebaseUser.emailVerified
      };

      const { addDocument } = await import('@/actions');
      const result = await addDocument({
        collectionName: 'users',
        data: newUser as unknown as Record<string, unknown>
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to create user profile');
      }

      // Set cookies immediately after successful onboarding
      const token = await firebaseUser.getIdToken();
      document.cookie = `auth-token=${token}; path=/; max-age=3600`;
      document.cookie = `user-role=${userData.role}; path=/; max-age=3600`;
      document.cookie = `user-id=${firebaseUser.uid}; path=/; max-age=3600`;

      return { success: true };
    } catch (error) {
      console.error('Onboarding error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to complete onboarding'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };


  const updateUserProfile = async (userData: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      const { updateDocument } = await import('@/actions');
      const result = await updateDocument({
        collectionName: 'users',
        documentId: user.id,
        data: {
          ...userData,
          updatedAt: new Date().toISOString()
        }
      });

      if (result.success) {
        // Update local state
        setUser(prev => prev ? { ...prev, ...userData } : null);
      }

      return result;
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile'
      };
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    signInWithGoogle,
    completeOnboarding,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}