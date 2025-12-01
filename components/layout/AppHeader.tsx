'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { 
  User, 
  Settings,
  LogOut,
  Shield,
  Bell
} from 'lucide-react';

interface AppHeaderProps {
  userRole: 'agent' | 'admin';
}

export default function AppHeader({ userRole }: AppHeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/auth';
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return userRole === 'agent' ? 'A' : 'AD';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getPageTitle = () => {
    if (userRole === 'agent') {
      if (pathname.includes('/dashboard')) return 'Dashboard';
      if (pathname.includes('/properties')) {
        if (pathname.includes('/new')) return 'Add New Property';
        if (pathname.includes('/edit')) return 'Edit Property';
        return 'My Properties';
      }
      if (pathname.includes('/applications')) return 'Applications';
      if (pathname.includes('/messages')) return 'Messages';
      if (pathname.includes('/profile')) return 'Profile';
      if (pathname.includes('/renters')) return 'Matched Renters';
      return 'Dashboard';
    }

    if (userRole === 'admin') {
      if (pathname.includes('/dashboard')) return 'Admin Dashboard';
      if (pathname.includes('/users')) return 'User Management';
      if (pathname.includes('/properties')) return 'Property Management';
      if (pathname.includes('/verifications')) return 'Verification Management';
      if (pathname.includes('/analytics')) return 'Analytics';
      if (pathname.includes('/profile')) return 'Admin Profile';
      if (pathname.includes('/settings')) return 'Admin Settings';
      return 'Admin Dashboard';
    }

    return 'Dashboard';
  };

  const profile = user?.profile;
  const isVerified = (profile && 'verificationStatus' in profile) ? profile.verificationStatus === "verified" : false;

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        {/* <div>
          <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        </div> */}
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        {/* <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
            2
          </span>
        </Button> */}

        {/* Verification Status for Agents */}
        {userRole === 'agent' && !isVerified && (
          <Button size="sm" variant="outline" asChild>
            <Link href="/agent/verification">
              <Shield className="w-4 h-4 mr-2 lg:block hidden" />
              Get Verified
            </Link>
          </Button>
        )}

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile?.profilePicture} alt={profile?.firstName} />
                <AvatarFallback>
                  {getInitials(profile?.firstName, profile?.lastName)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">
                {profile?.firstName} {profile?.lastName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <Badge 
                  variant={userRole === 'admin' ? 'destructive' : isVerified ? 'default' : 'secondary'} 
                  className="text-xs"
                >
                  {userRole === 'admin' ? (
                    'Administrator'
                  ) : isVerified ? (
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
            {userRole === 'admin' && (
              <>
                <DropdownMenuItem asChild>
                  <Link href={`/${userRole}/profile`} className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${userRole}/settings`} className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            {userRole === 'agent' && !isVerified && (
              <DropdownMenuItem asChild>
                <Link href="/agent/verification" className="flex items-center">
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
    </header>
  );
}