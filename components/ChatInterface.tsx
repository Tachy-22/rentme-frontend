'use client';

import { Conversation, Message, User, Property } from '../types';
import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';

interface ChatInterfaceProps {
  conversation: Conversation;
  messages: Message[];
  currentUser: User;
  otherParticipants: User[];
  property: Property | null;
}

export function ChatInterface({ 
  conversation, 
  messages, 
  currentUser, 
  otherParticipants,
  property 
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const [localMessages, setLocalMessages] = useState(messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Create new message object
    const messageId = `message_${Date.now()}`;
    const newMsg: Message = {
      id: messageId,
      conversationId: conversation.id,
      senderId: currentUser.id,
      content: newMessage,
      type: 'text',
      status: 'sent',
      sentAt: new Date().toISOString(),
    };

    // Add to local messages
    setLocalMessages(prev => [...prev, newMsg]);
    setNewMessage('');

    // In a real app, this would send to Firebase/backend
    console.log('Sending message:', newMsg);

    // Simulate message being delivered after a short delay
    setTimeout(() => {
      setLocalMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, status: 'delivered' as const }
            : msg
        )
      );
    }, 1000);
  };

  // Group messages by date
  const groupedMessages = localMessages.reduce((groups: { [date: string]: Message[] }, message) => {
    const date = new Date(message.sentAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="flex  flex-1 flex-col h-full border ">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 relative min-h-0 flex flex-col">
        <div className="flex-1 space-y-4">
          {Object.entries(groupedMessages).map(([date, dayMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex justify-center my-4">
                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>

              {/* Messages for this date */}
              <div className="space-y-3">
                {dayMessages.map((message, index) => {
                  const isLastInGroup = index === dayMessages.length - 1 || 
                    dayMessages[index + 1]?.senderId !== message.senderId;
                  
                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isFromCurrentUser={message.senderId === currentUser.id}
                      isLastInGroup={isLastInGroup}
                      senderName={
                        message.senderId === currentUser.id 
                          ? 'You'
                          : otherParticipants.find(p => p.id === message.senderId)?.profile.firstName || 'Unknown'
                      }
                      showAvatar={conversation.isGroup && !isLastInGroup}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {/* Empty State */}
          {localMessages.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start the conversation</h3>
                <p className="text-gray-600 text-sm">
                  {property 
                    ? `Ask about ${property.title} or introduce yourself!`
                    : 'Send a message to get started.'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={handleSendMessage}
        placeholder={`Message ${otherParticipants[0]?.profile.firstName || 'here'}...`}
      />
    </div>
  );
}