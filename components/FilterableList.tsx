'use client';

import { useState } from 'react';

interface FilterOption {
  id: string;
  label: string;
  isActive: boolean;
}

interface FilterableListProps {
  filters: FilterOption[];
  onFilterChange: (filterId: string) => void;
  children: React.ReactNode;
}

export function FilterableList({ filters, onFilterChange, children }: FilterableListProps) {
  return (
    <div>
      {/* Filter Options */}
      <div className="px-4 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filter.isActive
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}