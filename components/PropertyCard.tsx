'use client';

import { Property } from '../types';
import { getUserById, getSavedPropertiesByUser } from '../data';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface PropertyCardProps {
  property: Property;
  currentUserId: string;
}

export function PropertyCard({ property, currentUserId }: PropertyCardProps) {
  const agent = getUserById(property.agentId);
  const savedProperties = getSavedPropertiesByUser(currentUserId);
  const [isSaved, setIsSaved] = useState(
    savedProperties.some(saved => saved.propertyId === property.id)
  );

  const toggleSave = () => {
    setIsSaved(!isSaved);
    // In real app, this would make an API call
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const primaryUniversity = property.location.nearbyUniversities[0];
  const distanceInfo = property.location.distanceToUniversity[primaryUniversity];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow md:max-w-sm">
      {/* Property Images */}
      <div className="relative h-48 md:h-56">
        <Image
          src={property.images[0]?.url || '/placeholder-property.jpg'}
          alt={property.title}
          fill
          className="object-cover"
        />

        {/* Save Button */}
        <button
          onClick={toggleSave}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
        >
          <svg
            className={`w-5 h-5 ${isSaved ? 'text-red-500 fill-current' : 'text-gray-600'}`}
            fill={isSaved ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Property Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 capitalize">
            {property.type}
          </span>
        </div>

        {/* Image Count Indicator */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-black/70 text-white">
              1/{property.images.length}
            </span>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4 md:p-5">
        {/* Price and Title */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 mr-3">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1 md:text-base">
              {property.title}
            </h3>
            <p className="text-sm text-gray-600 md:text-xs truncate">{property.location.address}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-lg text-gray-900 md:text-base">
              {formatPrice(property.price.amount)}
            </p>
            <p className="text-xs text-gray-500">/{property.price.period}</p>
          </div>
        </div>

        {/* Property Details */}
        <div className="flex items-center space-x-3 md:space-x-2 text-sm md:text-xs text-gray-600 mb-3">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
            {property.details.bedrooms} bed
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
            {property.details.bathrooms} bath
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {property.details.area.value} {property.details.area.unit}
          </div>
        </div>

        {/* Distance to University */}
        <div className="flex items-center text-sm md:text-xs text-gray-600 mb-3">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{distanceInfo?.distance} {distanceInfo?.unit} from {primaryUniversity}</span>
        </div>

        {/* Key Amenities */}
        <div className="flex flex-wrap gap-1 mb-4">
          {property.amenities.slice(0, 2).map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700"
            >
              {amenity}
            </span>
          ))}
          {property.amenities.length > 2 && (
            <span className="text-xs text-gray-500">
              +{property.amenities.length - 2} more
            </span>
          )}
        </div>

        {/* Agent Info and Actions */}
        <div className="flex items-center justify-between">
          {/* Agent Info */}
          <div className="flex items-center space-x-2 flex-1 min-w-0 mr-3">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={agent?.profile.profilePicture || '/placeholder-avatar.jpg'}
                alt={`${agent?.profile.firstName} ${agent?.profile.lastName}`}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm md:text-xs font-medium text-gray-900 truncate">
                {agent?.profile.firstName} {agent?.profile.lastName}
              </p>
              <div className="flex items-center">
                <svg className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs text-gray-500">{agent?.profile.rating}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-1 md:space-x-2 flex-shrink-0">
            <Link
              href={`/messages/new?agentId=${property.agentId}&propertyId=${property.id}`}
              className="px-2 md:px-3 py-1.5 border border-gray-300 rounded-md text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Message
            </Link>
            <Link
              href={`/property/${property.id}`}
              className="px-2 md:px-3 py-1.5 bg-orange-600 text-white rounded-md text-xs md:text-sm font-medium hover:bg-orange-700 transition-colors"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}