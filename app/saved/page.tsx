import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { getSavedProperties } from '@/actions/properties/getSavedProperties';
import SavedPropertiesClient from '@/components/saved/SavedPropertiesClient';
import RenterLayout from '@/components/layout/RenterLayout';
import { redirect } from 'next/navigation';

export default async function SavedPropertiesPage() {
  const userResult = await getCurrentUser();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth');
  }

  const user = userResult.user;

  if (user.role !== 'renter') {
    redirect('/dashboard');
  }

  // Get saved properties
  const savedPropertiesResult = await getSavedProperties();
  const savedProperties = savedPropertiesResult.success ? (savedPropertiesResult.data || []) : [];

  return (
    <RenterLayout>
      <SavedPropertiesClient user={user} initialProperties={savedProperties} />
    </RenterLayout>
  );
}