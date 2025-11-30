'use client';

import { useState } from 'react';
import { ApplicationStatus, CloudinaryImage } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  Home,
  Users,
  Calendar,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { updateApplicationStatus } from '@/actions/applications/updateApplicationStatus';
import Image from 'next/image';

interface Application {
  id: string;
  status: ApplicationStatus;
  submittedAt: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
  };
  employmentInfo: {
    employmentStatus: string;
    employer?: string;
    jobTitle?: string;
    monthlyIncome: number;
  };
  rentalHistory: {
    currentAddress: string;
    landlordName?: string;
    landlordPhone?: string;
    reasonForMoving: string;
  };
  references: {
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
    personalReferenceName?: string;
    personalReferencePhone?: string;
  };
  additionalInfo: {
    hasPets: boolean;
    petDescription?: string;
    smokingPreference: string;
    moveInDate: string;
    leaseDuration: string;
  };
  property: {
    id: string;
    title: string;
    location: {
      city: string;
      state: string;
    };
    price: {
      amount: number;
      currency: string;
      period: string;
    };
    images: CloudinaryImage[];
  };
  renter: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    profilePicture?: string;
    verificationStatus: string;
  };
}

interface AgentApplicationsPageProps {
  applications: Application[];
}

export default function AgentApplicationsPage({ applications = [] }: AgentApplicationsPageProps) {
  const [filteredApplications, setFilteredApplications] = useState(applications);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateNotes, setUpdateNotes] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterApplications(query, statusFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterApplications(searchQuery, status);
  };

  const filterApplications = (query: string, status: string) => {
    let filtered = applications;

    if (query) {
      filtered = filtered.filter(app =>
        app.renter.name.toLowerCase().includes(query.toLowerCase()) ||
        app.property.title.toLowerCase().includes(query.toLowerCase()) ||
        app.personalInfo.email.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter(app => app.status === status);
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
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleUpdateStatus = async (applicationId: string, newStatus: ApplicationStatus) => {
    setIsUpdating(true);
    try {
      const result = await updateApplicationStatus({
        applicationId,
        status: newStatus,
        notes: updateNotes
      });

      if (result.success) {
        toast.success(`Application ${newStatus} successfully`);
        // Update local state
        setFilteredApplications(prev =>
          prev.map(app =>
            app.id === applicationId
              ? { ...app, status: newStatus }
              : app
          )
        );
        setSelectedApplication(null);
        setUpdateNotes('');
        // Refresh page to get updated data
        window.location.reload();
      } else {
        toast.error(result.error || 'Failed to update application');
      }
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-2 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Applications</h1>
              <p className="text-muted-foreground">
                Review and manage rental applications for your properties
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                {applications.length} Total Applications
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {applications.filter(app => app.status === 'pending').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending Review</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {applications.filter(app => app.status === 'approved').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-red-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {applications.filter(app => app.status === 'rejected').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Rejected</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{applications.length}</div>
                  <div className="text-sm text-muted-foreground">Total Applications</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by renter name, property, or email..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Income</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={application.renter.profilePicture} />
                          <AvatarFallback>
                            {application.renter.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{application.renter.name}</div>
                          <div className="text-sm text-muted-foreground">{application.renter.email}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-8 rounded overflow-hidden">
                          <Image
                            src={application.property.images[0]?.url || '/placeholder.jpg'}
                            alt={application.property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{application.property.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {application.property.location.city}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge className={cn('capitalize', getStatusColor(application.status))}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(application.status)}
                          {application.status}
                        </div>
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">
                        {formatCurrency(application.employmentInfo?.monthlyIncome || 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {application.employmentInfo?.employmentStatus}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm">{formatDate(application.submittedAt)}</div>
                    </TableCell>

                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedApplication(application)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          {selectedApplication && (
                            <>
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <FileText className="w-5 h-5" />
                                  Application Review
                                </DialogTitle>
                                <DialogDescription>
                                  Review application from {selectedApplication.renter.name} for {selectedApplication.property.title}
                                </DialogDescription>
                              </DialogHeader>

                              <Tabs defaultValue="personal" className="w-full">
                                <TabsList className="grid w-full grid-cols-5">
                                  <TabsTrigger value="personal">Personal</TabsTrigger>
                                  <TabsTrigger value="employment">Employment</TabsTrigger>
                                  <TabsTrigger value="rental">Rental History</TabsTrigger>
                                  <TabsTrigger value="references">References</TabsTrigger>
                                  <TabsTrigger value="additional">Additional</TabsTrigger>
                                </TabsList>

                                <TabsContent value="personal" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Full Name</Label>
                                      <div className="p-2 bg-muted rounded">
                                        {selectedApplication.personalInfo.firstName} {selectedApplication.personalInfo.lastName}
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <div className="p-2 bg-muted rounded">{selectedApplication.personalInfo.email}</div>
                                    </div>
                                    <div>
                                      <Label>Phone</Label>
                                      <div className="p-2 bg-muted rounded">{selectedApplication.personalInfo.phone}</div>
                                    </div>
                                    <div>
                                      <Label>Date of Birth</Label>
                                      <div className="p-2 bg-muted rounded">{selectedApplication.personalInfo.dateOfBirth}</div>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="employment" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Employment Status</Label>
                                      <div className="p-2 bg-muted rounded capitalize">
                                        {selectedApplication.employmentInfo.employmentStatus?.replace('_', ' ')}
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Monthly Income</Label>
                                      <div className="p-2 bg-muted rounded">
                                        {formatCurrency(selectedApplication.employmentInfo.monthlyIncome)}
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Employer</Label>
                                      <div className="p-2 bg-muted rounded">{selectedApplication.employmentInfo.employer || 'N/A'}</div>
                                    </div>
                                    <div>
                                      <Label>Job Title</Label>
                                      <div className="p-2 bg-muted rounded">{selectedApplication.employmentInfo.jobTitle || 'N/A'}</div>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="rental" className="space-y-4">
                                  <div className="grid grid-cols-1 gap-4">
                                    <div>
                                      <Label>Current Address</Label>
                                      <div className="p-2 bg-muted rounded">{selectedApplication.rentalHistory.currentAddress}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Landlord Name</Label>
                                        <div className="p-2 bg-muted rounded">{selectedApplication.rentalHistory.landlordName || 'N/A'}</div>
                                      </div>
                                      <div>
                                        <Label>Landlord Phone</Label>
                                        <div className="p-2 bg-muted rounded">{selectedApplication.rentalHistory.landlordPhone || 'N/A'}</div>
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Reason for Moving</Label>
                                      <div className="p-2 bg-muted rounded">{selectedApplication.rentalHistory.reasonForMoving}</div>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="references" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Emergency Contact</Label>
                                      <div className="p-2 bg-muted rounded">
                                        {selectedApplication.references.emergencyContactName} ({selectedApplication.references.emergencyContactRelation})
                                        <br />
                                        {selectedApplication.references.emergencyContactPhone}
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Personal Reference</Label>
                                      <div className="p-2 bg-muted rounded">
                                        {selectedApplication.references.personalReferenceName || 'N/A'}
                                        <br />
                                        {selectedApplication.references.personalReferencePhone || 'N/A'}
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="additional" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Has Pets</Label>
                                      <div className="p-2 bg-muted rounded">
                                        {selectedApplication.additionalInfo.hasPets ? 'Yes' : 'No'}
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Smoking Preference</Label>
                                      <div className="p-2 bg-muted rounded capitalize">
                                        {selectedApplication.additionalInfo.smokingPreference?.replace('_', ' ')}
                                      </div>
                                    </div>
                                    {selectedApplication.additionalInfo.hasPets && (
                                      <div className="col-span-2">
                                        <Label>Pet Description</Label>
                                        <div className="p-2 bg-muted rounded">{selectedApplication.additionalInfo.petDescription}</div>
                                      </div>
                                    )}
                                  </div>
                                </TabsContent>
                              </Tabs>

                              <DialogFooter className="flex gap-2">
                                {selectedApplication.status === 'pending' && (
                                  <>
                                    <div className="flex-1">
                                      <Label htmlFor="notes">Notes (optional)</Label>
                                      <Textarea
                                        id="notes"
                                        placeholder="Add any notes about this decision..."
                                        value={updateNotes}
                                        onChange={(e) => setUpdateNotes(e.target.value)}
                                        rows={2}
                                      />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button disabled={isUpdating}>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Approve
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Approve Application</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to approve this rental application? This action will notify the applicant.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleUpdateStatus(selectedApplication.id, 'approved')}>
                                              Approve Application
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>

                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="destructive" disabled={isUpdating}>
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Reject
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Reject Application</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to reject this rental application? This action will notify the applicant.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleUpdateStatus(selectedApplication.id, 'rejected')}>
                                              Reject Application
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </>
                                )}
                              </DialogFooter>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-2">No applications found</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Applications will appear here when renters apply for your properties'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}