import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import VerificationPage from '@/components/verification/VerificationPage';
import RenterLayout from '@/components/layout/RenterLayout';
import AgentLayout from '@/components/layout/AgentLayout';
import { redirect } from 'next/navigation';

export default async function VerificationPageRoute() {
  const userResult = await getCurrentUser();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth');
  }

  const user = userResult.user;
  
  const LayoutComponent = user.role === 'agent' ? AgentLayout : RenterLayout;

  return (
    <LayoutComponent>
      <VerificationPage user={user} />
    </LayoutComponent>
  );
}