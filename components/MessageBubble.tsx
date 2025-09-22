import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isFromCurrentUser: boolean;
  isLastInGroup: boolean;
  senderName: string;
  showAvatar?: boolean;
}

export function MessageBubble({
  message,
  isFromCurrentUser,
  isLastInGroup,
  senderName,
  showAvatar = false
}: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusIcon = () => {
    if (!isFromCurrentUser) return null;

    switch (message.status) {
      case 'sent':
        return (
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'delivered':
        return (
          <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'read':
        return (
          <div className="flex">
            <svg className="w-3 h-3 text-orange-500 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'} ${isLastInGroup ? 'mb-4' : 'mb-1'}`}>
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isFromCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar (for group chats) */}
        {showAvatar && !isFromCurrentUser && (
          <div className="w-6 h-6 rounded-full bg-gray-300 flex-shrink-0"></div>
        )}

        {/* Message Content */}
        <div className={`flex flex-col ${isFromCurrentUser ? 'items-end' : 'items-start'}`}>
          {/* Sender Name (for group chats) */}
          {!isFromCurrentUser && isLastInGroup && senderName !== 'You' && (
            <span className="text-xs text-gray-500 mb-1 px-3">{senderName}</span>
          )}

          {/* Message Bubble */}
          <div
            className={`relative px-4 py-2 rounded-2xl ${isFromCurrentUser
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-900 border border-gray-200'
              } ${isLastInGroup
                ? isFromCurrentUser
                  ? 'rounded-br-md'
                  : 'rounded-bl-md'
                : ''
              }`}
          >
            {/* Message Content */}
            {message.type === 'text' && (
              <p className="text-sm leading-relaxed break-words">{message.content}</p>
            )}

            {message.type === 'image' && (
              <div className="space-y-2">
                <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                {message.content && <p className="text-sm">{message.content}</p>}
              </div>
            )}

            {message.type === 'document' && (
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm">Document</span>
              </div>
            )}
          </div>

          {/* Message Info */}
          {isLastInGroup && (
            <div className={`flex items-center space-x-1 mt-1 px-3 ${isFromCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <span className="text-xs text-gray-500">{formatTime(message.sentAt)}</span>
              {getStatusIcon()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}