import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import AddPropertyPage from '@/components/agent/AddPropertyPage';
import { redirect } from 'next/navigation';

export default async function NewPropertyPage() {
  const userResult = await getCurrentUser();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth');
  }

  const user = userResult.user;

  if (user.role !== 'agent') {
    redirect('/dashboard');
  }

  return <AddPropertyPage user={user} />;
}