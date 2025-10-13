'use client';

import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Navigation, Search } from 'lucide-react';

interface LocationSearchProps {
  onLocationSelect: (location: {
    address: string;
    city: string;
    state: string;
    coordinates: { lat: number; lng: number };
  }) => void;
}

interface LocationSuggestion {
  address: string;
  city: string;
  state: string;
  coordinates: { lat: number; lng: number };
}

// Location suggestions will be fetched from a real geocoding service
// For now, we'll implement a simple address input without suggestions
// In production, integrate with Google Places API, Mapbox, or similar service

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchLocations = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // TODO: Implement real geocoding service integration
    // For now, we'll just clear suggestions as we don't use dummy data
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    searchLocations(value);
  };

  const handleLocationSelect = (location: LocationSuggestion) => {
    setQuery(location.address);
    setShowSuggestions(false);
    onLocationSelect(location);
  };

  const getCurrentLocation = () => {
    setIsSearching(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // TODO: Implement reverse geocoding with a real service
          // For now, we'll use coordinates only without dummy address data
          onLocationSelect({
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            city: '',
            state: '',
            coordinates: { lat: latitude, lng: longitude }
          });
          
          setQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setIsSearching(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsSearching(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      console.error('Geolocation is not supported');
      setIsSearching(false);
    }
  };

  return (
    <div className="relative">
      {/* <div className="flex space-x-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by neighborhood, city, or address..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={getCurrentLocation}
          disabled={isSearching}
          title="Use current location"
        >
          <Navigation className={`h-4 w-4 ${isSearching ? 'animate-spin' : ''}`} />
        </Button>
      </div> */}

      {/* Location Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto">
          <CardContent className="p-0">
            {suggestions.map((location, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                onClick={() => handleLocationSelect(location)}
              >
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{location.address}</p>
                  <p className="text-xs text-muted-foreground">
                    {location.city}, {location.state}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}