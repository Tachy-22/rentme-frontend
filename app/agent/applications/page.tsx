import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { getAgentApplications } from '@/actions/applications/getAgentApplications';
import AgentApplicationsPage from '@/components/agent/AgentApplicationsPage';
import { redirect } from 'next/navigation';

export default async function AgentApplicationsPageRoute() {
  const userResult = await getCurrentUser();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth');
  }

  const user = userResult.user;

  if (user.role !== 'agent') {
    redirect('/dashboard');
  }
  
  // Get applications for this agent
  const applicationsResult = await getAgentApplications();
  const applications = applicationsResult.success ? applicationsResult.data : [];

  return <AgentApplicationsPage applications={applications} />;
}