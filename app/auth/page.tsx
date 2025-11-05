import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import AuthPage from '@/components/auth/AuthPage';

export default async function AuthPageRoute() {
  const userResult = await getCurrentUser();
  
  if (userResult.success && userResult.user) {
    const user = userResult.user;
    // Redirect based on user role
    switch (user.role) {
      case 'renter':
        redirect('/dashboard');
      case 'agent':
        redirect('/agent/dashboard');
      case 'admin':
        redirect('/admin/dashboard');
      default:
        redirect('/dashboard');
    }
  }

  return <AuthPage />;
}