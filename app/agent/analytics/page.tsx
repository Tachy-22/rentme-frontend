import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import AgentAnalyticsPage from '@/components/agent/AgentAnalyticsPage';
import { redirect } from 'next/navigation';

export default async function AgentAnalyticsPageRoute() {
  const userResult = await getCurrentUser();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth');
  }

  const user = userResult.user;

  if (user.role !== 'agent') {
    redirect('/dashboard');
  }

  return <AgentAnalyticsPage />;
}