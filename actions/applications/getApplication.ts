'use server';

import { getDocument } from '@/actions/firebase/getDocument';
import { Application } from '@/types';

interface GetApplicationResult {
  success: boolean;
  application?: Application;
  error?: string;
}

export async function getApplication(applicationId: string): Promise<GetApplicationResult> {
  try {
    if (!applicationId) {
      return {
        success: false,
        error: 'Application ID is required'
      };
    }

    const result = await getDocument({
      collectionName: 'applications',
      documentId: applicationId
    });

    if (result.success && result.data) {
      const application = result.data as unknown as Application;
      return {
        success: true,
        application
      };
    } else {
      return {
        success: false,
        error: result.error || 'Application not found'
      };
    }
  } catch (error) {
    console.error('Error getting application:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}