'use client';

import { useState, useEffect } from 'react';
import { User, Application, ApplicationStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText,
  Search,
  MapPin,
  Calendar,
  Eye,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User as UserIcon
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Helper function to safely convert Firebase timestamp to Date
function toDate(timestamp: string | { toDate?: () => Date; seconds?: number; nanoseconds?: number }): Date {
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp && timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  return new Date();
}

interface ApplicationsClientProps {
  user: User;
  initialApplications: Application[];
}

export default function ApplicationsClient({ user, initialApplications }: ApplicationsClientProps) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>(initialApplications);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    filterApplications();
  }, [searchQuery, statusFilter, sortBy, applications]);

  const filterApplications = () => {
    let filtered = [...applications];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(app =>
        app.property?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.property?.location?.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = toDate(a.submittedAt);
          const dateB = toDate(b.submittedAt);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case 'oldest':
        filtered.sort((a, b) => {
          const dateA = toDate(a.submittedAt);
          const dateB = toDate(b.submittedAt);
          return dateA.getTime() - dateB.getTime();
        });
        break;
      case 'status':
        filtered.sort((a, b) => a.status.localeCompare(b.status));
        break;
    }

    setFilteredApplications(filtered);
  };

  const getStatusColor = (status: ApplicationStatus) => {
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

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'withdrawn':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (date: string | { toDate?: () => Date; seconds?: number; nanoseconds?: number }) => {
    if (!date) return '';
    const dateObj = toDate(date);
    return dateObj.toLocaleDateString();
  };

  const statusCounts = applications.reduce((counts, app) => {
    counts[app.status] = (counts[app.status] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="text-muted-foreground">
          Track your rental applications and their status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{applications.length}</div>
            <div className="text-sm text-muted-foreground">Total Applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending || 0}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{statusCounts.approved || 0}</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{statusCounts.rejected || 0}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search applications by property or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Property Image */}
                  <div className="relative w-full lg:w-48 h-32 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={application.property?.images?.[0]?.url || '/placeholder.jpg'}
                      alt={application.property?.title || 'Property'}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Application Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{application.property?.title || 'Property Title'}</h3>
                        <div className="flex items-center gap-1 text-muted-foreground mt-1">
                          <MapPin className="w-4 h-4" />
                          {application.property?.location?.city}, {application.property?.location?.state}
                        </div>
                        <div className="text-lg font-bold text-primary mt-2">
                          ₦{application.property?.price?.amount?.toLocaleString() || '0'}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{application.property?.price?.period || 'month'}
                          </span>
                        </div>
                      </div>
                      
                      <Badge className={cn('flex items-center gap-1', getStatusColor(application.status))}>
                        {getStatusIcon(application.status)}
                        {application.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Applied:</span>
                        <span>{formatDate(application.submittedAt)}</span>
                      </div>
                      
                      {application.property?.agent && (
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Agent:</span>
                          <span>{application.property?.agent?.name}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">ID:</span>
                        <span className="font-mono text-xs">{application.id}</span>
                      </div>
                    </div>

                    {application.notes && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm">{application.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" asChild>
                        <Link href={`/properties/${application.property?.id || application.propertyId}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Property
                        </Link>
                      </Button>
                      
                      <Button variant="outline" asChild>
                        <Link href={`/applications/${application.id}`}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Application
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No applications found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'No applications match your search criteria.'
                : 'You haven\'t submitted any applications yet.'
              }
            </p>
            <Button asChild>
              <Link href="/properties">
                <Search className="w-4 h-4 mr-2" />
                Browse Properties
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}