'use client';

import { usePathname } from 'next/navigation';
import { Navigation } from './Navigation';

export function ConditionalNavigation() {
  const pathname = usePathname();

  // Don't show navigation on dashboard pages (they have their own DashboardLayout)
  const isDashboardPage = pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/message') ||
    pathname?.startsWith('/agent/') ||
    pathname?.startsWith('/applications') ||
    pathname?.startsWith('/profile') ||

    pathname?.startsWith('/admin/') ||
    pathname?.startsWith('/super-admin/');

  // Don't show navigation on certain auth pages that should be minimal
  const isMinimalAuthPage = pathname === '/auth/verification-pending' ||
    pathname === '/auth/verify-email';

  // Show navigation on most pages except dashboard and minimal auth pages
  const shouldShowNavigation = !isDashboardPage && !isMinimalAuthPage;

  if (!shouldShowNavigation) {
    return null;
  }

  // Use transparent variant for home page for better visual effect
  const variant = pathname === '/' ? 'transparent' : 'default';

  return <Navigation variant={"default"} />;
}