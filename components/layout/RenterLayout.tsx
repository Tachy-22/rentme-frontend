'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';
import RenterNavigation from './RenterNavigation';
import { Loader2 } from 'lucide-react';

interface RenterLayoutProps {
  children: ReactNode;
}

export default function RenterLayout({ children }: RenterLayoutProps) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <RenterNavigation />
        <main className="flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto overflow-hidden p-6 max-h-[calc(100vh-4rem)]  b600">
        {children}
      </main>
    </div>
  );
}