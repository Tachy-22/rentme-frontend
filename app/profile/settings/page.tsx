import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { SettingsClient } from '@/components/profile/SettingsClient';

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return <SettingsClient user={user} />;
}