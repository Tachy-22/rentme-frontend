'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { RenterProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Home,
  Search,
  Heart,
  MessageCircle,
  User,
  Bell,
  Settings,
  LogOut,
  Shield,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Houses', href: '/properties', icon: Search },
  { name: 'Saved', href: '/saved', icon: Heart },
  { name: 'My Chats', href: '/messages', icon: MessageCircle },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function RenterNavigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const renterProfile = user?.profile as RenterProfile;
  const isVerified = renterProfile?.verificationStatus == "verified" || false;

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2">
              <img 
                src="/logo-white.png" 
                alt="RentMe Logo" 
                className="h-4 md:h-6 w-auto"
              />
            </Link>

            {/* Search Bar - Hide on mobile */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search properties, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Navigation Links - Desktop Only */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      className={cn(
                        'flex items-center space-x-2',
                        isActive && 'bg-primary text-primary-foreground'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden lg:inline">{item.name}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                  3
                </span>
              </Button> */}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={renterProfile?.profilePicture} alt={renterProfile?.firstName} />
                      <AvatarFallback>
                        {getInitials(renterProfile?.firstName, renterProfile?.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">
                      {renterProfile?.firstName} {renterProfile?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    <div className="flex items-center space-x-2 pt-1">
                      <Badge variant={isVerified ? 'default' : 'secondary'} className="text-xs">
                        {isVerified ? (
                          <>
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </>
                        ) : (
                          'Unverified'
                        )}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  {!isVerified && (
                    <DropdownMenuItem asChild>
                      <Link href="/verification" className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Get Verified</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      {pathname !== '/messages' && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
          <div className="flex items-center justify-around pb-2 px-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.name} href={item.href} className="flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "flex flex-col items-center space-y-1 h-12 w-full pt-4",
                      isActive && "text-primary border-t-2 border-black rounded-none"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
                    <span className={cn("text-xs text-stone-500", isActive && "text-primary font-medium")}>
                      {item.name}
                    </span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}