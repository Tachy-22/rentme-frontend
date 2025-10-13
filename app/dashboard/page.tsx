import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { getRenterStats } from '@/actions/renters/getRenterStats';
import { getRenterApplications } from '@/actions/applications/getRenterApplications';
import { getRecommendedProperties } from '@/actions/properties/getRecommendedProperties';
import RenterDashboard from '@/components/dashboard/RenterDashboard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Redirect based on user role
  switch (user.role) {
    case 'super_admin':
      redirect('/super-admin/dashboard');
    case 'admin':
      redirect('/admin/dashboard');
    case 'agent':
      redirect('/agent/dashboard');
    case 'renter':
      // Renters stay on main dashboard
      break;
    default:
      redirect('/auth/login');
  }

  // Fetch renter dashboard data
  const [statsResult, applicationsResult, propertiesResult] = await Promise.all([
    getRenterStats(user.id),
    getRenterApplications(user.id, 5),
    getRecommendedProperties(user.id, 6)
  ]);

  const stats = statsResult.success ? statsResult.stats : {
    savedProperties: 0,
    activeApplications: 0,
    unreadMessages: 0,
    profileViews: 0
  };

  const applications = applicationsResult.success ? applicationsResult.applications : [];
  const recommendedProperties = propertiesResult.success ? propertiesResult.properties : [];

  return (
    <RenterDashboard 
      user={user} 
      stats={stats}
      recentApplications={applications}
      recommendedProperties={recommendedProperties}
    />
  );
}