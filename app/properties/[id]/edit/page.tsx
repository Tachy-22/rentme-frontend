import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { getDocument } from '@/actions/firebase/getDocument';
import { PropertyFormClient } from '@/components/properties/PropertyFormClient';
import { Property } from '@/types';

export const dynamic = 'force-dynamic';

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Only agents can edit properties
  if (user.role !== 'agent') {
    redirect('/dashboard');
  }

  // Get the property
  const propertyResult = await getDocument({
    collectionName: 'properties',
    documentId: id
  });

  if (!propertyResult.success || !propertyResult.data) {
    redirect('/agent/properties');
  }

  const property = propertyResult.data as unknown as Property;

  // Ensure the agent owns this property
  if (property.agentId !== user.id) {
    redirect('/agent/properties');
  }

  return (
    <PropertyFormClient 
      user={user}
      mode="edit"
      property={property}
    />
  );
}