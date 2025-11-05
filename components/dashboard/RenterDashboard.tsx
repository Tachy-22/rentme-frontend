'use client';

import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  MessageCircle, 
  FileText, 
  Heart, 
  TrendingUp,
  MapPin,
  Clock,
  Shield,
  ArrowRight,
  Search
} from 'lucide-react';
import Link from 'next/link';

interface RenterDashboardProps {
  user: User;
  stats?: {
    savedProperties: number;
    applications: number;
    conversations: number;
    messagesThisWeek: number;
    pendingApplications: number;
    approvedApplications: number;
  } | null;
  recentActivities?: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    time: string;
    icon: string;
  }>;
  recommendedProperties?: Array<{
    id: string;
    title: string;
    location: { address: string; city: string };
    price: { amount: number; currency: string; period: string };
    images: Array<{ url: string }>;
    details: { bedrooms: number; bathrooms: number };
  }>;
}

export default function RenterDashboard({ user, stats, recentActivities = [], recommendedProperties = [] }: RenterDashboardProps) {
  const renterProfile = user.profile as any;
  const isVerified = renterProfile?.identityVerified || false;

  // Use real stats or fallback to zeros
  const dashboardStats = stats || {
    savedProperties: 0,
    applications: 0,
    conversations: 0,
    messagesThisWeek: 0,
    pendingApplications: 0,
    approvedApplications: 0
  };

  // Icon mapping function
  const getIcon = (iconName: string) => {
    const icons = {
      FileText,
      MessageCircle,
      Home,
      Search,
      Heart,
      TrendingUp,
      Clock,
      Shield,
      ArrowRight,
      MapPin
    };
    return icons[iconName as keyof typeof icons] || Home;
  };



  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {renterProfile?.firstName}!
            </h1>
            <p className="text-blue-100 mt-1">
              Find your perfect home near campus
            </p>
          </div>
          <Avatar className="h-16 w-16 border-2 border-white/20">
            <AvatarImage src={renterProfile?.profilePicture} />
            <AvatarFallback className="bg-white/20 text-white">
              {renterProfile?.firstName?.[0]}{renterProfile?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>

        {!isVerified && (
          <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="font-medium">Get verified to unlock full access</span>
            </div>
            <p className="text-sm text-blue-100 mt-1">
              Upload your student ID to message agents and access priority listings
            </p>
            <Button 
              variant="secondary" 
              size="sm" 
              className="mt-2"
              asChild
            >
              <Link href="/verification">
                Get Verified
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Heart className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dashboardStats.savedProperties}</p>
                <p className="text-sm text-muted-foreground">Saved Properties</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dashboardStats.applications}</p>
                <p className="text-sm text-muted-foreground">Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageCircle className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dashboardStats.conversations}</p>
                <p className="text-sm text-muted-foreground">Conversations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dashboardStats.messagesThisWeek}</p>
                <p className="text-sm text-muted-foreground">Messages This Week</p>
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
            <CardDescription>Your latest interactions and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => {
                const Icon = getIcon(activity.icon);
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                    <div className="p-2 bg-muted rounded-lg">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm">Start browsing properties to see your activity here</p>
              </div>
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
              <Link href="/properties">
                <Search className="w-4 h-4 mr-2" />
                Browse Properties
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/saved">
                <Heart className="w-4 h-4 mr-2" />
                View Saved Properties
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/messages">
                <MessageCircle className="w-4 h-4 mr-2" />
                Check Messages
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/applications">
                <FileText className="w-4 h-4 mr-2" />
                My Applications
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Properties */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recommended for You</CardTitle>
            <CardDescription>Properties that match your preferences</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/properties">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedProperties.length > 0 ? (
              recommendedProperties.map((property) => (
                <div key={property.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div 
                    className="h-40 bg-cover bg-center bg-muted"
                    style={{ 
                      backgroundImage: property.images?.[0]?.url ? `url(${property.images[0].url})` : 'none'
                    }}
                  >
                    {!property.images?.[0]?.url && (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{property.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      {property.location?.address}, {property.location?.city}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-lg">
                        ₦{property.price?.amount?.toLocaleString()}/{property.price?.period}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        {property.details?.bedrooms}BR • {property.details?.bathrooms}BA
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3" asChild>
                      <Link href={`/properties/${property.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recommendations yet</p>
                <p className="text-sm">Complete your profile to get personalized property recommendations</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/properties">
                    Browse All Properties
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}