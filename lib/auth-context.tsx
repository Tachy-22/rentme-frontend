'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { User, UserRole } from '@/types';
import { getDocument } from '@/actions';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
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

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sign in'
      };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    user: Partial<User>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Send email verification
      await sendEmailVerification(userCredential.user, {
        url: `${window.location.origin}/auth/verify-email`,
        handleCodeInApp: true
      });

      // Update Firebase Auth profile
      await updateProfile(userCredential.user, {
        displayName: `${user.profile?.firstName} ${user.profile?.lastName}`
      });

      // Create user document in Firestore
      const newUser: User = {
        id:userCredential.user.uid,
        email: userCredential.user.email!,
        role: user.role as UserRole,
        profile: user.profile!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        emailVerified: userCredential.user.emailVerified
      };

      // This will be handled by server action
      const { addDocument } = await import('@/actions');
      const result = await addDocument({
        collectionName: 'users',
        data: newUser as unknown as Record<string, unknown>
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to create user profile');
      }

      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create account'
      };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);

      // Check if user exists in Firestore
      const userDoc = await getDocument({
        collectionName: 'users',
        documentId: result.user.uid
      });

      // If user doesn't exist, they need to complete registration
      if (!userDoc.success || !userDoc.data) {
        return {
          success: false,
          error: 'Please complete your registration with email and password first'
        };
      }

      return { success: true };
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

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send reset email'
      };
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
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}