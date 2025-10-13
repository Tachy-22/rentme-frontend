'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Application, Property } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, MapPin, Eye, FileText } from 'lucide-react';

interface EnrichedApplication extends Application {
  property?: Property;
}

interface ApplicationsClientProps {
  user: User;
  applications: EnrichedApplication[];
}

export function ApplicationsClient({ user, applications }: ApplicationsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.property?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.property?.location?.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'under_review':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'under_review':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* <div>
          <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
          <p className="text-muted-foreground">
            Track the status of your property applications.
          </p>
        </div> */}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by property name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Applications Grid */}
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {applications.length === 0 
                  ? "You haven't submitted any applications yet." 
                  : "No applications match your current filters."
                }
              </p>
              {applications.length === 0 && (
                <Button asChild>
                  <Link href="/search">
                    Start Searching Properties
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">
                        {application.property?.title || 'Property Not Found'}
                      </CardTitle>
                      <CardDescription className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {application.property?.location?.address || 'Location not available'}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      {getStatusText(application.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(application.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Monthly Rent</p>
                      <p className="text-sm font-semibold">
                        ${application.property?.price.amount.toLocaleString()}/month
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Property Type</p>
                      <p className="text-sm capitalize">
                        {application.property?.type || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {application.status === 'approved' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-green-800 mb-2">🎉 Congratulations!</h4>
                      <p className="text-sm text-green-700">
                        Your application has been approved. Please check your email for next steps 
                        and lease documents.
                      </p>
                    </div>
                  )}

                  {/* {application.status === 'rejected' && application.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-red-800 mb-2">Application Update</h4>
                      <p className="text-sm text-red-700">
                        Reason: {application.}
                      </p>
                    </div>
                  )} */}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/applications/${application.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                    {application.property && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/properties/${application.property.id}`}>
                          View Property
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}