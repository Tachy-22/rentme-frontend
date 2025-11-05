'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Building2, 
  MessageCircle, 
  FileText,
  Plus,
  User
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const navigation = [
  { name: 'Dashboard', href: '/agent/dashboard', icon: Home },
  { name: 'Listings', href: '/agent/properties', icon: Building2 },
  { name: 'Applications', href: '/agent/applications', icon: FileText },
  { name: 'Messages', href: '/agent/messages', icon: MessageCircle },
  { name: 'Profile', href: '/agent/profile', icon: User },
];

export default function AgentNavigation() {
  const pathname = usePathname();


  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/agent/dashboard" className="flex items-center space-x-2 px-2">
          <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            RentMe
          </div>
          <Badge variant="secondary" className="text-xs">Agent</Badge>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href}>
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild variant="outline">
                <Link href="/agent/properties/new">
                  <Plus className="w-5 h-5" />
                  <span>Add New Listing</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

    </Sidebar>
  );
}