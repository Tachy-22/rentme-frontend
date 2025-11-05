import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import UserManagement from '@/components/admin/UserManagement';
import { redirect } from 'next/navigation';

export default async function AdminUsersPage() {
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
        <UserManagement />
      </div>
    </div>
  );
}