'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';
import AgentNavigation from './AgentNavigation';
import AppHeader from './AppHeader';
import { Loader2 } from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

interface AgentLayoutProps {
  children: ReactNode;
}

export default function AgentLayout({ children }: AgentLayoutProps) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AgentNavigation />
      <SidebarInset>
        <AppHeader userRole="agent" />
        <main className="flex flex-col h-full w-full overflow-hidde p-6 max-h-[calc(100vh-4rem)]  b600">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}