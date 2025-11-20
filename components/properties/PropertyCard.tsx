'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Star,
  Wifi,
  Car,
  Shield,
  MessageCircle,
  Flag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { getUserAccessRules, getVerificationStatus } from '@/lib/access-control';
import { User } from '@/types';
import { saveProperty, unsaveProperty, checkIfPropertySaved } from '@/actions/properties/saveProperty';
import { toast } from 'sonner';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    price: { amount: number; currency: string; period: string };
    location: { address: string; city: string };
    details: { bedrooms: number; bathrooms: number; area: { value: number; unit: string } };
    images: { url: string; publicId: string; width: number; height: number; format: string }[];
    distanceToUniversity: string;
    isSaved: boolean;
    agent: { id?: string; name: string; profilePicture: string; rating: number };
    agentId?: string;
    type: string;
    amenities: string[];
    status: string;
  };
}

const getAmenityIcon = (amenity: string) => {
  switch (amenity.toLowerCase()) {
    case 'wifi':
      return Wifi;
    case 'parking':
      return Car;
    case 'security':
      return Shield;
    default:
      return null;
  }
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(property.isSaved);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const accessRules = getUserAccessRules(user);
  const agentVerification = getVerificationStatus(property.agent as unknown as User);

  useEffect(() => {
    // Check if property is saved on mount
    if (user) {
      checkSavedStatus();
    }
  }, [user, property.id]);

  const checkSavedStatus = async () => {
    try {
      const result = await checkIfPropertySaved(property.id);
      if (result.success) {
        setIsSaved(result.isSaved || false);
      }
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please log in to save properties');
      return;
    }

    if (!accessRules.canSaveProperties) {
      toast.error('You are not authorized to save properties');
      return;
    }

    setIsLoading(true);
    
    try {
      let result;
      if (isSaved) {
        result = await unsaveProperty(property.id);
        if (result.success) {
          setIsSaved(false);
          toast.success('Property removed from saved');
        }
      } else {
        result = await saveProperty({ propertyId: property.id });
        if (result.success) {
          setIsSaved(true);
          toast.success('Property saved successfully');
        }
      }

      if (!result.success) {
        toast.error(result.error || 'Failed to update saved status');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactAgent = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please log in to contact agents');
      return;
    }

    if (!accessRules.canMessageAgents) {
      toast.error('You are not authorized to contact agents');
      return;
    }

    // Check if user can view agent contact
    if (!accessRules.canViewAgentContact) {
      setShowVerificationModal(true);
      return;
    }

    // Check message limits
    if (accessRules.messageLimit) {
      setShowMessageModal(true);
      return;
    }

    // Redirect to messages with agent and property context
    window.location.href = `/messages?agent=${property.agent?.id || property.agentId || 'unknown'}&property=${property.id}`;
  };

  const handleReport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info('Report functionality coming soon');
  };

  return (
    <>
      <Card className="group py-0 hover:shadow-lg transition-all duration-200 overflow-hidden">
        <Link href={`/properties/${property.id}`}>
          <div className="relative">
            {/* Property Image */}
            <div className="relative h-48 bg-muted overflow-hidden">
              {!imageError && property.images[0] ? (
                <Image
                  src={property.images[0].url}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <div className="text-muted-foreground">No image available</div>
                </div>
              )}
              
              {/* Status Badge */}
              <Badge 
                className={cn(
                  "absolute top-3 left-3",
                  property.status === 'available' ? 'bg-green-500' : 'bg-orange-500'
                )}
              >
                {property.status}
              </Badge>

              {/* Agent Verification Badge */}
              <div className="absolute top-3 left-20">
                <Badge 
                  className={cn(
                    "text-xs",
                    agentVerification.bgColor,
                    agentVerification.color
                  )}
                >
                  <Shield className="w-3 h-3 mr-1" />
                  {agentVerification.status}
                </Badge>
              </div>

              {/* Hover Actions */}
              {/* <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleSaveToggle}
                    disabled={isLoading}
                    className={cn(
                      "h-8 px-3",
                      isSaved && "text-red-500"
                    )}
                  >
                    <Heart className={cn("w-4 h-4 mr-1", isSaved && "fill-current")} />
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleContactAgent}
                    className="h-8 px-3"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleReport}
                    className="h-8 px-3"
                  >
                    <Flag className="w-4 h-4 mr-1" />
                    Report
                  </Button>
                </div>
              </div> */}

              {/* Property Type */}
              <Badge variant="secondary" className="absolute bottom-3 left-3 capitalize">
                {property.type.replace('_', ' ')}
              </Badge>
            </div>

          <CardContent className="p-4">
            {/* Title and Location */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {property.title}
              </h3>
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">{property.location.address}, {property.location.city}</span>
              </div>

              <div className="text-sm text-muted-foreground">
                🚌 {property.distanceToUniversity}
              </div>
            </div>

            {/* Property Details */}
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{property.details.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.details.bathrooms}</span>
              </div>
              <div className="text-xs">
                {property.details.area.value}{property.details.area.unit}
              </div>
            </div>

            {/* Amenities */}
            <div className="flex items-center gap-2 mt-3">
              {property.amenities.slice(0, 3).map((amenity, index) => {
                const Icon = getAmenityIcon(amenity);
                return (
                  <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
                    {Icon && <Icon className="w-3 h-3" />}
                    <span>{amenity}</span>
                  </div>
                );
              })}
              {property.amenities.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>

            {/* Price and Agent */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t">
              <div>
                <div className="text-xl font-bold">
                  ₦{property.price.amount.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  per {property.price.period}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={property.agent.profilePicture} />
                  <AvatarFallback className="text-xs">
                    {property.agent.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <div className="text-xs font-medium">{property.agent.name}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{property.agent.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <Button size="sm" className="flex-1" asChild>
                <span>View Details</span>
              </Button>
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleSaveToggle}
                    disabled={isLoading}
                    className={cn(
                      "h-8 px-3",
                      isSaved && "text-red-500"
                    )}
                  >
                    <Heart className={cn("w-4 h-4 mr-1", isSaved && "fill-current")} />
                    {/* {isSaved ? 'Saved' : 'Save'} */}
                  </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleContactAgent}
                className="px-3"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>

    {/* Message Limit Modal */}
    <AlertDialog open={showMessageModal} onOpenChange={setShowMessageModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Message Limit Reached</AlertDialogTitle>
          <AlertDialogDescription>
            Unverified renters can send up to 3 messages per week. Get verified to unlock unlimited messaging and priority support.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link href="/verification">Get Verified</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Verification Required Modal */}
    <AlertDialog open={showVerificationModal} onOpenChange={setShowVerificationModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Verification Required</AlertDialogTitle>
          <AlertDialogDescription>
            To contact agents and view full contact details, you need to verify your student status. This helps agents trust you faster and prioritizes your inquiries.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link href="/verification">Verify Account</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}