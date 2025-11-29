import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import ProfileClient from '@/components/profile/ProfileClient';
import RenterLayout from '@/components/layout/RenterLayout';
import { redirect } from 'next/navigation';
import { RenterProfile } from '@/types';

export default async function ProfilePage() {
  const userResult = await getCurrentUser();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth');
  }

  const user = userResult.user;

  // Profile page is available to all authenticated users
  return (
    <RenterLayout>
      <ProfileClient user={user as unknown as RenterProfile} />
    </RenterLayout>
  );
}