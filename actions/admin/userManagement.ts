'use server';

import { cookies } from 'next/headers';
import { queryDocuments, updateDocument, deleteDocument, getDocument } from '@/actions/firebase';

export async function getAllUsers() {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('user-role')?.value;

    if (userRole !== 'admin') {
      return {
        success: false,
        error: 'Unauthorized access'
      };
    }

    const result = await queryDocuments({
      collectionName: 'users',
      orderByField: 'createdAt',
      orderDirection: 'desc'
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        error: 'Failed to fetch users'
      };
    }

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    console.error('Error getting all users:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get users'
    };
  }
}

export async function getUserStats() {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('user-role')?.value;

    if (userRole !== 'admin') {
      return {
        success: false,
        error: 'Unauthorized access'
      };
    }

    const result = await queryDocuments({
      collectionName: 'users'
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        error: 'Failed to fetch user stats'
      };
    }

    const users = result.data;
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const stats = {
      total: users.length,
      renters: users.filter((u: Record<string, unknown>) => u.role === 'renter').length,
      agents: users.filter((u: Record<string, unknown>) => u.role === 'agent').length,
      admins: users.filter((u: Record<string, unknown>) => u.role === 'admin').length,
      verified: users.filter((u: Record<string, unknown>) => u.profile?.verificationStatus === 'verified').length,
      active: users.filter((u: Record<string, unknown>) => u.isActive !== false).length,
      thisWeek: users.filter((u: Record<string, unknown>) => {
        const userDate = new Date(u.createdAt);
        return userDate >= weekAgo;
      }).length
    };

    return {
      success: true,
      data: stats
    };

  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get user stats'
    };
  }
}

interface UpdateUserStatusParams {
  userId: string;
  isActive: boolean;
  reason?: string;
}

export async function updateUserStatus(params: UpdateUserStatusParams) {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('user-id')?.value;
    const userRole = cookieStore.get('user-role')?.value;

    if (userRole !== 'admin') {
      return {
        success: false,
        error: 'Unauthorized access'
      };
    }

    const result = await updateDocument({
      collectionName: 'users',
      documentId: params.userId,
      data: {
        isActive: params.isActive,
        ...(params.reason && { suspensionReason: params.reason }),
        ...(params.isActive === false && { suspendedAt: new Date().toISOString(), suspendedBy: adminId }),
        ...(params.isActive === true && { suspendedAt: null, suspendedBy: null, suspensionReason: null }),
        updatedAt: new Date().toISOString()
      }
    });

    if (!result.success) {
      return {
        success: false,
        error: 'Failed to update user status'
      };
    }

    return {
      success: true,
      message: `User ${params.isActive ? 'activated' : 'suspended'} successfully`
    };

  } catch (error) {
    console.error('Error updating user status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user status'
    };
  }
}

export async function deleteUser(userId: string) {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('user-role')?.value;

    if (userRole !== 'admin') {
      return {
        success: false,
        error: 'Unauthorized access'
      };
    }

    const result = await deleteDocument({
      collectionName: 'users',
      documentId: userId
    });

    if (!result.success) {
      return {
        success: false,
        error: 'Failed to delete user'
      };
    }

    return {
      success: true,
      message: 'User deleted successfully'
    };

  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete user'
    };
  }
}