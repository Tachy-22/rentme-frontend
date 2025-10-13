import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { getSavedProperties } from '@/actions/properties/getSavedProperties';
import { SavedPropertiesClient } from '@/components/saved/SavedPropertiesClient';

export default async function SavedPropertiesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Only renters can access this page
  if (user.role !== 'renter') {
    redirect('/dashboard');
  }

  // Fetch saved properties
  const savedPropertiesResult = await getSavedProperties(user.id);
  const savedProperties = savedPropertiesResult.success ? savedPropertiesResult.properties : [];

  return (
    <SavedPropertiesClient 
      user={user} 
      savedProperties={savedProperties}
    />
  );
}