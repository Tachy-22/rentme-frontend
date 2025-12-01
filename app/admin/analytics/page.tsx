import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import Analytics from '@/components/admin/Analytics';
import { redirect } from 'next/navigation';

export default async function AdminAnalyticsPage() {
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
      <div className="p-0 lg:p-8">
        <Analytics />
      </div>
    </div>
  );
}