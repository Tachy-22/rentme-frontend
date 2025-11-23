import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { getAgentProperties } from '@/actions/properties/getAgentProperties';
import AgentPropertiesPage from '@/components/agent/AgentPropertiesPage';
import { redirect } from 'next/navigation';

export default async function AgentPropertiesPageRoute() {
  const userResult = await getCurrentUser();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth');
  }

  const user = userResult.user;

  if (user.role !== 'agent') {
    redirect('/dashboard');
  }

  // Get agent properties
  const propertiesResult = await getAgentProperties();
  const properties = propertiesResult.success ? propertiesResult.data : [];

  return <AgentPropertiesPage user={user} properties={properties as unknown as Parameters<typeof AgentPropertiesPage>[0]['properties']} />;
}