import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { getProperty } from '@/actions/properties/getProperty';
import EditPropertyPage from '@/components/agent/EditPropertyPage';
import { Property } from '@/types';
import { redirect } from 'next/navigation';

export default async function PropertyEditPage({ params }: { params: { id: string } }) {
  const userResult = await getCurrentUser();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth');
  }

  const user = userResult.user;

  if (user.role !== 'agent' && user.role !== 'admin') {
    redirect('/dashboard');
  }

  // Get the property data
  const propertyResult = await getProperty(params.id);
  
  if (!propertyResult.success || !propertyResult.data) {
    redirect('/agent/properties');
  }

  const property = propertyResult.data;

  // Verify ownership for agents (admins can edit any property)
  if (user.role === 'agent' && (property as Record<string, unknown>).agentId !== user.id) {
    redirect('/agent/properties');
  }

  return <EditPropertyPage user={user} property={property as unknown as Property} />;
}