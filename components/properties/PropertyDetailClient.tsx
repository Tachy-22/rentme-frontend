'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Property, User, AgentProfile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Phone,
  Mail,
  Star,
  Heart,
  Share2,
  ArrowLeft,
  Wifi,
  Car,
  Dumbbell,
  Waves,
  Home,
  Building,
  PawPrint,
  Cigarette,
  Sofa,
  MessageSquare
} from 'lucide-react';

interface PropertyDetailClientProps {
  property: Property;
  agent: User | null;
  user: User | null;
}

export function PropertyDetailClient({ property, agent, user }: PropertyDetailClientProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const formatPrice = (price: { amount: number; currency: string; period: string }) => {
    return `₦${price.amount.toLocaleString()}/${price.period}`;
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      wifi: Wifi,
      parking: Car,
      gym: Dumbbell,
      pool: Waves,
      laundry: Home,
      ac: Building,
      heating: Building,
    };
    return icons[amenity] || Home;
  };

  const handleSaveProperty = async () => {
    if (!user || !property) return;
    
    try {
      const { saveProperty } = await import('@/actions/properties/saveProperty');
      const result = await saveProperty(user.id, property.id);
      if (result.success) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: property?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <a href="/search" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </a>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card className="p-0 ">
            <CardContent className="p-0">
              <div className="aspect-[16/10] relative overflow-hidden rounded-t-lg">
                <Image
                  src={
                    property.images?.[selectedImageIndex] 
                      ? typeof property.images[selectedImageIndex] === 'string' 
                        ? property.images[selectedImageIndex] as string
                        : (property.images[selectedImageIndex] as { url: string }).url
                      : '/placeholder-property.jpg'
                  }
                  alt={property.title}
                  fill
                  className="object-cover overflow-hidden rounded-lg"
                />
                
                {/* Image Navigation */}
                {property.images && property.images.length > 1 && (
                  <div className="absolute bottom-4 left-4 right-4 flex space-x-2 overflow-x-auto">
                    {property.images.map((image, index) => {
                      const imageUrl = typeof image === 'string' ? image : (image as { url: string }).url;
                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-12 rounded border-2 overflow-hidden ${
                            selectedImageIndex === index ? 'border-white' : 'border-white/50'
                          }`}
                        >
                          <Image
                            src={imageUrl}
                            alt={`Property image ${index + 1}`}
                            width={64}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{property.location.address}, {property.location.city}</span>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {formatPrice(property.price)}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={handleSaveProperty}>
                    <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {property.details.bedrooms > 0 && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Bed className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-semibold">{property.details.bedrooms}</div>
                    <div className="text-sm text-muted-foreground">Bedrooms</div>
                  </div>
                )}
                {property.details.bathrooms > 0 && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Bath className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-semibold">{property.details.bathrooms}</div>
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                  </div>
                )}
                {property.details.area && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Square className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-semibold">{typeof property.details.area === 'object' ? property.details.area.value : property.details.area}</div>
                    <div className="text-sm text-muted-foreground">Sq Ft</div>
                  </div>
                )}
                {property.details.availableFrom && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-semibold">
                      {new Date(property.details.availableFrom).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Available</div>
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>

              <Separator className="my-6" />

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity) => {
                      const Icon = getAmenityIcon(amenity);
                      return (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="capitalize">{amenity.replace('_', ' ')}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Property Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {property.details.furnished && (
                  <div className="flex items-center space-x-2">
                    <Sofa className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Furnished</span>
                  </div>
                )}
                {property.details.petsAllowed && (
                  <div className="flex items-center space-x-2">
                    <PawPrint className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Pets Allowed</span>
                  </div>
                )}
                {property.details.smokingAllowed && (
                  <div className="flex items-center space-x-2">
                    <Cigarette className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Smoking Allowed</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Agent Card */}
          {agent && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Agent</CardTitle>
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
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">
                          {(agent.profile as AgentProfile).rating} ({(agent.profile as AgentProfile).totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {user && user.role === 'renter' && (
                      <Button className="w-full" asChild>
                        <a href={`/messages?to=${agent.id}&property=${property.id}`}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message Agent
                        </a>
                      </Button>
                    )}
                    <Button className="w-full" asChild>
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

                  <div className="text-xs text-muted-foreground">
                    <p>Typically responds in {(agent.profile as AgentProfile).responseTime}h</p>
                    <p>{(agent.profile as AgentProfile).totalDeals} successful deals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Application Card */}
          {user && user.role === 'renter' && (
            <Card>
              <CardHeader>
                <CardTitle>Apply for this Property</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Submit your application to rent this property. You&apos;ll need to provide 
                    documentation and personal information.
                  </p>
                  
                  <Button className="w-full" size="lg" asChild>
                    <a href={`/apply/${property.id}`}>
                      Apply Now
                    </a>
                  </Button>
                  
                  <div className="text-xs text-muted-foreground">
                    <p>• Background check required</p>
                    <p>• Income verification needed</p>
                    <p>• Response within 24-48 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Similar Properties */}
          <Card>
            <CardHeader>
              <CardTitle>Similar Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Looking for similar properties in this area? 
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <a href={`/search?type=${property.type}&city=${property.location.city}`}>
                    View Similar Properties
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}