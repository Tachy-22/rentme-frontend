'use client';

import { useState } from 'react';
import { User, PropertyStatus, Property, RenterProfile, AgentProfile, AdminProfile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Copy,
  MapPin,
  Calendar,
  TrendingUp,
  Shield,
  Check,
  Star,
  Users
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getUserAccessRules } from '@/lib/access-control';
import { deleteProperty } from '@/actions/properties/updateProperty';
import { toast } from 'sonner';

interface AgentPropertiesPageProps {
  user: User;
  properties?: Property[];
}


export default function AgentPropertiesPage({ user, properties = [] }: AgentPropertiesPageProps) {
  const agentProfile = user.profile as RenterProfile | AgentProfile;
  const isVerified = agentProfile?.verificationStatus === "verified" || false;
  const accessRules = getUserAccessRules(user);
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [deletePropertyId, setDeletePropertyId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterProperties(query, statusFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterProperties(searchQuery, status);
  };

  const filterProperties = (query: string, status: string) => {
    let filtered = properties;

    if (query) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(query.toLowerCase()) ||
        property.location.city.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter(property => property.status === status);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price.amount - a.price.amount);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price.amount - b.price.amount);
        break;
      case 'views':
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
    }

    setFilteredProperties(filtered);
  };

  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'rented':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteProperty = async () => {
    if (!deletePropertyId) return;

    setIsDeleting(true);
    try {
      const result = await deleteProperty(deletePropertyId);

      if (result.success) {
        toast.success('Property deleted successfully');
        // Remove the property from the local state
        setFilteredProperties(prev => prev.filter(p => p.id !== deletePropertyId));
        // Also update the original properties array by triggering a refresh
        window.location.reload();
      } else {
        toast.error(result.error || 'Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    } finally {
      setIsDeleting(false);
      setDeletePropertyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-auto ">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Properties</h1>
            <p className="text-muted-foreground">
              Manage your property listings
            </p>
          </div>
          <Button asChild>
            <Link href="/agent/properties/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Link>
          </Button>
        </div>

        {/* Verification Warning */}
        {!isVerified && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Limited Access</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Unverified agents can only add up to 3 properties. Get verified for unlimited listings.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{properties.length}</div>
              <div className="text-sm text-muted-foreground">Total Properties</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {properties.filter(p => p.status === 'available').length}
              </div>
              <div className="text-sm text-muted-foreground">Available</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {properties.reduce((sum, p) => sum + p.viewCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {properties.reduce((sum, p) => sum + (p.inquiries || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Inquiries</div>
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
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="views">Most Views</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Properties Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Inquiries</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-12 rounded overflow-hidden">
                          <Image
                            src={property.images[0]?.url || '/placeholder.jpg'}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{property.title}</div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {property.type.replace('_', ' ')} • {property.details.bedrooms}BR/{property.details.bathrooms}BA
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{property.location.city}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        ₦{property.price.amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        per {property.price.period}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('capitalize', getStatusColor(property.status))}>
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-muted-foreground" />
                        <span>{property.viewCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>{property.inquiries || 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(property.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/properties/${property.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/agent/properties/${property.id}/edit`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeletePropertyId(property.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No properties found</p>
            <Button className="mt-4" asChild>
              <Link href="/agent/properties/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Property
              </Link>
            </Button>
          </div>
        )}

        {/* Verification Benefits Card */}
        {!isVerified && (
          <Card className="mt-6 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2">Unlock Premium Agent Features</h3>
                  <p className="text-sm text-blue-800 mb-4">
                    Get verified to unlock unlimited listings, priority placement, and access to verified renters.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-blue-800">
                        <Check className="w-4 h-4 text-blue-600" />
                        <span>Unlimited property listings</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-800">
                        <Star className="w-4 h-4 text-blue-600" />
                        <span>Featured listing placement</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-blue-800">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>Access to matched renters</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-800">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span>Priority in search results</span>
                      </div>
                    </div>
                  </div>

                  {accessRules.propertyLimit && (
                    <p className="text-sm text-blue-700 mb-4">
                      Current limit: {properties.length}/{accessRules.propertyLimit} properties
                    </p>
                  )}

                  <Button asChild size="sm">
                    <Link href="/verification">
                      <Shield className="w-4 h-4 mr-2" />
                      Get Verified Now
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Delete Confirmation Modal */}
        <AlertDialog open={!!deletePropertyId} onOpenChange={() => setDeletePropertyId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-destructive" />
                Delete Property
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this property? This action cannot be undone.
                <br /><br />
                <strong>Note:</strong> The property will be marked as deleted and removed from all listings. Any existing applications or conversations related to this property will remain accessible for record-keeping purposes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteProperty}
                disabled={isDeleting}
                className="bg-destructive hover:bg-destructive/90"
              >
                {isDeleting ? 'Deleting...' : 'Delete Property'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}