'use server';

import { cookies } from 'next/headers';
import { addDocument } from '@/actions/firebase';
import { ApplicationFormData } from '@/types';

interface SubmitApplicationParams {
  propertyId: string;
  agentId: string;
  applicationData: Omit<ApplicationFormData, 'propertyId' | 'agentId' | 'renterId'>;
}

export async function submitApplication(params: SubmitApplicationParams) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;
    const userRole = cookieStore.get('user-role')?.value;

    if (!userId) {
      return { success: false, error: 'Authentication required' };
    }

    if (userRole !== 'renter') {
      return { success: false, error: 'Only renters can submit applications' };
    }

    const applicationData: ApplicationFormData = {
      ...params.applicationData,
      propertyId: params.propertyId,
      agentId: params.agentId,
      renterId: userId
    };

    const applicationDoc = {
      propertyId: params.propertyId,
      renterId: userId,
      agentId: params.agentId,
      status: 'pending' as const,
      submittedAt: new Date().toISOString(),
      personalInfo: applicationData.personalInfo,
      employmentInfo: applicationData.employmentInfo,
      rentalHistory: applicationData.rentalHistory,
      references: applicationData.references,
      additionalInfo: applicationData.additionalInfo,
      documents: applicationData.documents,
      agreements: applicationData.agreements,
      reviewedAt: null,
      reviewedBy: null,
      notes: null
    };

    const result = await addDocument({
      collectionName: 'applications',
      data: applicationDoc
    });

    if (result.success) {
      return { 
        success: true, 
        id: result.id,
        message: 'Application submitted successfully' 
      };
    } else {
      return { success: false, error: result.error || 'Failed to submit application' };
    }
  } catch (error) {
    console.error('Submit application error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An error occurred while submitting application' 
    };
  }
}