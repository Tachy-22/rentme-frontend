'use server';

import { addDocument } from '@/actions/firebase/addDocument';
import { updateDocument } from '@/actions/firebase/updateDocument';
import { getDocument } from '@/actions/firebase/getDocument';
import { ApplicationFormData, Application } from '@/types';

interface SubmitApplicationResult {
  success: boolean;
  applicationId?: string;
  error?: string;
}

export async function submitApplication(
  applicationData: ApplicationFormData,
  uploadedFiles: Record<string, File[]>
): Promise<SubmitApplicationResult> {
  try {
    // Validate required data
    if (!applicationData.propertyId || !applicationData.renterId || !applicationData.agentId) {
      return {
        success: false,
        error: 'Missing required application data'
      };
    }

    // Check if property is still available
    const propertyResult = await getDocument({
      collectionName: 'properties',
      documentId: applicationData.propertyId
    });

    if (!propertyResult.success || !propertyResult.data) {
      return {
        success: false,
        error: 'Property not found'
      };
    }

    const propertyData = propertyResult.data as Record<string, unknown>;
    if (propertyData.status !== 'available') {
      return {
        success: false,
        error: 'Property is no longer available for applications'
      };
    }

    // Upload documents to Cloudinary (simulated for now)
    const documentUrls: Record<string, string[]> = {};
    for (const [docType, files] of Object.entries(uploadedFiles)) {
      documentUrls[docType] = files.map(file => `https://cloudinary.com/uploads/${file.name}`);
    }

    // Create application document
    const applicationDoc: Omit<Application, 'id'> = {
      propertyId: applicationData.propertyId,
      renterId: applicationData.renterId,
      agentId: applicationData.agentId,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      personalInfo: applicationData.personalInfo,
      employmentInfo: applicationData.employmentInfo,
      rentalHistory: applicationData.rentalHistory,
      references: applicationData.references,
      additionalInfo: applicationData.additionalInfo,
      documents: {
        ...applicationData.documents,
        uploadedFiles: documentUrls
      },
      agreements: applicationData.agreements,
      reviewedAt: null,
      reviewedBy: null,
      notes: null
    };

    // Save application to database
    const result = await addDocument({
      collectionName: 'applications',
      data: applicationDoc
    });

    if (result.success && result.id) {
      // Update property application count
      await updatePropertyApplicationCount(applicationData.propertyId);
      
      // Send notification to agent (would be implemented with notification system)
      await notifyAgentOfNewApplication(applicationData.agentId, result.id);

      return {
        success: true,
        applicationId: result.id
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to submit application'
      };
    }
  } catch (error) {
    console.error('Error submitting application:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

async function updatePropertyApplicationCount(propertyId: string): Promise<void> {
  try {
    const result = await getDocument({
      collectionName: 'properties',
      documentId: propertyId
    });

    if (result.success && result.data) {
      const propertyData = result.data as Record<string, unknown>;
      const currentCount = (propertyData.applicationCount as number) || 0;
      
      await updateDocument({
        collectionName: 'properties',
        documentId: propertyId,
        data: {
          applicationCount: currentCount + 1,
          lastApplicationAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error('Error updating property application count:', error);
  }
}

async function notifyAgentOfNewApplication(agentId: string, applicationId: string): Promise<void> {
  try {
    // This would integrate with the notification system when implemented
    console.log(`New application ${applicationId} for agent ${agentId}`);
    
    // For now, we'll create a simple notification document
    await addDocument({
      collectionName: 'notifications',
      data: {
        userId: agentId,
        type: 'new_application',
        title: 'New Rental Application',
        message: 'You have received a new rental application',
        applicationId,
        createdAt: new Date().toISOString(),
        read: false
      }
    });
  } catch (error) {
    console.error('Error sending notification to agent:', error);
  }
}