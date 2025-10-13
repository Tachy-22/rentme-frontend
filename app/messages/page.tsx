import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { getConversations } from '@/actions/messages/getConversations';
import { findOrCreateConversation } from '@/actions/messages/findOrCreateConversation';
import { MessagesClient } from '@/components/messages/MessagesClient';

export const dynamic = 'force-dynamic';

interface MessagesPageProps {
  searchParams: Promise<{ to?: string; property?: string }>;
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const params = await searchParams;
  let initialConversationId: string | null = null;

  // If 'to' and 'property' parameters are provided, find or create conversation
  if (params.to && params.property) {
    const conversationResult = await findOrCreateConversation(
      user.id,
      params.to,
      params.property
    );
    
    if (conversationResult.success) {
      initialConversationId = conversationResult.conversationId as string;
    }
  }

  // Get user's conversations
  const conversationsResult = await getConversations(user.id);
  const conversations = conversationsResult.success ? conversationsResult.conversations : [];

  return (
    <MessagesClient 
      user={user} 
      conversations={conversations}
      initialConversationId={initialConversationId}
    />
  );
}