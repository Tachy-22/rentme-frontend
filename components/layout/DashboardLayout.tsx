'use client';

import React from 'react';
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
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { 
  Home, 
  Search, 
  Heart, 
  MessageSquare, 
  Calendar, 
  Settings, 
  LogOut, 
  Bell,
  User as UserIcon,
  Building,
  Users,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { logout as logoutAction } from '@/actions/auth/logout';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User;
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleLogout = async () => {
    await logoutAction();
    router.push('/auth/login');
  };

  const getPageName = (path: string) => {
    // Remove leading slash and split by slash
    const segments = path.replace(/^\//, '').split('/');
    
    // Handle specific routes
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/search') return 'Search Properties';
    if (path === '/saved') return 'Saved Properties';
    if (path === '/applications') return 'My Applications';
    if (path === '/messages') return 'Messages';
    if (path === '/profile') return 'Profile';
    if (path.startsWith('/profile/settings')) return 'Settings';
    if (path.startsWith('/properties/')) return 'Property Details';
    
    // Agent routes
    if (path === '/agent/dashboard') return 'Agent Dashboard';
    if (path === '/agent/properties') return 'My Properties';
    if (path === '/agent/applications') return 'Applications';
    if (path === '/agent/analytics') return 'Analytics';
    
    // Admin routes
    if (path === '/admin/dashboard') return 'Admin Dashboard';
    if (path === '/admin/users') return 'User Management';
    if (path === '/admin/properties') return 'Property Management';
    if (path === '/admin/reports') return 'Reports';
    
    // Super admin routes
    if (path === '/super-admin/dashboard') return 'Super Admin Dashboard';
    if (path === '/super-admin/users') return 'User Management';
    if (path === '/super-admin/agents') return 'Agent Management';
    if (path === '/super-admin/analytics') return 'System Analytics';
    if (path === '/super-admin/system') return 'System Settings';
    
    // Fallback: capitalize last segment
    const lastSegment = segments[segments.length - 1];
    return lastSegment ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace('-', ' ') : 'Dashboard';
  };

  const getNavigationItems = (role: string) => {
    switch (role) {
      case 'renter':
        return [
          { title: 'Dashboard', url: '/dashboard', icon: Home },
          { title: 'Search', url: '/search', icon: Search },
          { title: 'Saved', url: '/saved', icon: Heart },
          { title: 'Applications', url: '/applications', icon: Calendar },
          { title: 'Messages', url: '/messages', icon: MessageSquare },
          { title: 'Profile', url: '/profile', icon: UserIcon },
          { title: 'Settings', url: '/profile/settings', icon: Settings },
        ];
      case 'agent':
        return [
          { title: 'Dashboard', url: '/agent/dashboard', icon: Home },
          { title: 'Properties', url: '/agent/properties', icon: Building },
          { title: 'Applications', url: '/agent/applications', icon: Calendar },
          { title: 'Messages', url: '/messages', icon: MessageSquare },
          { title: 'Analytics', url: '/agent/analytics', icon: BarChart3 },
          { title: 'Profile', url: '/profile', icon: UserIcon },
          { title: 'Settings', url: '/profile/settings', icon: Settings },
        ];
      case 'admin':
        return [
          { title: 'Dashboard', url: '/admin/dashboard', icon: Home },
          { title: 'Users', url: '/admin/users', icon: Users },
          { title: 'Properties', url: '/admin/properties', icon: Building },
          { title: 'Reports', url: '/admin/reports', icon: BarChart3 },
          { title: 'Messages', url: '/messages', icon: MessageSquare },
          { title: 'Settings', url: '/profile/settings', icon: Settings },
        ];
      case 'super_admin':
        return [
          { title: 'Dashboard', url: '/super-admin/dashboard', icon: Home },
          { title: 'Users', url: '/super-admin/users', icon: Users },
          { title: 'Agents', url: '/super-admin/agents', icon: Building },
          { title: 'Analytics', url: '/super-admin/analytics', icon: BarChart3 },
          { title: 'System', url: '/super-admin/system', icon: Settings },
        ];
      default:
        return [
          { title: 'Dashboard', url: '/dashboard', icon: Home },
          { title: 'Messages', url: '/messages', icon: MessageSquare },
          { title: 'Profile', url: '/profile', icon: UserIcon },
          { title: 'Settings', url: '/profile/settings', icon: Settings },
        ];
    }
  };

  const navigationItems = getNavigationItems(user.role);


  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="font-bold">R</span>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">RentMe</span>
                    <span className="truncate text-xs">{user.role.replace('_', ' ')}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user.profile.profilePicture} alt={user.profile.firstName} />
                      <AvatarFallback className="rounded-lg">
                        {user.profile.firstName[0]}{user.profile.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.profile.firstName} {user.profile.lastName}
                      </span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.profile.profilePicture} alt={user.profile.firstName} />
                        <AvatarFallback className="rounded-lg">
                          {user.profile.firstName[0]}{user.profile.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user.profile.firstName} {user.profile.lastName}
                        </span>
                        <span className="truncate text-xs">{user.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
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
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <main className="flex flex-1 flex-col transition-all duration-300 ease-in-out ">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          
          {/* Page Title */}
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">
              {getPageName(pathname)}
            </h1>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}