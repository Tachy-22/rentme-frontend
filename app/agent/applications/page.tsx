import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { getAgentApplications } from '@/actions/applications/getAgentApplications';
import { AgentApplicationsClient } from '@/components/agent/AgentApplicationsClient';

export default async function AgentApplicationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Only agents can access this page
  if (user.role !== 'agent') {
    redirect('/dashboard');
  }

  // Fetch applications for agent's properties
  const applicationsResult = await getAgentApplications(user.id);
  const applications = applicationsResult.success ? applicationsResult.applications : [];

  return (
    <AgentApplicationsClient 
      user={user} 
      applications={applications}
    />
  );
}