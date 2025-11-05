import { ReactNode } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayoutRoute({ children }: AdminLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>;
}