import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getApplication } from '@/actions/applications/getApplication';
import { getProperty } from '@/actions/properties/getProperty';
import { getUser } from '@/actions/users/getUser';
import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { ApplicationStatusClient } from '@/components/applications/ApplicationStatusClient';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ApplicationStatusPageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationStatusPage({ params }: ApplicationStatusPageProps) {
  const { id } = await params;
  
  // Get current user
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    redirect('/auth/login');
  }
  
  // Load application details
  const applicationResult = await getApplication(id);
  
  if (!applicationResult.success || !applicationResult.application) {
    notFound();
  }
  
  const application = applicationResult.application;
  
  // Check if user has permission to view this application
  if (currentUser.role === 'renter' && application.renterId !== currentUser.id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to view this application.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (currentUser.role === 'agent' && application.agentId !== currentUser.id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to view this application.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Load property details
  const propertyResult = await getProperty(application.propertyId);
  const property = propertyResult.success && propertyResult.property ? propertyResult.property : null;
  
  // Load agent details
  const agentResult = await getUser(application.agentId);
  const agent = agentResult.success && agentResult.user ? agentResult.user : null;

  return (
    <ApplicationStatusClient 
      application={application}
      property={property}
      agent={agent}
      currentUser={currentUser}
    />
  );
}