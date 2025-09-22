import { getAvailableProperties, getStudents } from '../data';
import { PropertyCard } from '../components/PropertyCard';
import { BottomNavigation } from '../components/BottomNavigation';
import { Header } from '../components/Header';
import { SearchablePropertyFeed } from '../components/SearchablePropertyFeed';

export default function Home() {
  const properties = getAvailableProperties(); // Show all properties for filtering
  const currentUser = getStudents()[3]; // Mock current user as first student

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden">

        <Header user={currentUser} />
      </div>

      <main className="pb-20  md:pt-[6rem] md:max-w-7xl md:mx-auto md:px-4 lg:px-6">

        <SearchablePropertyFeed
          properties={properties}
          currentUser={currentUser}
        />
      </main>

      <BottomNavigation currentRoute="home" />
    </div>
  );
}
