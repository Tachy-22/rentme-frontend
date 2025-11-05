import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { getRenterApplications } from '@/actions/applications/getRenterApplications';
import ApplicationsClient from '@/components/applications/ApplicationsClient';
import RenterLayout from '@/components/layout/RenterLayout';
import { redirect } from 'next/navigation';

export default async function ApplicationsPage() {
  const userResult = await getCurrentUser();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth');
  }

  const user = userResult.user;

  if (user.role !== 'renter') {
    redirect('/dashboard');
  }

  // Get renter applications
  const applicationsResult = await getRenterApplications();
  const applications = applicationsResult.success ? (applicationsResult.data || []) : [];

  return (
    <RenterLayout>
      <ApplicationsClient user={user} initialApplications={applications} />
    </RenterLayout>
  );
}