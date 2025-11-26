'use client';

import { useState } from 'react';
import { User, RenterProfile } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  MapPin,
  Shield,
  ArrowRight,
  Search,
  X
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
  const renterProfile = user as unknown as RenterProfile;
  const isVerified = renterProfile?.verificationStatus || false;
  const [showVerificationBanner, setShowVerificationBanner] = useState(!isVerified);
console.log({renterProfile, user})
  return (
    <div className="space-y-8 p-6 overflow-auto">
      {/* Welcome Section - No Card */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {renterProfile?.firstName}!
        </h1>
      </div>

      {/* Verification Banner - Separate and Dismissable */}
      {!isVerified && showVerificationBanner && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900">Get verified to unlock full access</h3>
                <p className="text-sm text-orange-700 mt-1">
                  Upload your student ID to message agents and access priority listings
                </p>
                <Button 
                  size="sm" 
                  className="mt-3 bg-orange-600 hover:bg-orange-700"
                  asChild
                >
                  <Link href="/verification">
                    Get Verified
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVerificationBanner(false)}
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-100 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Recommended Properties */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-muted-foreground">Recommended for You</h2>
            <p className="text-muted-foreground mt-1">Properties that match your preferences</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/properties">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Properties Grid */}
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
                      ₦{property.price?.amount?.toLocaleString()}/ Year
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
      </div>
    </div>
  );
}