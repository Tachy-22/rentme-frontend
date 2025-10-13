import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getProperty } from '@/actions/properties/getProperty';
import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { ApplicationFormClient } from '@/components/applications/ApplicationFormClient';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface PropertyApplicationPageProps {
  params: Promise<{ propertyId: string }>;
}

export default async function PropertyApplicationPage({ params }: PropertyApplicationPageProps) {
  const { propertyId } = await params;
  
  // Get current user
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  if (user.role !== 'renter') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must be logged in as a renter to apply for properties.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Load property details
  const propertyResult = await getProperty(propertyId);
  
  if (!propertyResult.success || !propertyResult.property) {
    notFound();
  }
  
  const property = propertyResult.property;

  return <ApplicationFormClient property={property} user={user} />;
}