import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { getAgentStats } from '@/actions/dashboard/getAgentStats';
import { getAgentRecentActivities } from '@/actions/dashboard/getAgentRecentActivities';
import AgentDashboard from '@/components/agent/AgentDashboard';
import { redirect } from 'next/navigation';

export default async function AgentDashboardPage() {
  const userResult = await getCurrentUser();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth');
  }

  const user = userResult.user;

  if (user.role !== 'agent') {
    redirect('/dashboard');
  }

  // Get dashboard stats
  const statsResult = await getAgentStats();
  const stats = statsResult.success ? statsResult.data : null;

  // Get recent activities
  const activitiesResult = await getAgentRecentActivities();
  const recentActivities = activitiesResult.success ? activitiesResult.data : [];

  return <AgentDashboard user={user} stats={stats} recentActivities={recentActivities} />;
}