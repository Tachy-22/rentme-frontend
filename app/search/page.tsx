import { getAvailableProperties, getStudents } from '../../data';
import { BottomNavigation } from '../../components/BottomNavigation';
import { Header } from '../../components/Header';
import { SearchablePropertyFeed } from '../../components/SearchablePropertyFeed';

export default function SearchPage() {
  const properties = getAvailableProperties();
  const currentUser = getStudents()[3];

  return (
    <div className="min-h-screen bg-gray-50 md:pt-[2rem]">
      {/* Mobile Header */}
      <div className="md:hidden">
        <Header user={currentUser} />
      </div>

      <main className="pb-20 md:pb-0 md:pt-16 md:max-w-7xl md:mx-auto md:px-4 lg:px-6">
        {/* Map Toggle */}
        <div className="px-4 py-3 bg-white border-b border-gray-200 md:rounded-lg md:mb-6 md:border md:shadow-sm md:px-6">
          <button className="w-full md:w-auto md:min-w-48 flex items-center justify-center space-x-2 py-2 md:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors hover:shadow-sm">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-sm md:text-base font-medium text-gray-700">Show Map View</span>
          </button>
        </div>

        <SearchablePropertyFeed
          properties={properties}
          currentUser={currentUser}
        />
      </main>

      <BottomNavigation currentRoute="search" />
    </div>
  );
}