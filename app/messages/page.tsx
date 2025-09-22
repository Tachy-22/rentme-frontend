'use client';

import { useState, useMemo } from 'react';
import { getConversationsByUser, getUserById, getStudents, getPropertyById } from '../../data';
import { BottomNavigation } from '../../components/BottomNavigation';
import { Header } from '../../components/Header';
import { ConversationCard } from '../../components/ConversationCard';

export default function MessagesPage() {
  const currentUser = getStudents()[3];
  const allConversations = getConversationsByUser(currentUser.id);
  const [activeFilter, setActiveFilter] = useState('all');

  const conversations = useMemo(() => {
    if (activeFilter === 'all') return allConversations;
    if (activeFilter === 'unread') {
      return allConversations.filter(conv =>
        conv.lastMessage && conv.lastMessage.status !== 'read' && conv.lastMessage.senderId !== currentUser.id
      );
    }
    if (activeFilter === 'agents') {
      return allConversations.filter(conv => {
        const otherParticipantId = conv.participants.find(id => id !== currentUser.id);
        const otherParticipant = getUserById(otherParticipantId || '');
        return otherParticipant?.role === 'agent';
      });
    }
    if (activeFilter === 'groups') {
      return allConversations.filter(conv => conv.isGroup);
    }
    return allConversations;
  }, [allConversations, activeFilter]);

  return (
    <div className="min-h-screen bg-gray-50 md:pt-[2rem]">
      {/* Mobile Header */}
      <div className="md:hidden">
        <Header user={currentUser} />
      </div>

      <main className="pb-20 md:pb-0 md:pt-16">
        <div className="md:max-w-7xl md:mx-auto md:px-4 lg:px-6">
          {/* Page Header */}
          <div className="bg-white border-b border-gray-200 md:rounded-lg md:mb-6 md:border md:shadow-sm">
            <div className="px-4 py-6 md:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Messages</h1>
                  <p className="text-gray-600 md:text-lg">
                    {conversations.length} active {conversations.length === 1 ? 'conversation' : 'conversations'}
                  </p>
                </div>
                <button className="p-2 md:p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Layout: Search and Filters Side by Side */}
          <div className="md:flex md:gap-6 md:mb-6">
            {/* Search Messages */}
            <div className="px-4 py-4 bg-white border-b border-gray-200 md:flex-1 md:rounded-lg md:border md:shadow-sm md:px-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="block w-full pl-10 pr-3 py-2.5 md:py-3 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Message Filter Tabs */}
            <div className="px-4 py-3 bg-white border-b border-gray-200 md:rounded-lg md:border md:shadow-sm md:px-6 md:py-4">
              <div className="flex space-x-1 md:space-x-2">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'unread', label: 'Unread' },
                  { id: 'agents', label: 'Agents' },
                  { id: 'groups', label: 'Groups' }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 md:px-5 md:py-2.5 rounded-lg text-sm font-medium transition-colors ${activeFilter === filter.id
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Empty State */}
          {conversations.length === 0 ? (
            <div className="px-4 py-12 md:px-0">
              <div className="text-center bg-white rounded-lg p-8 md:p-12 border border-gray-200 shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">No conversations yet</h3>
                <p className="text-gray-600 mb-6 md:text-lg">
                  Start exploring properties and connect with agents to begin conversations.
                </p>
                <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors">
                  Browse Properties
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Conversations List */}
              <div className="bg-white md:rounded-lg md:border md:shadow-sm overflow-hidden">
                {conversations.map((conversation) => (
                  <ConversationCard
                    key={conversation.id}
                    conversation={conversation}
                    currentUserId={currentUser.id}
                  />
                ))}
              </div>

              {/* Quick Actions */}
              <div className="px-4 py-6 md:px-0 md:mt-6">
                <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 md:text-lg">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button className="flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Find Roommates</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Contact Agent Directly</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <BottomNavigation currentRoute="messages" />
    </div>
  );
}