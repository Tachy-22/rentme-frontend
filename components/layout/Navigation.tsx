'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { UserDropdown } from './UserDropdown';

interface NavigationProps {
  variant?: 'default' | 'transparent';
  showGetStarted?: boolean;
}

export function Navigation({ variant = 'default', showGetStarted = true }: NavigationProps) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const headerClasses = variant === 'transparent'
    ? "border-b  bg-background sticky top-0 z-[60]"
    : "border-b bg-background sticky top-0 z-[60]";

  const isAuthPage = pathname?.startsWith('/auth/');
  const isHomePage = pathname === '/';

  return (
    <header className={headerClasses}>
      <div className="lg:max-w-7xl w-full mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Home className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">RentMe</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {!isAuthPage && (
            <>
              <Link
                href="/search"
                className={`text-sm font-medium hover:text-primary transition-colors ${pathname === '/search' ? 'text-primary' : ''
                  }`}
              >
                Search Properties
              </Link>

              {!isHomePage && (
                <Link
                  href="/about"
                  className={`text-sm font-medium hover:text-primary transition-colors ${pathname === '/about' ? 'text-primary' : ''
                    }`}
                >
                  About
                </Link>
              )}
            </>
          )}

          {/* Auth Links / User Dropdown */}
          {!isAuthPage ? (
            <>
              {!loading && (
                user ? (
                  <UserDropdown user={user} />
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Sign In
                    </Link>
                    {showGetStarted && (
                      <Button asChild>
                        <Link href="/auth/register">Get Started</Link>
                      </Button>
                    )}
                  </>
                )
              )}
            </>
          ) : (
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Back to Home
            </Link>
          )}
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          {!loading && (
            user ? (
              <UserDropdown user={user} />
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
}