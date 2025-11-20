'use server';

import { cookies } from 'next/headers';
import { queryDocuments, updateDocument, getDocument } from '@/actions/firebase';

export async function getAllVerificationRequests() {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('user-role')?.value;

    if (userRole !== 'admin') {
      return {
        success: false,
        error: 'Unauthorized access'
      };
    }

    // Get all verification requests
    const result = await queryDocuments({
      collectionName: 'verifications',
      orderByField: 'submittedAt',
      orderDirection: 'desc'
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        error: 'Failed to fetch verification requests'
      };
    }

    // Enrich with user details
    const enrichedRequests = await Promise.all(
      result.data.map(async (request: Record<string, unknown>) => {
        const userResult = await getDocument({
          collectionName: 'users',
          documentId: request.userId as string
        });

        let user = null;
        if (userResult.success && userResult.data) {
          const userData = userResult.data as any;
          user = {
            id: request.userId,
            name: userData.profile?.fullName || userData.name || 'Unknown User',
            email: userData.email,
            profilePicture: userData.profile?.profilePicture || null,
            profile: userData.profile
          };
        }

        return {
          ...request,
          user
        };
      })
    );

    return {
      success: true,
      data: enrichedRequests
    };

  } catch (error) {
    console.error('Error getting verification requests:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get verification requests'
    };
  }
}

interface UpdateVerificationStatusParams {
  requestId: string;
  status: 'verified' | 'rejected';
  notes?: string;
}

export async function updateVerificationStatus(params: UpdateVerificationStatusParams) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;
    const userRole = cookieStore.get('user-role')?.value;

    if (userRole !== 'admin') {
      return {
        success: false,
        error: 'Unauthorized access'
      };
    }

    // Get the verification request
    const verificationResult = await getDocument({
      collectionName: 'verifications',
      documentId: params.requestId
    });

    if (!verificationResult.success || !verificationResult.data) {
      return {
        success: false,
        error: 'Verification request not found'
      };
    }

    const verification = verificationResult.data as any;

    // Update verification request
    const updateVerificationResult = await updateDocument({
      collectionName: 'verifications',
      documentId: params.requestId,
      data: {
        status: params.status,
        reviewedAt: new Date().toISOString(),
        reviewedBy: userId,
        notes: params.notes || null
      }
    });

    if (!updateVerificationResult.success) {
      return {
        success: false,
        error: 'Failed to update verification request'
      };
    }

    // Update user profile
    const userUpdateResult = await updateDocument({
      collectionName: 'users',
      documentId: verification.userId,
      data: {
        'profile.verificationStatus': params.status,
        'profile.verifiedAt': params.status === 'verified' ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString()
      }
    });

    if (!userUpdateResult.success) {
      console.warn('Failed to update user verification status');
    }

    return {
      success: true,
      message: `Verification request ${params.status} successfully`
    };

  } catch (error) {
    console.error('Error updating verification status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update verification status'
    };
  }
}

export async function getVerificationStats() {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('user-role')?.value;

    if (userRole !== 'admin') {
      return {
        success: false,
        error: 'Unauthorized access'
      };
    }

    // Get all verification requests
    const result = await queryDocuments({
      collectionName: 'verifications'
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        error: 'Failed to fetch verification stats'
      };
    }

    const requests = result.data;
    const stats = {
      total: requests.length,
      pending: requests.filter((r: Record<string, unknown>) => r.status === 'pending').length,
      verified: requests.filter((r: Record<string, unknown>) => r.status === 'verified').length,
      rejected: requests.filter((r: Record<string, unknown>) => r.status === 'rejected').length,
      renterRequests: requests.filter((r: Record<string, unknown>) => r.userRole === 'renter').length,
      agentRequests: requests.filter((r: Record<string, unknown>) => r.userRole === 'agent').length,
      thisWeek: requests.filter((r: Record<string, unknown>) => {
        const requestDate = new Date(r.submittedAt as string);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return requestDate >= weekAgo;
      }).length
    };

    return {
      success: true,
      data: stats
    };

  } catch (error) {
    console.error('Error getting verification stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get verification stats'
    };
  }
}