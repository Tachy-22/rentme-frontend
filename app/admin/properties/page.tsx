import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import PropertyManagement from '@/components/admin/PropertyManagement';
import { redirect } from 'next/navigation';

export default async function AdminPropertiesPage() {
  const userResult = await getCurrentUser();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth');
  }

  const user = userResult.user;

  if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 lg:p-8">
        <PropertyManagement />
      </div>
    </div>
  );
}