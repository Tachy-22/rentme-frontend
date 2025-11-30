import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import VerificationManagement from '@/components/admin/VerificationManagement';
import { redirect } from 'next/navigation';

export default async function AdminVerificationsPage() {
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
      <div className="p-2 lg:p-8">
        <VerificationManagement />
      </div>
    </div>
  );
}