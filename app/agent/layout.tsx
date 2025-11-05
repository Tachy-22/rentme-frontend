import { ReactNode } from 'react';
import AgentLayout from '@/components/layout/AgentLayout';

interface AgentLayoutProps {
  children: ReactNode;
}

export default function AgentLayoutRoute({ children }: AgentLayoutProps) {
  return <AgentLayout>{children}</AgentLayout>;
}