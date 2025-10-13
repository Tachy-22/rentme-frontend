import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { PropertyFormClient } from '@/components/properties/PropertyFormClient';

export default async function NewPropertyPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Only agents can create properties
  if (user.role !== 'agent') {
    redirect('/dashboard');
  }

  return (
    <PropertyFormClient 
      user={user}
      mode="create"
    />
  );
}