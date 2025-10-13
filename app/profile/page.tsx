import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { ProfileClient } from '@/components/profile/ProfileClient';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return <ProfileClient user={user} />;
}