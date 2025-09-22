import { User, StudentProfile } from '../types';
import Image from 'next/image';

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  const profile = user.profile as StudentProfile;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">RentMe</h1>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5 5-5H9l11.5-5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z" />
            </svg>
            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>

          {/* Profile Picture */}
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
            <Image
              src={profile.profilePicture}
              alt={`${profile.firstName} ${profile.lastName}`}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}