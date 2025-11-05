'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  Building2,
  Shield,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import VerificationManagement from './VerificationManagement';
import UserManagement from './UserManagement';
import PropertyManagement from './PropertyManagement';
import Analytics from './Analytics';
import { getVerificationStats } from '@/actions/admin/verificationActions';
import { getUserStats } from '@/actions/admin/userManagement';
import { getPropertyStats } from '@/actions/admin/propertyManagement';
import { getMessageStats } from '@/actions/admin/analytics';

interface AdminStats {
  verifications: {
    total: number;
    pending: number;
    verified: number;
    rejected: number;
    thisWeek: number;
  };
  users: {
    total: number;
    renters: number;
    agents: number;
    verified: number;
    thisWeek: number;
  };
  properties: {
    total: number;
    available: number;
    rented: number;
    pending: number;
    thisWeek: number;
    totalViews: number;
  };
  messages: {
    totalConversations: number;
    totalMessages: number;
    activeConversations: number;
    messagesThisWeek: number;
  };
}

interface AdminDashboardProps {
  user: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const [verificationResult, userResult, propertyResult, messageResult] = await Promise.all([
        getVerificationStats(),
        getUserStats(),
        getPropertyStats(),
        getMessageStats()
      ]);

      const statsData: AdminStats = {
        verifications: verificationResult.success && verificationResult.data ? verificationResult.data : {
          total: 0, pending: 0, verified: 0, rejected: 0, thisWeek: 0
        },
        users: userResult.success && userResult.data ? userResult.data : {
          total: 0, renters: 0, agents: 0, verified: 0, thisWeek: 0
        },
        properties: propertyResult.success && propertyResult.data ? propertyResult.data : {
          total: 0, available: 0, rented: 0, pending: 0, thisWeek: 0, totalViews: 0
        },
        messages: messageResult.success && messageResult.data ? messageResult.data : {
          totalConversations: 0, totalMessages: 0, activeConversations: 0, messagesThisWeek: 0
        }
      };

      setStats(statsData);
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage and monitor the RentMe platform</p>
        </div>

        {/* Overview Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.users.total}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.users.thisWeek} this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verifications</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.verifications.total}</div>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1 text-yellow-600" />
                    {stats.verifications.pending}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                    {stats.verifications.verified}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <XCircle className="w-3 h-3 mr-1 text-red-600" />
                    {stats.verifications.rejected}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  +{stats.verifications.thisWeek} this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Properties</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.properties.total}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.properties.thisWeek} this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.messages.totalMessages}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.messages.messagesThisWeek} this week
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Alert Cards */}
        {stats && stats.verifications.pending > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">
                    {stats.verifications.pending} verification requests pending review
                  </p>
                  <p className="text-sm text-yellow-700">
                    Please review and process these requests to help users get verified.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="verifications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="verifications">Verification Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="properties">Property Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="verifications">
            <VerificationManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="properties">
            <PropertyManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}