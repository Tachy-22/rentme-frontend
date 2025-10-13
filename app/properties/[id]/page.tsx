import React from 'react';
import { notFound } from 'next/navigation';
import { getProperty } from '@/actions/properties/getProperty';
import { getUser } from '@/actions/users/getUser';
import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { PropertyDetailClient } from '@/components/properties/PropertyDetailClient';
import { User } from '@/types';

export const dynamic = 'force-dynamic';

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params;
  
  // Load property details and current user
  const [propertyResult, currentUser] = await Promise.all([
    getProperty(id),
    getCurrentUser()
  ]);
  
  if (!propertyResult.success || !propertyResult.property) {
    notFound();
  }
  
  const property = propertyResult.property;
  
  // Load agent details
  const agentResult = await getUser(property.agentId);
  const agent = agentResult.success ? agentResult.user : null;

  return <PropertyDetailClient property={property} agent={agent as User} user={currentUser} />;
}