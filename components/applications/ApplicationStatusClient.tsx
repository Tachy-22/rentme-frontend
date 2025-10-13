'use client';

import React from 'react';
import { Application, Property, User, AgentProfile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Building,
  Phone,
  Mail
} from 'lucide-react';

interface ApplicationStatusClientProps {
  application: Application;
  property: Property | null;
  agent: User | null;
  currentUser: User;
}

export function ApplicationStatusClient({ 
  application, 
  property, 
  agent, 
  currentUser 
}: ApplicationStatusClientProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5" />;
      case 'rejected':
        return <XCircle className="h-5 w-5" />;
      case 'under_review':
        return <FileText className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <a href={currentUser.role === 'agent' ? '/agent/applications' : '/dashboard'} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {currentUser.role === 'agent' ? 'Applications' : 'Dashboard'}
          </a>
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Application Status</h1>
            <p className="text-muted-foreground">
              Application ID: {application.id}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(application.status)}
            <Badge className={getStatusColor(application.status)}>
              {application.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Application Submitted</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(application.submittedAt)}
                    </p>
                  </div>
                </div>

                {application.reviewedAt && (
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      application.status === 'approved' ? 'bg-green-100' : 
                      application.status === 'rejected' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      {application.status === 'approved' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : application.status === 'rejected' ? (
                        <XCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <FileText className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Application Reviewed</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(application.reviewedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {application.status === 'pending' && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-muted-foreground">Awaiting Review</p>
                      <p className="text-sm text-muted-foreground">
                        The agent will review your application soon
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Property Information */}
          {property && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Property Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    <p className="text-muted-foreground">{property.location.address}, {property.location.city}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Property Type</p>
                      <p className="font-medium capitalize">{property.type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Monthly Rent</p>
                      <p className="font-medium">${property.price.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bedrooms</p>
                      <p className="font-medium">{property.details.bedrooms}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bathrooms</p>
                      <p className="font-medium">{property.details.bathrooms}</p>
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <a href={`/properties/${property.id}`}>View Property Details</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Agent Notes */}
          {application.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Agent Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{application.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Agent Contact */}
          {agent && (
            <Card>
              <CardHeader>
                <CardTitle>Your Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {(agent.profile as AgentProfile).firstName?.[0]}{(agent.profile as AgentProfile).lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">
                        {(agent.profile as AgentProfile).firstName} {(agent.profile as AgentProfile).lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">Licensed Agent</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`tel:${(agent.profile as AgentProfile).phone || (agent.profile as AgentProfile).phoneNumber}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call Agent
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`mailto:${agent.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {application.status === 'pending' && (
                  <>
                    <p>• Your application is being reviewed</p>
                    <p>• You'll receive an update within 24-48 hours</p>
                    <p>• The agent may contact you for additional information</p>
                  </>
                )}
                {application.status === 'approved' && (
                  <>
                    <p>• Congratulations! Your application has been approved</p>
                    <p>• The agent will contact you to arrange lease signing</p>
                    <p>• Prepare for move-in arrangements</p>
                  </>
                )}
                {application.status === 'rejected' && (
                  <>
                    <p>• Unfortunately, your application was not successful</p>
                    <p>• Continue searching for other properties</p>
                    <p>• Consider improving your application for future submissions</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Application Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Application Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Submitted</span>
                  <span>{new Date(application.submittedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Move-in Date</span>
                  <span>{new Date(application.additionalInfo.moveInDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lease Duration</span>
                  <span className="capitalize">{application.additionalInfo.leaseDuration.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Income</span>
                  <span>${application.employmentInfo.monthlyIncome.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}