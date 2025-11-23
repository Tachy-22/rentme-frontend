import { getCurrentUser } from '@/actions/auth/getCurrentUser';
import { getConversations } from '@/actions/messages/getConversations';
import MessagesPage from '@/components/messages/MessagesPage';
import RenterLayout from '@/components/layout/RenterLayout';
import AgentLayout from '@/components/layout/AgentLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import { redirect } from 'next/navigation';

export default async function MessagesPageRoute() {
  const userResult = await getCurrentUser();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth');
  }

  const user = userResult.user;
  
  // Get initial conversations
  const conversationsResult = await getConversations();
  const initialConversations = conversationsResult.success ? conversationsResult.data : [];
  
  // Choose layout based on user role
  let LayoutComponent;
  switch (user.role) {
    case 'agent':
      LayoutComponent = AgentLayout;
      break;
    case 'admin':
      LayoutComponent = AdminLayout;
      break;
    default:
      LayoutComponent = RenterLayout;
      break;
  }

  return (
    <LayoutComponent>
      <MessagesPage initialConversations={initialConversations as unknown as Parameters<typeof MessagesPage>[0]['initialConversations']} />
    </LayoutComponent>
  );
}