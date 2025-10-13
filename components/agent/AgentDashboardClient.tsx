'use client';

import React from 'react';
import Link from 'next/link';
import { User, Property, Application } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  FileText, 
  MessageSquare, 
  Eye, 
  Plus, 
  DollarSign
} from 'lucide-react';

interface AgentDashboardClientProps {
  user: User;
  properties: Property[];
  applications: Application[];
  stats: {
    totalProperties: number;
    availableProperties: number;
    totalApplications: number;
    pendingApplications: number;
    approvedApplications: number;
    totalViews: number;
    totalRevenue: number;
  };
}

export function AgentDashboardClient({ user, properties, applications, stats }: AgentDashboardClientProps) {
  const recentProperties = properties.slice(0, 3);
  const recentApplications = applications.slice(0, 5);

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.profile.firstName}! Here&apos;s an overview of your property management business.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProperties}</div>
              <p className="text-xs text-muted-foreground">
                {stats.availableProperties} available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingApplications} pending review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
              <p className="text-xs text-muted-foreground">
                Property page views
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From approved rentals
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to manage your properties and applications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild className="h-20 flex-col">
                <Link href="/properties/new">
                  <Plus className="h-6 w-6 mb-2" />
                  Add New Property
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col">
                <Link href="/agent/applications">
                  <FileText className="h-6 w-6 mb-2" />
                  Review Applications
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col">
                <Link href="/agent/messages">
                  <MessageSquare className="h-6 w-6 mb-2" />
                  Check Messages
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Properties */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Properties</CardTitle>
                <CardDescription>
                  Your latest property listings
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/agent/properties">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentProperties.length === 0 ? (
                <div className="text-center py-6">
                  <Home className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No properties yet</p>
                  <Button asChild className="mt-2" size="sm">
                    <Link href="/properties/new">Add Your First Property</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentProperties.map((property) => (
                    <div key={property.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{property.title}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {property.location.address}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
                            {property.status}
                          </Badge>
                          <span className="text-sm font-medium">
                            ${property.price.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/properties/${property.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>
                  Latest rental applications
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/agent/applications">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentApplications.length === 0 ? (
                <div className="text-center py-6">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No applications yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Applications will appear here when renters apply to your properties
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((application) => (
                    <div key={application.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          Application #{application.id.slice(-6)}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          Submitted {new Date(application.submittedAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={
                            application.status === 'pending' ? 'default' :
                            application.status === 'approved' ? 'default' :
                            'secondary'
                          }>
                            {application.status}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/applications/${application.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}