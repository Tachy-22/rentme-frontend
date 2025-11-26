import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { getProperty } from '@/actions/properties/getProperty';
import { getAgent } from '@/actions/agents/getAgent';
import PropertyDetailsPage from '@/components/properties/PropertyDetailsPage';
import RenterLayout from '@/components/layout/RenterLayout';
import { redirect, notFound } from 'next/navigation';
import { AgentProfile } from '@/types';

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const userResult = await getCurrentUser();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth');
  }

  // Get property data
  const propertyResult = await getProperty(id);
  
  if (!propertyResult.success || !propertyResult.data) {
    notFound();
  }

  const property = propertyResult.data;

  // Get agent data using agentId from the property data  
  let agentData: Record<string, unknown> | null = null;
  
  // Access agentId from the raw property data
  const rawPropertyData = propertyResult.data as Record<string, unknown>;
  const agentId = rawPropertyData.agentId as string | undefined;
  
  if (agentId) {
    const agentResult = await getAgent(agentId);
    if (agentResult.success && agentResult.agent) {
      agentData = agentResult.agent;
    }
  }

  // Attach agent data to property
  const propertyWithAgent = {
    ...property,
    agent: agentData ? {
      id: agentData.id as string,
      name: `${(agentData.profile as AgentProfile)?.firstName || ''} ${(agentData.profile as AgentProfile)?.lastName || ''}`.trim() || 'Unknown Agent',
      profilePicture: (agentData.profile as AgentProfile)?.profilePicture || '',
      rating: 4.5, // Default rating - could be calculated from reviews later
      company: (agentData.profile as AgentProfile)?.company || '',
      totalReviews: 0, // Could be fetched from reviews collection later
      responseTime: 24 // Default response time in hours
    } : property.agent // Keep existing mock agent if no real agent found
  };

  return (
    <RenterLayout>
      <PropertyDetailsPage property={propertyWithAgent as unknown as Parameters<typeof PropertyDetailsPage>[0]['property']} />
    </RenterLayout>
  );
}