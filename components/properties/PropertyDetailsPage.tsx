'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Property, CloudinaryImage } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
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
  property: Property & {
    isSaved?: boolean;
    distanceToUniversity?: string;
    nearbyPlaces?: Array<{ name: string; distance: string; type: string }>;
    agent?: {
      id: string;
      name: string;
      profilePicture: string;
      rating: number;
      company?: string;
      totalReviews?: number;
      responseTime?: number;
    };
  };
}


export default function PropertyDetailsPage({ property }: PropertyDetailsPageProps) {
  const [isSaved, setIsSaved] = useState(property?.isSaved || false);

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

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/properties';
    }
  };

  return (
    <div className="s overflow-auto">
      {/* Back Button */}
      <div className="p-4 md:p-0">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="mb-4 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Image Gallery */}
      <Card className="p-0 rounded-none overflow-hidden">
        <CardContent className="p-0 rounded-none">
          <div className="relative">
            <Carousel className="w-full rounded-none">
              <CarouselContent className='rounded-none md:rounded-lg'>
                {property.images?.length > 0 ? property.images.map((image: CloudinaryImage, index: number) => (
                  <CarouselItem key={index} className='rounded-none md:rounded-lg'>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-0">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Property Header */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{property.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm md:text-base">{property.location.address}, {property.location.city}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                🚌 {property.distanceToUniversity}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-sm md:text-base">{property.details.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-sm md:text-base">{property.details.bathrooms} Bathrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-sm md:text-base">{property.details.area.value} {property.details.area.unit}</span>
              </div>
            </div>

            <div className="text-xl md:text-2xl font-bold">
              ₦{property.price.amount.toLocaleString()}/{property.price.period}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">About This Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Contact Agent - Mobile Only (after About section) */}
          <div className="block lg:hidden bg-gray-50 rounded-lg p-4 space-y-4">
            <h2 className="text-lg font-semibold">Contact Agent</h2>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={property.agent?.profilePicture} />
                <AvatarFallback>
                  {property.agent?.name?.split(' ').map((n: string) => n[0]).join('') || 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{property.agent?.name}</div>
                <div className="text-sm text-muted-foreground">{property.agent?.company}</div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{property.agent?.rating}</span>
                  <span className="text-muted-foreground">({property.agent?.totalReviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Typically responds in {property.agent?.responseTime} hours
            </div>

            <div className="space-y-2">
              <Button className="w-full" asChild>
                <Link href={`/messages?agent=${property.agent?.id}&property=${property.id}`}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Link>
              </Button>
              {/* <Button variant="outline" className="w-full" asChild>
                <Link href={`/apply/${property.id}`}>
                  <FileText className="w-4 h-4 mr-2" />
                  Apply Now
                </Link>
              </Button> */}
            </div>
          </div>

          <Separator />

          {/* Property Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-600">Property Type:</span>
                <p className="capitalize font-medium">{property.type || 'Not specified'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-600">Furnished:</span>
                <p className="font-medium">{property.details?.furnished ? 'Yes' : 'No'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-600">Available From:</span>
                <p className="font-medium">
                  {property.availableFrom ?
                    new Date(property.availableFrom).toLocaleDateString() :
                    'Not specified'
                  }
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-600">Lease Duration:</span>
                <p className="font-medium">
                  {property.details?.leaseDuration ?
                    `${property.details.leaseDuration.min}-${property.details.leaseDuration.max} ${property.details.leaseDuration.unit}` :
                    '12 months'
                  }
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Amenities */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.amenities?.length > 0 ? property.amenities.map((amenity: string, index: number) => (
                <div key={index} className="flex items-center gap-3 py-2">
                  {getAmenityIcon(amenity)}
                  <span className="text-sm md:text-base">{amenity}</span>
                </div>
              )) : (
                <div className="text-sm text-muted-foreground">No amenities listed</div>
              )}
            </div>
          </div>

          <Separator />

          {/* Utilities & Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Utilities</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-green-600">Included:</span>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                    {property.utilities?.included?.map((utility: string, index: number) => (
                      <li key={index}>{utility}</li>
                    )) || <li>None specified</li>}
                  </ul>
                </div>
                <div>
                  <span className="text-sm font-medium text-orange-600">Not Included:</span>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                    {property.utilities?.excluded?.map((utility: string, index: number) => (
                      <li key={index}>{utility}</li>
                    )) || <li>None specified</li>}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">House Rules</h2>
              <ul className="space-y-2">
                {property.rules?.length > 0 ? property.rules.map((rule: string, index: number) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {rule}
                  </li>
                )) : (
                  <li className="text-sm text-muted-foreground">No specific rules</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar - Desktop Only */}
        <div className="hidden lg:block space-y-8">
          {/* Agent Contact */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4 sticky top-4">
            <h2 className="text-lg font-semibold">Contact Agent</h2>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={property.agent?.profilePicture} />
                <AvatarFallback>
                  {property.agent?.name?.split(' ').map((n: string) => n[0]).join('') || 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{property.agent?.name}</div>
                <div className="text-sm text-muted-foreground">{property.agent?.company}</div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{property.agent?.rating}</span>
                  <span className="text-muted-foreground">({property.agent?.totalReviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Typically responds in {property.agent?.responseTime} hours
            </div>

            <div className="space-y-2">
              <Button className="w-full" asChild>
                <Link href={`/messages?agent=${property.agent?.id}&property=${property.id}`}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Link>
              </Button>
              {/* <Button variant="outline" className="w-full" asChild>
                <Link href={`/apply/${property.id}`}>
                  <FileText className="w-4 h-4 mr-2" />
                  Apply Now
                </Link>
              </Button> */}
            </div>
          </div>

          {/* Nearby Places */}
          {/* <div className="space-y-4">
            <h2 className="text-lg font-semibold">Nearby Places</h2>
            <div className="space-y-3">
              {property.nearbyPlaces?.length && property.nearbyPlaces?.length > 0 ? property.nearbyPlaces.map((place: { name: string; distance: string; type: string }, index: number) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
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
          </div> */}
        </div>
      </div>
    </div>
  );
}