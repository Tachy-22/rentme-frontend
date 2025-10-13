'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  User as UserIcon,
  Settings,
  LogOut,
  Building,
  Heart,
  MessageSquare,
  Calendar,
  BarChart3,
  Users
} from 'lucide-react';

interface UserDropdownProps {
  user: User;
}

export function UserDropdown({ user }: UserDropdownProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const { logout } = await import('@/actions/auth/logout');
    await logout();
    router.push('/');
  };

  const getDashboardLink = () => {
    switch (user.role) {
      case 'agent':
        return '/agent/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'super_admin':
        return '/super-admin/dashboard';
      default:
        return '/dashboard';
    }
  };

  const getRoleSpecificMenuItems = () => {
    switch (user.role) {
      case 'agent':
        return [
          {
            label: 'Properties',
            href: '/agent/properties',
            icon: Building
          },
          {
            label: 'Applications',
            href: '/agent/applications',
            icon: Calendar
          },
          {
            label: 'Analytics',
            href: '/agent/analytics',
            icon: BarChart3
          }
        ];
      case 'admin':
      case 'super_admin':
        return [
          {
            label: 'Users',
            href: user.role === 'admin' ? '/admin/users' : '/super-admin/users',
            icon: Users
          },
          {
            label: 'Properties',
            href: user.role === 'admin' ? '/admin/properties' : '/super-admin/properties',
            icon: Building
          },
          {
            label: 'Analytics',
            href: user.role === 'admin' ? '/admin/reports' : '/super-admin/analytics',
            icon: BarChart3
          }
        ];
      default: // renter
        return [
          {
            label: 'Saved Properties',
            href: '/saved',
            icon: Heart
          },
          {
            label: 'Applications',
            href: '/applications',
            icon: Calendar
          }
        ];
    }
  };

  const getInitials = () => {
    const firstName = user.profile?.firstName || '';
    const lastName = user.profile?.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getDisplayName = () => {
    const firstName = user.profile?.firstName || '';
    const lastName = user.profile?.lastName || '';
    return firstName && lastName ? `${firstName} ${lastName}` : user.email;
  };

  const profilePicture = user.profile?.profilePicture || '';
  const roleSpecificItems = getRoleSpecificMenuItems();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profilePicture} alt={getDisplayName()} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground capitalize">
              {user.role.replace('_', ' ')}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Dashboard */}
        <DropdownMenuItem asChild>
          <Link href={getDashboardLink()}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        {/* Role-specific menu items */}
        {roleSpecificItems.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href}>
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </DropdownMenuItem>
          );
        })}

        {/* Common items */}
        <DropdownMenuItem asChild>
          <Link href="/messages">
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/profile/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}