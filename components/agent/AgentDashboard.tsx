'use client';

import { User, DashboardActivity } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Home,
  MessageCircle,
  FileText,
  Users,
  TrendingUp,
  Eye,
  Plus,
  Shield,
  ArrowRight,
  Clock,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

interface AgentDashboardProps {
  user: User;
  stats?: {
    totalProperties: number;
    activeProperties: number;
    rentedProperties: number;
    totalViews: number;
    totalInquiries: number;
    applications: number;
    conversations: number;
    propertiesThisWeek: number;
    pendingApplications: number;
    approvedApplications: number;
    averageRating: number;
  } | null;
  recentActivities?: DashboardActivity[];
}

export default function AgentDashboard({ user, stats, recentActivities = [] }: AgentDashboardProps) {
  const agentProfile = user.profile as any;
  const isVerified = agentProfile?.verificationStatus === "verified" || false;

  // Use real stats or fallback to zeros
  const dashboardStats = stats || {
    totalProperties: 0,
    activeProperties: 0,
    rentedProperties: 0,
    totalViews: 0,
    totalInquiries: 0,
    applications: 0,
    conversations: 0,
    propertiesThisWeek: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    averageRating: 0
  };

  // Helper function to get relative time
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  // Helper function to get icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_inquiry':
        return MessageCircle;
      case 'new_application':
        return FileText;
      case 'property_viewed':
        return CheckCircle;
      case 'review_received':
        return CheckCircle;
      default:
        return MessageCircle;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {agentProfile?.firstName}!
              </p>
            </div>
            <Button asChild>
              <Link href="/agent/properties/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Link>
            </Button>
          </div>

          {!isVerified && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Verification Required</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Complete verification to access unlimited listings and premium features
              </p>
              <Button size="sm" className="mt-2" asChild>
                <Link href="/agent/verification">
                  Get Verified
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Home className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{dashboardStats.totalProperties}</p>
                  <p className="text-sm text-muted-foreground">Total Properties</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{dashboardStats.totalInquiries}</p>
                  <p className="text-sm text-muted-foreground">Active Inquiries</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{dashboardStats.applications}</p>
                  <p className="text-sm text-muted-foreground">Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{dashboardStats.totalViews}</p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest updates and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No recent activities</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your recent activity will appear here
                  </p>
                </div>
              ) : (
                recentActivities.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  const activityContent = (
                    <div className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                      <div className="p-2 bg-muted rounded-lg">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {getRelativeTime(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );

                  return activity.actionUrl ? (
                    <Link key={activity.id} href={activity.actionUrl}>
                      {activityContent}
                    </Link>
                  ) : (
                    <div key={activity.id}>
                      {activityContent}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href="/agent/properties">
                  <Home className="w-4 h-4 mr-2" />
                  Manage Properties
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/agent/messages">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  View Messages
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/agent/applications">
                  <FileText className="w-4 h-4 mr-2" />
                  Review Applications
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/agent/renters">
                  <Users className="w-4 h-4 mr-2" />
                  Matched Renters
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}