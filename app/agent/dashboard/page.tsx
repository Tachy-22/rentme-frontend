import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { getAgentProperties } from '@/actions/properties/getAgentProperties';
import { getAgentApplications } from '@/actions/applications/getAgentApplications';
import { AgentDashboardClient } from '@/components/agent/AgentDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AgentDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'agent') {
    redirect('/auth/login');
  }

  // Fetch agent data
  const [propertiesResult, applicationsResult] = await Promise.all([
    getAgentProperties(user.id),
    getAgentApplications(user.id)
  ]);

  const properties = propertiesResult.success ? propertiesResult.properties : [];
  const applications = applicationsResult.success ? applicationsResult.applications : [];

  // Calculate stats
  const stats = {
    totalProperties: properties.length,
    availableProperties: properties.filter(p => p.status === 'available').length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(a => a.status === 'pending').length,
    approvedApplications: applications.filter(a => a.status === 'approved').length,
    totalViews: properties.reduce((sum, p) => sum + (p.viewCount || 0), 0),
    totalRevenue: properties
      .filter(p => p.status === 'rented')
      .reduce((sum, p) => sum + p.price.amount, 0)
  };

  return (
    <AgentDashboardClient 
      user={user} 
      properties={properties}
      applications={applications}
      stats={stats}
    />
  );
}