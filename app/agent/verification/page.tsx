import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import VerificationPage from '@/components/verification/VerificationPage';
import { redirect } from 'next/navigation';

export default async function AgentVerificationPage() {
  const userResult = await getCurrentUser();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth');
  }

  const user = userResult.user;

  if (user.role !== 'agent') {
    redirect('/dashboard');
  }

  return <VerificationPage user={user} />;
}