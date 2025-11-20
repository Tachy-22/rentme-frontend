'use server';

import { cookies } from 'next/headers';
import { updateDocument, getDocument } from '@/actions/firebase';
import { ApplicationStatus } from '@/types';

interface UpdateApplicationStatusParams {
  applicationId: string;
  status: ApplicationStatus;
  notes?: string;
}

export async function updateApplicationStatus({ applicationId, status, notes }: UpdateApplicationStatusParams) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;
    const userRole = cookieStore.get('user-role')?.value;

    if (!userId || userRole !== 'agent') {
      return {
        success: false,
        error: 'Unauthorized access'
      };
    }

    // Get application to verify ownership
    const applicationResult = await getDocument({
      collectionName: 'applications',
      documentId: applicationId
    });

    if (!applicationResult.success || !applicationResult.data) {
      return {
        success: false,
        error: 'Application not found'
      };
    }

    const application = applicationResult.data as Record<string, unknown>;

    // Verify the agent owns this application
    if (application.agentId !== userId) {
      return {
        success: false,
        error: 'Unauthorized to update this application'
      };
    }

    // Update application status
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date().toISOString()
    };

    if (notes) {
      updateData.agentNotes = notes;
    }

    // Add status history
    const statusHistory = application.statusHistory || [];
    statusHistory.push({
      status,
      updatedBy: userId,
      updatedAt: new Date().toISOString(),
      notes
    });
    updateData.statusHistory = statusHistory;

    const result = await updateDocument({
      collectionName: 'applications',
      documentId: applicationId,
      data: updateData
    });

    return result;

  } catch (error) {
    console.error('Error updating application status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update application status'
    };
  }
}