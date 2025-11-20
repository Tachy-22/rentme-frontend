import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { getRenterDashboardData } from '@/actions/dashboard/getRenterDashboardData';
import RenterDashboard from '@/components/dashboard/RenterDashboard';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const userResult = await getCurrentUser();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth');
  }

  const user = userResult.user;

  if (user.role !== 'renter') {
    if (user.role === 'agent') {
      redirect('/agent/dashboard');
    } else if (user.role === 'admin') {
      redirect('/admin/dashboard');
    }
  }

  // Get comprehensive dashboard data
  const dashboardResult = await getRenterDashboardData();
  const dashboardData = dashboardResult.success ? dashboardResult.data : {
    stats: null,
    recentActivities: [],
    recommendedProperties: []
  };

  return (
    <RenterDashboard 
      user={user} 
      stats={dashboardData?.stats}
      recentActivities={dashboardData?.recentActivities}
      recommendedProperties={dashboardData?.recommendedProperties || []}
    />
  );
}