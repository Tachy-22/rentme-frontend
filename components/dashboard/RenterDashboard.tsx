'use client';

import React from 'react';
import { User, Property, Application, RenterProfile } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Heart, MessageSquare, Calendar, TrendingUp } from 'lucide-react';

interface DashboardStats {
  savedProperties: number;
  activeApplications: number;
  unreadMessages: number;
  profileViews: number;
}

interface EnrichedApplication extends Application {
  property?: Property;
}

interface RenterDashboardProps {
  user: User;
  stats: DashboardStats;
  recentApplications: EnrichedApplication[];
  recommendedProperties: Property[];
}

export default function RenterDashboard({ 
  user, 
  stats, 
  recentApplications, 
  recommendedProperties 
}: RenterDashboardProps) {
  const profile = user.profile as RenterProfile;
  const statsData = [
    {
      title: 'Saved Properties',
      value: stats.savedProperties.toString(),
      description: 'Properties in your wishlist',
      icon: Heart,
      color: 'text-red-500',
    },
    {
      title: 'Active Applications',
      value: stats.activeApplications.toString(),
      description: 'Applications in review',
      icon: Calendar,
      color: 'text-blue-500',
    },
    {
      title: 'Messages',
      value: stats.unreadMessages.toString(),
      description: 'Unread conversations',
      icon: MessageSquare,
      color: 'text-green-500',
    },
    {
      title: 'Profile Views',
      value: stats.profileViews.toString(),
      description: 'Times agents viewed your profile',
      icon: TrendingUp,
      color: 'text-purple-500',
    },
  ];

  const quickActions = [
    {
      title: 'Search Properties',
      description: 'Find your perfect home',
      icon: Search,
      href: '/search',
      color: 'bg-blue-500',
    },
    {
      title: 'View Messages',
      description: 'Chat with agents',
      icon: MessageSquare,
      href: '/messages',
      color: 'bg-green-500',
    },
    {
      title: 'Saved Properties',
      description: 'Review your favorites',
      icon: Heart,
      href: '/saved',
      color: 'bg-red-500',
    },
    {
      title: 'Applications',
      description: 'Track your applications',
      icon: Calendar,
      href: '/applications',
      color: 'bg-purple-500',
    },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {profile.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your property search today.
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to help you find your perfect home
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
                Track your latest applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No applications yet
                  </div>
                ) : (
                  recentApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {application.property?.title || 'Property not found'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {application.property?.location?.address || 'Location not available'}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            Applied {new Date(application.submittedAt).toLocaleDateString()}
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
                          <a href={`/applications/${application.id}`}>
                            View
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recommended Properties */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Properties</CardTitle>
              <CardDescription>
                Properties that match your preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedProperties.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No recommendations yet
                  </div>
                ) : (
                  recommendedProperties.slice(0, 3).map((property) => (
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
                      <p className="text-sm text-muted-foreground mb-2">
                        {property.location?.address || 'Location not available'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">
                          ${property.price.amount.toLocaleString()}/{property.price.period === 'monthly' ? 'month' : property.price.period}
                        </span>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/properties/${property.id}`}>
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