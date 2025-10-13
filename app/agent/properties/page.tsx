import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { getAgentProperties } from '@/actions/properties/getAgentProperties';
import { AgentPropertiesClient } from '@/components/agent/AgentPropertiesClient';

export const dynamic = 'force-dynamic';

export default async function AgentPropertiesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Only agents can access this page
  if (user.role !== 'agent') {
    redirect('/dashboard');
  }

  // Fetch agent's properties
  const propertiesResult = await getAgentProperties(user.id);
  const properties = propertiesResult.success ? propertiesResult.properties : [];

  return (
    <AgentPropertiesClient 
      user={user} 
      properties={properties}
    />
  );
}