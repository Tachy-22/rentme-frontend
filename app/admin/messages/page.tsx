import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { getConversations } from '@/actions/messages/getConversations';
import MessagesPage from '@/components/messages/MessagesPage';
import { redirect } from 'next/navigation';

export default async function AdminMessagesPage() {
  const userResult = await getCurrentUser();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth');
  }

  const user = userResult.user;

  if (user.role !== 'admin') {
    redirect('/dashboard');
  }
  
  // Get initial conversations for the admin
  const conversationsResult = await getConversations();
  const initialConversations = conversationsResult.success ? conversationsResult.data : [];

  return <MessagesPage initialConversations={initialConversations} />;
}