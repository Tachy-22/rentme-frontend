'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Heart,
  Share2,
  Star,
  MessageCircle,
  FileText,
  Wifi,
  Car,
  Utensils,
  Shield,
  ArrowLeft,
  Calendar,
  Ruler
} from 'lucide-react';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface PropertyDetailsPageProps {
  property: any;
  user: User;
}


export default function PropertyDetailsPage({ property, user }: PropertyDetailsPageProps) {
  const [isSaved, setIsSaved] = useState(property?.isSaved || false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save/unsave API call
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'parking':
        return <Car className="w-4 h-4" />;
      case 'kitchen':
        return <Utensils className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      default:
        return <div className="w-4 h-4 bg-muted rounded" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/properties">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Properties
        </Link>
      </Button>

      {/* Image Gallery */}
      <Card>
        <CardContent className="p-0">
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                {property.images?.length > 0 ? property.images.map((image: any, index: number) => (
                  <CarouselItem key={index}>
                    <div className="relative h-96 md:h-[500px]">
                      <Image
                        src={image.url}
                        alt={`${property.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                )) : (
                  <CarouselItem>
                    <div className="relative h-96 md:h-[500px] bg-muted flex items-center justify-center">
                      <div className="text-muted-foreground">No images available</div>
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="sm" variant="secondary" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="secondary"
                onClick={handleSaveToggle}
                className={isSaved ? 'text-red-500' : ''}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Status Badge */}
            <Badge className="absolute bottom-4 left-4 bg-green-500">
              {property.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Header */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold">{property.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2">
                    <MapPin className="w-4 h-4" />
                    <span>{property.location.address}, {property.location.city}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    🚌 {property.distanceToUniversity}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{property.details.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{property.details.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{property.details.area.value} {property.details.area.unit}</span>
                  </div>
                </div>

                <div className="text-2xl font-bold">
                  ₦{property.price.amount.toLocaleString()}/{property.price.period}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium">Property Type:</span>
                  <p className="capitalize">{property.type || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Furnished:</span>
                  <p>{property.details?.furnished ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Available From:</span>
                  <p>
                    {property.details?.availableFrom ? 
                      new Date(property.details.availableFrom).toLocaleDateString() : 
                      'Not specified'
                    }
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Lease Duration:</span>
                  <p>
                    {property.details?.leaseDuration ? 
                      `${property.details.leaseDuration.min}-${property.details.leaseDuration.max} ${property.details.leaseDuration.unit}` : 
                      'Not specified'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities?.length > 0 ? property.amenities.map((amenity: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                )) : (
                  <div className="text-sm text-muted-foreground">No amenities listed</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Utilities & Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Utilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-green-600">Included:</span>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {property.utilities?.included?.map((utility: string, index: number) => (
                      <li key={index}>{utility}</li>
                    )) || <li>None specified</li>}
                  </ul>
                </div>
                <div>
                  <span className="text-sm font-medium text-orange-600">Not Included:</span>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {property.utilities?.excluded?.map((utility: string, index: number) => (
                      <li key={index}>{utility}</li>
                    )) || <li>None specified</li>}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>House Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {property.rules?.length > 0 ? property.rules.map((rule: string, index: number) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {rule}
                    </li>
                  )) : (
                    <li className="text-sm text-muted-foreground">No specific rules</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Agent Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Agent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={property.agent.profilePicture} />
                  <AvatarFallback>
                    {property.agent.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{property.agent.name}</div>
                  <div className="text-sm text-muted-foreground">{property.agent.company}</div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{property.agent.rating}</span>
                    <span className="text-muted-foreground">({property.agent.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Typically responds in {property.agent.responseTime} hours
              </div>

              <div className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href={`/messages?agent=${property.agent.id}&property=${property.id}`}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/apply/${property.id}`}>
                    <FileText className="w-4 h-4 mr-2" />
                    Apply Now
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Nearby Places */}
          <Card>
            <CardHeader>
              <CardTitle>Nearby Places</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {property.nearbyPlaces?.length > 0 ? property.nearbyPlaces.map((place: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{place.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{place.type}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{place.distance}</div>
                  </div>
                )) : (
                  <div className="text-sm text-muted-foreground">No nearby places listed</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}