'use client';

import { useState, useEffect, SetStateAction } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  FileText, 
  Eye, 
  Download,
  Filter,
  Search,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getAllVerificationRequests, updateVerificationStatus } from '@/actions/admin/verificationActions';

interface VerificationRequest {
  id: string;
  userId: string;
  userRole: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
  documents: string[];
  documentUrls: Record<string, string>;
  // Renter specific
  university?: string;
  department?: string;
  level?: string;
  studentIdNumber?: string;
  // Agent specific
  agencyName?: string;
  agencyAddress?: string;
  licenseNumber?: string;
  businessType?: string;
  // User details
  user?: {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
    profile?: {
      fullName: string;
      phone?: string;
    };
  };
}

export default function VerificationManagement() {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<VerificationRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    loadVerificationRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchQuery, statusFilter, roleFilter]);

  const loadVerificationRequests = async () => {
    setIsLoading(true);
    try {
      const result = await getAllVerificationRequests();
      if (result.success && result.data) {
        setRequests(result.data as SetStateAction<VerificationRequest[]>);
      } else {
        toast.error('Failed to load verification requests');
      }
    } catch (error) {
      console.error('Error loading verification requests:', error);
      toast.error('Failed to load verification requests');
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(req => 
        req.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.agencyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.university?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(req => req.userRole === roleFilter);
    }

    setFilteredRequests(filtered);
  };

  const handleReviewRequest = async (requestId: string, decision: 'verified' | 'rejected') => {
    setIsProcessing(true);
    try {
      const result = await updateVerificationStatus({
        requestId,
        status: decision,
        notes: reviewNotes
      });

      if (result.success) {
        toast.success(`Request ${decision} successfully`);
        await loadVerificationRequests();
        setSelectedRequest(null);
        setReviewNotes('');
      } else {
        toast.error(result.error || 'Failed to update verification status');
      }
    } catch (error) {
      console.error('Error updating verification status:', error);
      toast.error('Failed to update verification status');
    } finally {
      setIsProcessing(false);
    }
  };

  const viewDocument = (url: string) => {
    setSelectedDocument(url);
    setShowDocumentModal(true);
  };

  const downloadDocument = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      verified: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <Badge className={cn('border', colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800')}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
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
        <h1 className="text-3xl font-bold">Verification Management</h1>
        <p className="text-muted-foreground">Review and manage user verification requests</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="all">All Roles</option>
              <option value="renter">Renters</option>
              <option value="agent">Agents</option>
            </select>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {filteredRequests.length} requests
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Verification Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No verification requests found</p>
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    onClick={() => setSelectedRequest(request)}
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors",
                      selectedRequest?.id === request.id && "border-primary bg-muted"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={request.user?.profilePicture} />
                        <AvatarFallback>
                          <User className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium truncate">
                            {request.user?.name || 'Unknown User'}
                          </span>
                          {getStatusBadge(request.status)}
                        </div>

                        <p className="text-sm text-muted-foreground truncate">
                          {request.user?.email}
                        </p>

                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="capitalize">{request.userRole}</span>
                          <span>{new Date(request.submittedAt).toLocaleDateString()}</span>
                          <span>{request.documents.length} documents</span>
                        </div>

                        {request.userRole === 'renter' && request.university && (
                          <p className="text-xs text-muted-foreground mt-1">
                            🎓 {request.university}
                          </p>
                        )}

                        {request.userRole === 'agent' && request.agencyName && (
                          <p className="text-xs text-muted-foreground mt-1">
                            🏢 {request.agencyName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Request Details */}
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRequest ? (
              <div className="space-y-6">
                {/* User Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold">User Information</h3>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedRequest.user?.profilePicture} />
                      <AvatarFallback>
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedRequest.user?.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedRequest.user?.email}</p>
                      <p className="text-sm text-muted-foreground capitalize">{selectedRequest.userRole}</p>
                    </div>
                  </div>
                </div>

                {/* Role-specific Info */}
                {selectedRequest.userRole === 'renter' && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Academic Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">University:</span>
                        <p className="font-medium">{selectedRequest.university}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Department:</span>
                        <p className="font-medium">{selectedRequest.department}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Level:</span>
                        <p className="font-medium">{selectedRequest.level}</p>
                      </div>
                      {selectedRequest.studentIdNumber && (
                        <div>
                          <span className="text-muted-foreground">Student ID:</span>
                          <p className="font-medium">{selectedRequest.studentIdNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedRequest.userRole === 'agent' && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Agency Information</h3>
                    <div className="grid grid-cols-1 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Agency Name:</span>
                        <p className="font-medium">{selectedRequest.agencyName}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Address:</span>
                        <p className="font-medium">{selectedRequest.agencyAddress}</p>
                      </div>
                      {selectedRequest.licenseNumber && (
                        <div>
                          <span className="text-muted-foreground">License Number:</span>
                          <p className="font-medium">{selectedRequest.licenseNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Documents</h3>
                  <div className="space-y-2">
                    {Object.entries(selectedRequest.documentUrls).map(([type, url]) => (
                      <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="capitalize">{type.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewDocument(url)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadDocument(url, `${type}-${selectedRequest.user?.name}`)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Notes */}
                {selectedRequest.status === 'pending' && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Review Notes</h3>
                    <Textarea
                      placeholder="Add notes about this verification request..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}

                {/* Review History */}
                {selectedRequest.reviewedAt && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Review History</h3>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(selectedRequest.status)}
                        <span className="font-medium capitalize">{selectedRequest.status}</span>
                        <span className="text-sm text-muted-foreground">
                          on {new Date(selectedRequest.reviewedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {selectedRequest.notes && (
                        <p className="text-sm">{selectedRequest.notes}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedRequest.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => handleReviewRequest(selectedRequest.id, 'verified')}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReviewRequest(selectedRequest.id, 'rejected')}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Select a verification request to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Document View Modal */}
      <Dialog open={showDocumentModal} onOpenChange={setShowDocumentModal}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Document Viewer</DialogTitle>
            <DialogDescription>
              Review the uploaded document
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 flex items-center justify-center bg-muted rounded-lg">
            {selectedDocument && (
              <img
                src={selectedDocument}
                alt="Verification document"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling!.textContent = 'Failed to load document. It may be a PDF or unsupported format.';
                }}
              />
            )}
            <p className="text-muted-foreground">Loading document...</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => downloadDocument(selectedDocument, 'document')}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={() => setShowDocumentModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}