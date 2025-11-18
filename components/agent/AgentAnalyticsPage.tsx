'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Eye, 
  MessageCircle, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  DollarSign,
  Home,
  Activity,
  RefreshCw
} from 'lucide-react';
import { getPropertyAnalytics } from '@/actions/analytics/getPropertyAnalytics';

interface PropertyAnalytics {
  propertyId: string;
  title: string;
  status: string;
  views: number;
  inquiries: number;
  applications: number;
  conversionRate: number;
  daysListed: number;
  location: {
    city: string;
    area?: string;
  };
  price: {
    amount: number;
    currency: string;
  };
}

interface AgentAnalytics {
  totalProperties: number;
  activeProperties: number;
  totalViews: number;
  totalInquiries: number;
  totalApplications: number;
  averageConversionRate: number;
  topPerformingProperty?: PropertyAnalytics;
  recentActivity: {
    viewsThisWeek: number;
    inquiriesThisWeek: number;
    applicationsThisWeek: number;
  };
  monthlyStats: {
    month: string;
    views: number;
    inquiries: number;
    applications: number;
  }[];
}

export default function AgentAnalyticsPage() {
  const [agentAnalytics, setAgentAnalytics] = useState<AgentAnalytics | null>(null);
  const [propertyAnalytics, setPropertyAnalytics] = useState<PropertyAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const result = await getPropertyAnalytics();
      
      if (!result.success) {
        setError(result.error || 'Failed to load analytics');
        return;
      }

      if (result.data) {
        setAgentAnalytics(result.data.agentAnalytics);
        setPropertyAnalytics(result.data.propertyAnalytics);
      }
      setError(null);
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'rented':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConversionColor = (rate: number) => {
    if (rate >= 5) return 'text-green-600';
    if (rate >= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!agentAnalytics) {
    return (
      <div className="min-h-screen bg-background p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium">No analytics data available</h3>
              <p className="text-muted-foreground">Create some properties to see analytics</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Property Analytics</h1>
            <p className="text-muted-foreground">
              Track your property performance and engagement
            </p>
          </div>
          <Button onClick={loadAnalytics} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Properties</p>
                  <p className="text-2xl font-bold">{agentAnalytics.totalProperties}</p>
                  <p className="text-xs text-muted-foreground">
                    {agentAnalytics.activeProperties} active
                  </p>
                </div>
                <Home className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{agentAnalytics.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-green-600">
                    +{agentAnalytics.recentActivity.viewsThisWeek} this week
                  </p>
                </div>
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Inquiries</p>
                  <p className="text-2xl font-bold">{agentAnalytics.totalInquiries}</p>
                  <p className="text-xs text-blue-600">
                    +{agentAnalytics.recentActivity.inquiriesThisWeek} this week
                  </p>
                </div>
                <MessageCircle className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Applications</p>
                  <p className="text-2xl font-bold">{agentAnalytics.totalApplications}</p>
                  <p className="text-xs text-purple-600">
                    {agentAnalytics.averageConversionRate.toFixed(1)}% conversion
                  </p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Property */}
        {agentAnalytics.topPerformingProperty && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Performing Property
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {agentAnalytics.topPerformingProperty.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {agentAnalytics.topPerformingProperty.location.city}
                    {agentAnalytics.topPerformingProperty.location.area && 
                      `, ${agentAnalytics.topPerformingProperty.location.area}`
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Listed for {agentAnalytics.topPerformingProperty.daysListed} days
                  </p>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-semibold">{agentAnalytics.topPerformingProperty.views}</p>
                    <p className="text-muted-foreground">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{agentAnalytics.topPerformingProperty.inquiries}</p>
                    <p className="text-muted-foreground">Inquiries</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{agentAnalytics.topPerformingProperty.applications}</p>
                    <p className="text-muted-foreground">Applications</p>
                  </div>
                  <div className="text-center">
                    <p className={`font-semibold ${getConversionColor(agentAnalytics.topPerformingProperty.conversionRate)}`}>
                      {agentAnalytics.topPerformingProperty.conversionRate.toFixed(1)}%
                    </p>
                    <p className="text-muted-foreground">Conversion</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Monthly Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agentAnalytics.monthlyStats.map((month, index) => (
                <div key={month.month} className="grid grid-cols-5 gap-4 items-center">
                  <div className="font-medium">{month.month}</div>
                  <div className="text-center">
                    <div className="font-semibold">{month.views}</div>
                    <div className="text-xs text-muted-foreground">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{month.inquiries}</div>
                    <div className="text-xs text-muted-foreground">Inquiries</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{month.applications}</div>
                    <div className="text-xs text-muted-foreground">Applications</div>
                  </div>
                  <div className="text-center">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min((month.views / Math.max(...agentAnalytics.monthlyStats.map(m => m.views))) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Property Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Property Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {propertyAnalytics.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No properties found</p>
              ) : (
                propertyAnalytics.map((property) => (
                  <div key={property.propertyId} className="border rounded-lg p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{property.title}</h3>
                          <Badge className={getStatusColor(property.status)}>
                            {property.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {property.location.city}
                          {property.location.area && `, ${property.location.area}`} • 
                          {formatCurrency(property.price.amount)} • 
                          {property.daysListed} days listed
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-center lg:text-left">
                        <div>
                          <div className="flex items-center gap-1 justify-center lg:justify-start">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{property.views}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">Views</div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-1 justify-center lg:justify-start">
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{property.inquiries}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">Inquiries</div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-1 justify-center lg:justify-start">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{property.applications}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">Applications</div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-1 justify-center lg:justify-start">
                            {property.conversionRate >= 2 ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className={`font-semibold ${getConversionColor(property.conversionRate)}`}>
                              {property.conversionRate.toFixed(1)}%
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">Conversion</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}