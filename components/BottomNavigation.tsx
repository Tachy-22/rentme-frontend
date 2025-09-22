'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BottomNavigationProps {
  currentRoute: string;
}

export function BottomNavigation({ currentRoute }: BottomNavigationProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: 'home',
      active: currentRoute === 'home' || pathname === '/'
    },
    {
      name: 'Search',
      href: '/search',
      icon: 'search',
      active: currentRoute === 'search' || pathname === '/search'
    },
    {
      name: 'Saved',
      href: '/saved',
      icon: 'heart',
      active: currentRoute === 'saved' || pathname === '/saved'
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: 'chat',
      active: currentRoute === 'messages' || pathname === '/messages'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: 'user',
      active: currentRoute === 'profile' || pathname === '/profile'
    }
  ];

  const getIcon = (iconName: string, isActive: boolean) => {
    const className = `w-6 h-6 ${isActive ? 'text-orange-600' : 'text-gray-400'}`;

    switch (iconName) {
      case 'home':
        return (
          <svg className={className} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'search':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'heart':
        return (
          <svg className={className} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'chat':
        return (
          <svg className={className} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'user':
        return (
          <svg className={className} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Mobile Navigation - Bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center py-2 px-3 rounded-lg min-w-0 flex-1 transition-colors hover:bg-gray-50"
            >
              {getIcon(item.icon, item.active)}
              <span className={`text-xs mt-1 font-medium ${item.active ? 'text-orange-600' : 'text-gray-400'
                }`}>
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Desktop Navigation - Top */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="text-xl font-bold text-gray-900">RentMe</span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    item.active 
                      ? 'text-orange-600 ' 
                      : 'text-gray-700 hover:bg-orange-100'
                  }`}
                >
                  {getIcon(item.icon, item.active)}
                  <span className="font-light text-xs">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5zm0 0V3" />
                </svg>
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}