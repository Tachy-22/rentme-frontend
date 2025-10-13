'use server';

import { addDocument } from '@/actions/firebase/addDocument';
import { queryDocuments } from '@/actions/firebase/queryDocuments';
import { SearchFilters } from '@/types';

interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  searchQuery?: string;
  filters: Partial<SearchFilters>;
  createdAt: string;
  updatedAt: string;
  notificationsEnabled: boolean;
}

interface SaveSearchParams {
  userId: string;
  name: string;
  searchQuery?: string;
  filters: Partial<SearchFilters>;
  notificationsEnabled?: boolean;
}

interface SaveSearchResult {
  success: boolean;
  searchId?: string;
  error?: string;
}

export async function saveSearch(params: SaveSearchParams): Promise<SaveSearchResult> {
  try {
    const { userId, name, searchQuery, filters, notificationsEnabled = false } = params;

    const savedSearch: Omit<SavedSearch, 'id'> = {
      userId,
      name,
      searchQuery,
      filters,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notificationsEnabled
    };

    const result = await addDocument({
      collectionName: 'savedSearches',
      data: savedSearch
    });

    if (result.success) {
      return {
        success: true,
        searchId: result.id
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to save search'
      };
    }
  } catch (error) {
    console.error('Error saving search:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

interface GetSavedSearchesResult {
  success: boolean;
  searches: SavedSearch[];
  error?: string;
}

export async function getSavedSearches(userId: string): Promise<GetSavedSearchesResult> {
  try {
    const result = await queryDocuments({
      collectionName: 'savedSearches',
      filters: [{ field: 'userId', operator: '==', value: userId }],
      orderByField: 'createdAt',
      orderDirection: 'desc'
    });

    if (result.success) {
      const searches = result.data?.map(doc => doc as SavedSearch) || [];
      return {
        success: true,
        searches
      };
    } else {
      return {
        success: false,
        searches: [],
        error: result.error || 'Failed to get saved searches'
      };
    }
  } catch (error) {
    console.error('Error getting saved searches:', error);
    return {
      success: false,
      searches: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}