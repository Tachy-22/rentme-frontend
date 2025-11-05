import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { getProperty } from '@/actions/properties/getProperty';
import PropertyDetailsPage from '@/components/properties/PropertyDetailsPage';
import RenterLayout from '@/components/layout/RenterLayout';
import { redirect, notFound } from 'next/navigation';

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const userResult = await getCurrentUser();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth');
  }

  // Get property data
  const propertyResult = await getProperty(id);
  
  if (!propertyResult.success || !propertyResult.data) {
    notFound();
  }

  return (
    <RenterLayout>
      <PropertyDetailsPage property={propertyResult.data} user={userResult.user} />
    </RenterLayout>
  );
}