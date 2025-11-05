'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Building2, 
  Search, 
  Filter, 
  User, 
  Eye, 
  MapPin, 
  DollarSign,
  Calendar,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Home,
  Edit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getAllProperties, updatePropertyStatus, deleteProperty } from '@/actions/admin/propertyManagement';
import Link from 'next/link';

interface Property {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  price: {
    amount: number;
    currency: string;
    period: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
  };
  agentId: string;
  createdAt: string;
  updatedAt: string;
  viewCount?: number;
  images?: Array<{ url: string }>;
  agent?: {
    id: string;
    name: string;
    email: string;
    company?: string;
    verificationStatus?: string;
  };
  adminNotes?: string;
}

export default function PropertyManagement() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchQuery, statusFilter, typeFilter]);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const result = await getAllProperties();
      if (result.success && result.data) {
        setProperties(result.data as unknown as Property[]);
      } else {
        toast.error('Failed to load properties');
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = properties;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(property => 
        property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.agent?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.agent?.company?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(property => property.type === typeFilter);
    }

    setFilteredProperties(filtered);
  };

  const handleUpdateStatus = async () => {
    if (!selectedProperty || !newStatus) return;

    setIsProcessing(true);
    try {
      const result = await updatePropertyStatus({
        propertyId: selectedProperty.id,
        status: newStatus as any,
        reason: statusReason
      });

      if (result.success) {
        toast.success(`Property status updated to ${newStatus}`);
        await loadProperties();
        setShowStatusDialog(false);
        setNewStatus('');
        setStatusReason('');
        setSelectedProperty(null);
      } else {
        toast.error(result.error || 'Failed to update property status');
      }
    } catch (error) {
      console.error('Error updating property status:', error);
      toast.error('Failed to update property status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteProperty = async () => {
    if (!selectedProperty) return;

    setIsProcessing(true);
    try {
      const result = await deleteProperty(selectedProperty.id);

      if (result.success) {
        toast.success('Property deleted successfully');
        await loadProperties();
        setShowDeleteDialog(false);
        setSelectedProperty(null);
      } else {
        toast.error(result.error || 'Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      rented: { variant: 'secondary' as const, icon: Home, color: 'text-blue-600' },
      pending: { variant: 'outline' as const, icon: Clock, color: 'text-yellow-600' },
      maintenance: { variant: 'outline' as const, icon: Edit, color: 'text-orange-600' },
      deleted: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={cn("w-3 h-3", config.color)} />
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'apartment':
        return '🏠';
      case 'house':
        return '🏡';
      case 'room':
        return '🚪';
      case 'studio':
        return '🏢';
      case 'shared':
        return '🤝';
      default:
        return '🏘️';
    }
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
        <h1 className="text-3xl font-bold">Property Management</h1>
        <p className="text-muted-foreground">Manage all property listings on the platform</p>
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
                placeholder="Search properties..."
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
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="pending">Pending</option>
              <option value="maintenance">Maintenance</option>
              <option value="deleted">Deleted</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="room">Room</option>
              <option value="studio">Studio</option>
              <option value="shared">Shared</option>
            </select>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="w-4 h-4" />
              {filteredProperties.length} properties
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProperties.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No properties found</p>
          </div>
        ) : (
          filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="relative">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0].url}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                
                <div className="absolute top-2 left-2">
                  {getStatusBadge(property.status)}
                </div>

                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-black/50 text-white border-none">
                    {getPropertyTypeIcon(property.type)} {property.type}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">{property.location.address}, {property.location.city}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-600">
                        {property.price.currency}{property.price.amount.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">/{property.price.period}</span>
                    </div>

                    {property.viewCount !== undefined && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="w-3 h-3" />
                        {property.viewCount}
                      </div>
                    )}
                  </div>

                  {property.agent && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          <User className="w-3 h-3" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{property.agent.name}</p>
                        {property.agent.company && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{property.agent.company}</p>
                        )}
                      </div>
                      {property.agent.verificationStatus === 'verified' && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(property.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {property.adminNotes && (
                    <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-800">{property.adminNotes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/properties/${property.id}`}>
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Link>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedProperty(property);
                        setNewStatus(property.status);
                        setShowStatusDialog(true);
                      }}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Status
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedProperty(property);
                        setShowDeleteDialog(true);
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Update Status Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Property Status</DialogTitle>
            <DialogDescription>
              Change the status of "{selectedProperty?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="pending">Pending</option>
                <option value="maintenance">Maintenance</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Reason (Optional)</label>
              <Textarea
                placeholder="Enter reason for status change..."
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={isProcessing || !newStatus}
            >
              <Edit className="w-4 h-4 mr-2" />
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Property Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete "{selectedProperty?.title}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProperty}
              disabled={isProcessing}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Property
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}