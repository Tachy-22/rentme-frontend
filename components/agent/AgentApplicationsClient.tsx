'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Application } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Eye, Check, X, Clock, FileText, User as UserIcon, MapPin, DollarSign } from 'lucide-react';

interface AgentApplicationsClientProps {
  user: User;
  applications: (Application & {
    renter?: User;
    property?: {
      id: string;
      title: string;
      location: {
        address: string;
      };
      price: {
        amount: number;
        period: string;
      };
    };
  })[];
}

export function AgentApplicationsClient({ user, applications }: AgentApplicationsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredApplications = applications.filter(application => {
    const renterName = application.renter ? 
      `${application.renter.profile.firstName} ${application.renter.profile.lastName}` : '';
    const propertyTitle = application.property?.title || '';
    
    const matchesSearch = renterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.renter?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <Check className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      case 'withdrawn':
        return <X className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">
            Review and manage rental applications for your properties.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by renter name, email, or property..."
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
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {applications.length === 0 ? 'No Applications Yet' : 'No Applications Found'}
              </h3>
              <p className="text-muted-foreground text-center">
                {applications.length === 0 
                  ? "You haven't received any rental applications yet. Make sure your properties are published and visible to renters."
                  : "No applications match your current filters. Try adjusting your search criteria."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={application.renter?.profile.profilePicture} />
                        <AvatarFallback>
                          {application.renter ? 
                            `${application.renter.profile.firstName[0]}${application.renter.profile.lastName[0]}` :
                            <UserIcon className="h-6 w-6" />
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {application.renter ? 
                            `${application.renter.profile.firstName} ${application.renter.profile.lastName}` :
                            'Unknown Renter'
                          }
                        </CardTitle>
                        <CardDescription>
                          {application.renter?.email}
                        </CardDescription>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>Applied {new Date(application.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(application.status)}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1 capitalize">{application.status}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Property Information */}
                  {application.property && (
                    <div className="bg-muted rounded-lg p-4">
                      <h4 className="font-medium mb-2">Property Applied For</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">{application.property.title}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="ml-6">{application.property.location.address}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>${application.property.price.amount.toLocaleString()}/{application.property.price.period}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Renter Information */}
                  {application.renter && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Occupation:</span>
                        <p>{application.renter.profile.occupation}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Monthly Income:</span>
                        <p>${application.renter.profile.monthlyIncome?.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Phone:</span>
                        <p>{application.renter.profile.phone}</p>
                      </div>
                    </div>
                  )}

                  {/* Application Details */}
                  {application.personalInfo && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Personal Message</h4>
                      <p className="text-sm text-muted-foreground">
                        {application.personalInfo.bio || 'No message provided'}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/applications/${application.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                    
                    {application.status === 'pending' && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        {applications.length > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Showing {filteredApplications.length} of {applications.length} applications
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}