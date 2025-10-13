import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { MessagesClient } from '@/components/messages/MessagesClient';

export const dynamic = 'force-dynamic';

export default async function AgentMessagesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Only agents can access this page
  if (user.role !== 'agent') {
    redirect('/dashboard');
  }

  // TODO: Fetch agent's conversations from database
  const conversations: Array<{
    id: string;
    participant: {
      id: string;
      name: string;
      avatar: string;
      role: string;
      lastSeen: string;
    };
    lastMessage: {
      content: string;
      timestamp: string;
      unread: boolean;
    };
    property: {
      title: string;
      address: string;
    };
  }> = [];

  return (
    <MessagesClient 
      user={user} 
      conversations={conversations}
    />
  );
}