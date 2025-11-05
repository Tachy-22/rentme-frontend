import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { getProperties } from '@/actions/properties/getProperties';
import PropertiesPageClient from '@/components/properties/PropertiesPageClient';
import RenterLayout from '@/components/layout/RenterLayout';
import { redirect } from 'next/navigation';

export default async function PropertiesPageRoute() {
  const userResult = await getCurrentUser();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth');
  }

  const user = userResult.user;

  // Get initial properties
  const propertiesResult = await getProperties({
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const initialProperties = propertiesResult.success ? propertiesResult.data : [];

  return (
    <RenterLayout>
      <PropertiesPageClient user={user} initialProperties={initialProperties} />
    </RenterLayout>
  );
}