import { ReactNode } from 'react';
import RenterLayout from '@/components/layout/RenterLayout';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <RenterLayout>{children}</RenterLayout>;
}