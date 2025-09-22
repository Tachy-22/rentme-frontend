import { Conversation } from '../types';
import { getUserById, getPropertyById } from '../data';
import Image from 'next/image';
import Link from 'next/link';

interface ConversationCardProps {
  conversation: Conversation;
  currentUserId: string;
}

export function ConversationCard({ conversation, currentUserId }: ConversationCardProps) {
  // Get the other participant (not the current user)
  const otherParticipantId = conversation.participants.find(id => id !== currentUserId);
  const otherParticipant = otherParticipantId ? getUserById(otherParticipantId) : null;

  // Get property info if this conversation is about a specific property
  const property = conversation.propertyId ? getPropertyById(conversation.propertyId) : null;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  const isUnread = conversation.lastMessage?.status !== 'read';

  if (!otherParticipant) return null;

  return (
    <Link href={`/messages/${conversation.id}`}>
      <div className="flex items-start space-x-3 p-4 md:p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
        {/* Profile Picture */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden">
            <Image
              src={otherParticipant.profile.profilePicture}
              alt={`${otherParticipant.profile.firstName} ${otherParticipant.profile.lastName}`}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Online indicator - you could add online status logic here */}
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
        </div>

        {/* Conversation Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <h3 className={`text-sm md:text-base font-medium truncate ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                {otherParticipant.profile.firstName} {otherParticipant.profile.lastName}
              </h3>
              {otherParticipant.role === 'agent' && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Agent
                </span>
              )}
              {conversation.isGroup && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Group
                </span>
              )}
            </div>
            <span className="text-xs md:text-sm text-gray-500 flex-shrink-0">
              {conversation.lastMessage ? formatTimeAgo(conversation.lastMessage.sentAt) : ''}
            </span>
          </div>

          {/* Property Context */}
          {property && (
            <div className="flex items-center space-x-1 mb-1">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs text-gray-500 truncate">{property.title}</span>
            </div>
          )}

          {/* Last Message */}
          {conversation.lastMessage && (
            <div className="flex items-center justify-between">
              <p className={`text-sm md:text-base truncate ${isUnread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                {conversation.lastMessage.senderId === currentUserId && (
                  <span className="text-gray-400 mr-1">You: </span>
                )}
                {conversation.lastMessage.type === 'image' ? '📷 Photo' :
                  conversation.lastMessage.type === 'document' ? '📄 Document' :
                    conversation.lastMessage.content}
              </p>

              <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                {/* Message Status */}
                {conversation.lastMessage.senderId === currentUserId && (
                  <div className="flex items-center">
                    {conversation.lastMessage.status === 'sent' && (
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {conversation.lastMessage.status === 'delivered' && (
                      <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {conversation.lastMessage.status === 'read' && (
                      <div className="flex">
                        <svg className="w-3 h-3 text-orange-500 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                )}

                {/* Unread Badge */}
                {isUnread && conversation.lastMessage.senderId !== currentUserId && (
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                )}
              </div>
            </div>
          )}

          {/* Group Members Count */}
          {conversation.isGroup && (
            <div className="flex items-center space-x-1 mt-1">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs text-gray-500">
                {conversation.participants.length} members
              </span>
            </div>
          )}
        </div>

        {/* Action Menu */}
        <div className="flex-shrink-0">
          <button className="p-1 rounded-full hover:bg-gray-200 transition-colors">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}