import { getConversationsByUser, getUserById, getStudents, getMessagesByConversation, getPropertyById } from '../../../data';
import { Header } from '../../../components/Header';
import { ChatInterface } from '../../../components/ChatInterface';
import { SimpleBackButton } from '../../../components/SimpleBackButton';
import { notFound } from 'next/navigation';

interface ConversationPageProps {
  params: {
    id: string;
  };
}

export default function ConversationPage({ params }: ConversationPageProps) {
  const currentUser = getStudents()[3];
  const conversations = getConversationsByUser(currentUser.id);
  const conversation = conversations.find(conv => conv.id === params.id);

  if (!conversation) {
    notFound();
  }

  const messages = getMessagesByConversation(conversation.id);

  // Get the other participant(s)
  const otherParticipantIds = conversation.participants.filter(id => id !== currentUser.id);
  const otherParticipants = otherParticipantIds.map(id => getUserById(id)).filter((user): user is NonNullable<typeof user> => Boolean(user));

  // Get property info if this conversation is about a specific property
  const property = conversation.propertyId ? getPropertyById(conversation.propertyId) || null : null;

  // Determine conversation title
  const conversationTitle = conversation.isGroup
    ? conversation.groupName || 'Group Chat'
    : otherParticipants.length > 0
      ? `${otherParticipants[0]!.profile.firstName} ${otherParticipants[0]!.profile.lastName}`
      : 'Unknown';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={currentUser} />

      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SimpleBackButton />

            {/* Participant Info */}
            <div className="flex items-center space-x-3">
              {!conversation.isGroup && otherParticipants[0] && (
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={otherParticipants[0].profile.profilePicture}
                    alt={conversationTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h1 className="text-lg font-semibold text-gray-900">{conversationTitle}</h1>
                {conversation.isGroup ? (
                  <p className="text-sm text-gray-500">{conversation.participants.length} members</p>
                ) : otherParticipants[0]?.role === 'agent' ? (
                  <p className="text-sm text-gray-500">Property Agent</p>
                ) : (
                  <p className="text-sm text-green-500">Online</p>
                )}
              </div>
            </div>
          </div>

          {/* More Options */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>

        {/* Property Context Banner */}
        {property && (
          <div className="px-4 py-2 bg-orange-50 border-t border-orange-100">
            <div className="flex items-center space-x-2 text-sm">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-orange-800 font-medium">About: {property.title}</span>
              <span className="text-orange-600">•</span>
              <span className="text-orange-600">
                {new Intl.NumberFormat('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                  minimumFractionDigits: 0,
                }).format(property.price.amount)}/{property.price.period}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        <ChatInterface
          conversation={conversation}
          messages={messages}
          currentUser={currentUser}
          otherParticipants={otherParticipants}
          property={property}
        />
      </div>
    </div>
  );
}