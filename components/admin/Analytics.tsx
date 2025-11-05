'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Building2, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  MapPin,
  GraduationCap,
  BarChart3,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getAnalyticsData, getMessageStats } from '@/actions/admin/analytics';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalProperties: number;
    totalConversations: number;
    totalApplications: number;
    newUsersThisWeek: number;
    newUsersLastMonth: number;
    newPropertiesThisWeek: number;
    newPropertiesLastMonth: number;
    activeConversations: number;
    newApplicationsThisWeek: number;
  };
  userMetrics: {
    totalRenters: number;
    totalAgents: number;
    verifiedUsers: number;
    pendingVerifications: number;
  };
  propertyMetrics: {
    availableProperties: number;
    rentedProperties: number;
    pendingProperties: number;
    totalViews: number;
    averagePrice: number;
  };
  distributions: {
    universities: Array<{ name: string; count: number }>;
    locations: Array<{ name: string; count: number }>;
    propertyTypes: Array<{ name: string; count: number }>;
  };
  trends: {
    monthlyRegistrations: Array<{ month: string; users: number }>;
    monthlyListings: Array<{ month: string; properties: number }>;
  };
}

interface MessageStats {
  totalConversations: number;
  totalMessages: number;
  activeConversations: number;
  messagesThisWeek: number;
  averageMessagesPerConversation: number;
}

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [messageStats, setMessageStats] = useState<MessageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const [analyticsResult, messageResult] = await Promise.all([
        getAnalyticsData(),
        getMessageStats()
      ]);

      if (analyticsResult.success && analyticsResult.data) {
        setAnalyticsData(analyticsResult.data);
      }

      if (messageResult.success && messageResult.data) {
        setMessageStats(messageResult.data);
      }

      if (!analyticsResult.success && !messageResult.success) {
        toast.error('Failed to load analytics data');
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const GrowthIndicator = ({ value, isPositive }: { value: number; isPositive?: boolean }) => {
    const positive = isPositive !== undefined ? isPositive : value >= 0;
    return (
      <div className={cn("flex items-center gap-1", positive ? "text-green-600" : "text-red-600")}>
        {positive ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        <span className="text-xs font-medium">{Math.abs(value)}%</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <p className="text-muted-foreground">Platform insights and performance metrics</p>
      </div>

      {analyticsData && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.overview.totalUsers}</div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      +{analyticsData.overview.newUsersThisWeek} this week
                    </p>
                    <GrowthIndicator 
                      value={calculateGrowthRate(
                        analyticsData.overview.newUsersThisWeek,
                        analyticsData.overview.newUsersLastMonth / 4
                      )} 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Properties</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.overview.totalProperties}</div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      +{analyticsData.overview.newPropertiesThisWeek} this week
                    </p>
                    <GrowthIndicator 
                      value={calculateGrowthRate(
                        analyticsData.overview.newPropertiesThisWeek,
                        analyticsData.overview.newPropertiesLastMonth / 4
                      )} 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversations</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.overview.totalConversations}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analyticsData.overview.activeConversations} active this week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Applications</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.overview.totalApplications}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +{analyticsData.overview.newApplicationsThisWeek} this week
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Growth Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    User Registration Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.trends.monthlyRegistrations.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{data.month}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ 
                                width: `${Math.min((data.users / Math.max(...analyticsData.trends.monthlyRegistrations.map(m => m.users))) * 100, 100)}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">{data.users}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Property Listing Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.trends.monthlyListings.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{data.month}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ 
                                width: `${Math.min((data.properties / Math.max(...analyticsData.trends.monthlyListings.map(m => m.properties))) * 100, 100)}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">{data.properties}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* User Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Renters</CardTitle>
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{analyticsData.userMetrics.totalRenters}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((analyticsData.userMetrics.totalRenters / analyticsData.overview.totalUsers) * 100)}% of users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agents</CardTitle>
                  <Building2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{analyticsData.userMetrics.totalAgents}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((analyticsData.userMetrics.totalAgents / analyticsData.overview.totalUsers) * 100)}% of users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{analyticsData.userMetrics.verifiedUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((analyticsData.userMetrics.verifiedUsers / analyticsData.overview.totalUsers) * 100)}% verified
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                  <Calendar className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{analyticsData.userMetrics.pendingVerifications}</div>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </CardContent>
              </Card>
            </div>

            {/* University Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Top Universities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.distributions.universities.slice(0, 10).map((university, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{university.name}</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(university.count / analyticsData.distributions.universities[0].count) * 100} 
                          className="w-32"
                        />
                        <Badge variant="secondary">{university.count}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            {/* Property Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available</CardTitle>
                  <Building2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{analyticsData.propertyMetrics.availableProperties}</div>
                  <p className="text-xs text-muted-foreground">Ready to rent</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rented</CardTitle>
                  <Building2 className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{analyticsData.propertyMetrics.rentedProperties}</div>
                  <p className="text-xs text-muted-foreground">Currently occupied</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Activity className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{analyticsData.propertyMetrics.totalViews.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">All time views</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">₦{analyticsData.propertyMetrics.averagePrice.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Per month</p>
                </CardContent>
              </Card>
            </div>

            {/* Location and Type Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Top Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.distributions.locations.map((location, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{location.name}</span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(location.count / analyticsData.distributions.locations[0].count) * 100} 
                            className="w-24"
                          />
                          <Badge variant="secondary">{location.count}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Property Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.distributions.propertyTypes.map((type, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{type.name}</span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(type.count / analyticsData.distributions.propertyTypes[0].count) * 100} 
                            className="w-24"
                          />
                          <Badge variant="secondary">{type.count}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            {messageStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{messageStats.totalMessages.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      +{messageStats.messagesThisWeek} this week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{messageStats.activeConversations}</div>
                    <p className="text-xs text-muted-foreground">Active this week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Messages</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{messageStats.averageMessagesPerConversation}</div>
                    <p className="text-xs text-muted-foreground">Per conversation</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round((messageStats.activeConversations / messageStats.totalConversations) * 100)}%
                    </div>
                    <p className="text-xs text-muted-foreground">Conversations active</p>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">User Verification Rate</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round((analyticsData.userMetrics.verifiedUsers / analyticsData.overview.totalUsers) * 100)}%
                      </span>
                    </div>
                    <Progress value={(analyticsData.userMetrics.verifiedUsers / analyticsData.overview.totalUsers) * 100} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Property Occupancy Rate</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round((analyticsData.propertyMetrics.rentedProperties / analyticsData.overview.totalProperties) * 100)}%
                      </span>
                    </div>
                    <Progress value={(analyticsData.propertyMetrics.rentedProperties / analyticsData.overview.totalProperties) * 100} />
                  </div>

                  {messageStats && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Message Activity Rate</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round((messageStats.activeConversations / messageStats.totalConversations) * 100)}%
                        </span>
                      </div>
                      <Progress value={(messageStats.activeConversations / messageStats.totalConversations) * 100} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}