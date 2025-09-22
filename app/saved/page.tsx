'use client';

import { useState, useMemo } from 'react';
import { getSavedPropertiesByUser, getPropertyById, getStudents } from '../../data';
import { PropertyCard } from '../../components/PropertyCard';
import { BottomNavigation } from '../../components/BottomNavigation';
import { Header } from '../../components/Header';
import { Property } from '@/types';

export default function SavedPage() {
  const currentUser = getStudents()[3];
  const savedProperties = getSavedPropertiesByUser(currentUser.id);
  const allProperties = savedProperties.map(saved => getPropertyById(saved.propertyId)).filter((property): property is Property => property !== undefined);

  const [activeFilter, setActiveFilter] = useState('all');

  const properties = useMemo(() => {
    if (activeFilter === 'all') return allProperties;
    if (activeFilter === 'recent') {
      return [...allProperties].sort((a, b) => {
        const savedA = savedProperties.find(s => s.propertyId === a.id);
        const savedB = savedProperties.find(s => s.propertyId === b.id);
        return new Date(savedB!.savedAt).getTime() - new Date(savedA!.savedAt).getTime();
      });
    }
    if (activeFilter === 'price-low') {
      return [...allProperties].sort((a, b) => a.price.amount - b.price.amount);
    }
    return allProperties;
  }, [allProperties, activeFilter]);

  return (
    <div className="min-h-screen bg-gray-5 md:pt-[2rem]">
      {/* Mobile Header */}
      <div className="md:hidden">
        <Header user={currentUser} />
      </div>

      <main className="pb-20 md:pb-0 md:pt-16 md:max-w-7xl md:mx-auto md:px-4 lg:px-6">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 md:rounded-lg md:mb-6 md:border md:shadow-sm">
          <div className="px-4 py-6 md:px-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Saved Properties</h1>
            <p className="text-gray-600 md:text-lg">
              {properties.length} {properties.length === 1 ? 'property' : 'properties'} saved
            </p>
          </div>
        </div>

        {/* Empty State */}
        {properties.length === 0 ? (
          <div className="px-4 py-12 md:px-0">
            <div className="text-center bg-white rounded-lg p-8 md:p-12 border border-gray-200 shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">No saved properties</h3>
              <p className="text-gray-600 mb-6 md:text-lg">
                Start exploring properties and save your favorites to see them here.
              </p>
              <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors">
                Browse Properties
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Filter/Sort Options */}
            <div className="px-4 py-4 bg-white border-b border-gray-200 md:rounded-lg md:mb-6 md:border md:shadow-sm md:px-6">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2 md:space-x-3">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'recent', label: 'Recently Added' },
                    { id: 'price-low', label: 'Low to High' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-sm font-medium transition-colors ${activeFilter === filter.id
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button> */}
              </div>
            </div>

            {/* Saved Properties Grid */}
            <div className="px-4 py-6 space-y-6 md:px-0 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
              {properties.map((property) => {
                const savedInfo = savedProperties.find(saved => saved.propertyId === property.id);
                return (
                  <div key={property.id} className="space-y-2">
                    <PropertyCard
                      property={property}
                      currentUserId={currentUser.id}
                    />
                    {savedInfo?.notes && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-yellow-800">Your Note</p>
                            <p className="text-sm text-yellow-700">{savedInfo?.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="px-4 pb-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Contact All</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Export List</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <BottomNavigation currentRoute="saved" />
    </div>
  );
}