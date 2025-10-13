'use client';

import React, { useState } from 'react';
import { SearchFilters } from '@/types';
import { saveSearch } from '@/actions/properties/saveSearch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Bell, Search, Trash2 } from 'lucide-react';

interface SavedSearchesProps {
  userId: string;
  currentSearchQuery?: string;
  currentFilters: Partial<SearchFilters>;
  savedSearches?: Array<{
    id: string;
    name: string;
    searchQuery?: string;
    filters: Partial<SearchFilters>;
    notificationsEnabled: boolean;
    createdAt: string;
  }>;
  onLoadSearch?: (searchQuery: string, filters: Partial<SearchFilters>) => void;
}

export function SavedSearches({
  userId,
  currentSearchQuery,
  currentFilters,
  savedSearches = [],
  onLoadSearch
}: SavedSearchesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSearch = async () => {
    if (!searchName.trim()) return;

    setIsSaving(true);
    try {
      const result = await saveSearch({
        userId,
        name: searchName.trim(),
        searchQuery: currentSearchQuery,
        filters: currentFilters,
        notificationsEnabled
      });

      if (result.success) {
        setIsDialogOpen(false);
        setSearchName('');
        setNotificationsEnabled(false);
        // In a real app, you'd refresh the saved searches list here
      }
    } catch (error) {
      console.error('Error saving search:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getFilterSummary = (filters: Partial<SearchFilters>) => {
    const summary: string[] = [];

    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      summary.push(`${filters.propertyTypes.length} property type${filters.propertyTypes.length > 1 ? 's' : ''}`);
    }

    if (filters.priceRange && (filters.priceRange.min > 0 || filters.priceRange.max < 2000000)) {
      summary.push(`$${filters.priceRange.min} - $${filters.priceRange.max}`);
    }

    if (filters.bedrooms && (filters.bedrooms.min > 0 || filters.bedrooms.max < 5)) {
      summary.push(`${filters.bedrooms.min}-${filters.bedrooms.max} bedrooms`);
    }

    if (filters.amenities && filters.amenities.length > 0) {
      summary.push(`${filters.amenities.length} amenity filter${filters.amenities.length > 1 ? 's' : ''}`);
    }

    if (filters.university) {
      summary.push(`Near ${filters.university}`);
    }

    return summary.length > 0 ? summary.join(', ') : 'No filters applied';
  };

  return (
    <div className="space-y-4">
      {/* Save Current Search */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Saved Searches</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Search
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Search</DialogTitle>
              <DialogDescription>
                Save your current search criteria to easily find similar properties later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="searchName">Search Name</Label>
                <Input
                  id="searchName"
                  placeholder="e.g., 2BR near University of Toronto"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Current Search</Label>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Query:</strong> {currentSearchQuery || 'No search query'}</p>
                  <p><strong>Filters:</strong> {getFilterSummary(currentFilters)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
                <Label htmlFor="notifications" className="text-sm">
                  Email me when new properties match this search
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSearch} disabled={!searchName.trim() || isSaving}>
                {isSaving ? 'Saving...' : 'Save Search'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Saved Searches List */}
      {savedSearches.length > 0 ? (
        <div className="grid gap-3">
          {savedSearches.map((search) => (
            <Card key={search.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{search.name}</CardTitle>
                    <CardDescription className="text-xs">
                      Saved {new Date(search.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1">
                    {search.notificationsEnabled && (
                      <Badge variant="secondary" className="text-xs">
                        <Bell className="h-3 w-3 mr-1" />
                        Alerts
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {search.searchQuery && (
                    <p className="text-sm">
                      <strong>Query:</strong> {search.searchQuery}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {getFilterSummary(search.filters)}
                  </p>
                  <div className="flex items-center space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onLoadSearch?.(search.searchQuery || '', search.filters)}
                    >
                      <Search className="h-3 w-3 mr-1" />
                      Load Search
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-6 text-center">
            <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No saved searches yet. Save your current search to easily find it later.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}