'use server';

import { cookies } from 'next/headers';
import { addDocument, updateDocument } from '@/actions/firebase';
import { uploadImage } from '@/actions/upload/uploadImage';

interface SubmitVerificationParams {
  documents: {
    studentId?: File;
    admissionLetter?: File;
    cacCertificate?: File;
    personalId?: File;
  };
  // Renter specific
  university?: string;
  department?: string;
  level?: string;
  studentIdNumber?: string;
  // Agent specific
  agencyName?: string;
  agencyAddress?: string;
  licenseNumber?: string;
  businessType?: string;
}

export async function submitVerification(params: SubmitVerificationParams) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;
    const userRole = cookieStore.get('user-role')?.value;

    if (!userId || !userRole) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Upload documents
    const uploadedDocuments: string[] = [];
    const documentUrls: Record<string, string> = {};

    for (const [key, file] of Object.entries(params.documents)) {
      if (file && file instanceof File) {
        try {
          const uploadResult = await uploadImage(file);
          if (uploadResult.success && uploadResult.url) {
            uploadedDocuments.push(uploadResult.url);
            documentUrls[key] = uploadResult.url;
          }
        } catch (error) {
          console.error(`Error uploading ${key}:`, error);
        }
      }
    }

    if (uploadedDocuments.length === 0) {
      return {
        success: false,
        error: 'At least one document must be uploaded'
      };
    }

    // Create verification request
    const verificationData = {
      userId,
      userRole,
      status: 'pending',
      documents: uploadedDocuments,
      documentUrls,
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
      notes: null,
      // Role-specific data
      ...(userRole === 'renter' && {
        university: params.university,
        department: params.department,
        level: params.level,
        studentIdNumber: params.studentIdNumber,
      }),
      ...(userRole === 'agent' && {
        agencyName: params.agencyName,
        agencyAddress: params.agencyAddress,
        licenseNumber: params.licenseNumber,
        businessType: params.businessType,
      }),
    };

    // Save verification request
    const verificationResult = await addDocument({
      collectionName: 'verifications',
      data: verificationData
    });

    if (!verificationResult.success) {
      return {
        success: false,
        error: 'Failed to submit verification request'
      };
    }

    // Update user profile to set verification status to pending
    const updateResult = await updateDocument({
      collectionName: 'users',
      documentId: userId,
      data: {
        'profile.verificationStatus': 'pending',
        'profile.verificationDocuments': uploadedDocuments,
        updatedAt: new Date().toISOString()
      }
    });

    if (!updateResult.success) {
      console.error('Failed to update user verification status');
    }

    return {
      success: true,
      message: 'Verification request submitted successfully'
    };

  } catch (error) {
    console.error('Error submitting verification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit verification'
    };
  }
}

export async function getVerificationStatus() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;

    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Get latest verification request for user
    const { queryDocuments } = await import('@/actions/firebase/queryDocuments');
    const result = await queryDocuments({
      collectionName: 'verifications',
      filters: [{ field: 'userId', operator: '==', value: userId }],
      orderByField: 'submittedAt',
      orderDirection: 'desc',
      limitCount: 1
    });

    return result;
  } catch (error) {
    console.error('Error getting verification status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get verification status'
    };
  }
}