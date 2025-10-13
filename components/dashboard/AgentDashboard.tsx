'use client';

import React, { useEffect, useState } from 'react';
import { User, AgentProfile, Property, Application, RenterProfile } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Users, MessageSquare, Calendar, TrendingUp, Star, Plus } from 'lucide-react';

interface AgentDashboardProps {
  user: User;
}

interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  pendingApplications: number;
  monthlyRevenue: number;
  totalViews: number;
  totalInquiries: number;
}

interface EnrichedApplication extends Application {
  renter?: User;
  property?: Property;
}

export default function AgentDashboard({ user }: AgentDashboardProps) {
  const profile = user.profile as AgentProfile;
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeProperties: 0,
    pendingApplications: 0,
    monthlyRevenue: 0,
    totalViews: 0,
    totalInquiries: 0
  });
  const [recentApplications, setRecentApplications] = useState<EnrichedApplication[]>([]);
  const [topProperties, setTopProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to get renter name safely
  const getRenterName = (renter?: User): string => {
    if (!renter) return 'Unknown Renter';
    const profile = renter.profile as RenterProfile;
    return `${profile.firstName} ${profile.lastName}`;
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Load stats
        const { getAgentPropertyStats } = await import('@/actions/properties/getPropertyStats');
        const statsResult = await getAgentPropertyStats(user.id);
        
        if (statsResult.success) {
          setStats({
            totalProperties: statsResult.stats.totalProperties,
            activeProperties: statsResult.stats.activeProperties,
            pendingApplications: statsResult.stats.pendingApplications,
            monthlyRevenue: statsResult.stats.monthlyRevenue,
            totalViews: statsResult.stats.totalViews,
            totalInquiries: statsResult.stats.totalInquiries
          });
        }

        // Load recent applications
        const { getAgentApplications } = await import('@/actions/applications/getAgentApplications');
        const applicationsResult = await getAgentApplications(user.id, 5);
        
        if (applicationsResult.success) {
          setRecentApplications(applicationsResult.applications);
        }

        // Load top properties
        const { getAgentProperties } = await import('@/actions/properties/getAgentProperties');
        const propertiesResult = await getAgentProperties(user.id);
        
        if (propertiesResult.success) {
          // Sort by views and take top 3
          const sortedProperties = propertiesResult.properties
            .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
            .slice(0, 3);
          setTopProperties(sortedProperties);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user.id]);

  const statsData = [
    {
      title: 'Active Properties',
      value: stats.activeProperties.toString(),
      description: 'Properties currently listed',
      icon: Building,
      color: 'text-blue-500',
    },
    {
      title: 'Pending Applications',
      value: stats.pendingApplications.toString(),
      description: 'Applications awaiting review',
      icon: Calendar,
      color: 'text-orange-500',
    },
    {
      title: 'Total Inquiries',
      value: stats.totalInquiries.toString(),
      description: 'Ongoing chats with renters',
      icon: MessageSquare,
      color: 'text-green-500',
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      description: 'Commission earned this month',
      icon: TrendingUp,
      color: 'text-purple-500',
    },
  ];

  const quickActions = [
    {
      title: 'Add Property',
      description: 'List a new property',
      icon: Plus,
      href: '/agent/properties/new',
      color: 'bg-blue-500',
    },
    {
      title: 'Review Applications',
      description: 'Process pending applications',
      icon: Calendar,
      href: '/agent/applications',
      color: 'bg-orange-500',
    },
    {
      title: 'Manage Properties',
      description: 'View and edit your listings',
      icon: Building,
      href: '/agent/properties',
      color: 'bg-green-500',
    },
    {
      title: 'View Analytics',
      description: 'Check performance metrics',
      icon: TrendingUp,
      href: '/agent/analytics',
      color: 'bg-purple-500',
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {profile.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s your property management overview for today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Agent Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>
              Your agent metrics and ratings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Agent Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{profile.rating}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Based on {profile.totalReviews} reviews
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Response Time</span>
                  <span className="font-semibold">{profile.responseTime}h</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Average response to inquiries
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Deals</span>
                  <span className="font-semibold">{profile.totalDeals}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Successful property deals
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for property management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  asChild
                >
                  <a href={action.href} className="space-y-2">
                    <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="space-y-1 text-left">
                      <p className="font-medium">{action.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>
                Latest applications for your properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No recent applications
                  </div>
                ) : (
                  recentApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {getRenterName(application.renter)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {application.property?.title || 'Property not found'}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(application.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          application.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : application.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {application.status}
                        </span>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/agent/applications/${application.id}`}>
                            Review
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Properties */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Properties</CardTitle>
              <CardDescription>
                Your most viewed properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProperties.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No properties found
                  </div>
                ) : (
                  topProperties.map((property) => (
                    <div key={property.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{property.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          property.status === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : property.status === 'rented'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {property.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Views</p>
                          <p className="font-semibold">{property.viewCount || 0}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Saves</p>
                          <p className="font-semibold">{property.saveCount || 0}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Applications</p>
                          <p className="font-semibold">{property.applicationCount || 0}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/agent/properties/${property.id}`}>
                            View Details
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}