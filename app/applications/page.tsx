import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { getRenterApplications } from '@/actions/applications/getRenterApplications';
import { ApplicationsClient } from '@/components/applications/ApplicationsClient';

export default async function ApplicationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Only renters can access this page
  if (user.role !== 'renter') {
    redirect('/dashboard');
  }

  // Fetch all user applications
  const applicationsResult = await getRenterApplications(user.id);
  const applications = applicationsResult.success ? applicationsResult.applications : [];

  return (
    <ApplicationsClient 
      user={user} 
      applications={applications}
    />
  );
}