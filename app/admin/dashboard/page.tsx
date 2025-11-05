import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const userResult = await getCurrentUser();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth');
  }

  const user = userResult.user;

  if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  return <AdminDashboard user={user} />;
}