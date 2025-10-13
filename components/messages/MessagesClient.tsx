'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, Send, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import { rtdb } from '@/lib/firebase';
import { ref, onValue, off } from 'firebase/database';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface MessagesClientProps {
  user: User;
  conversations?: Array<{
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
  }>;
  initialConversationId?: string | null;
}

// Conversations will be loaded from server-side props
// No dummy data - real conversations from database only

export function MessagesClient({ user, conversations = [], initialConversationId = null }: MessagesClientProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(initialConversationId);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.property.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Set up real-time message listener when conversation is selected
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    console.log('Setting up real-time listener for conversation:', selectedConversation);
    setLoadingMessages(true);

    // Listen to messages in real-time
    const messagesRef = ref(rtdb, 'messages');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      console.log('Real-time update received');
      if (snapshot.exists()) {
        const allMessages = snapshot.val();
        // Filter messages for this conversation
        const conversationMessages = Object.keys(allMessages)
          .map(key => ({
            id: key,
            ...allMessages[key]
          }))
          .filter(message => message.conversationId === selectedConversation)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        console.log('Filtered messages for conversation:', conversationMessages.length);
        setMessages(conversationMessages);
      } else {
        setMessages([]);
      }
      setLoadingMessages(false);
    });

    // Cleanup listener on unmount or conversation change
    return () => {
      console.log('Cleaning up real-time listener');
      off(messagesRef, 'value', unsubscribe);
    };
  }, [selectedConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversation) {
      console.log('Sending message:', {
        conversationId: selectedConversation,
        senderId: user.id,
        content: newMessage.trim()
      });

      try {
        const { sendMessage } = await import('@/actions/messages/sendMessage');
        const result = await sendMessage({
          conversationId: selectedConversation,
          senderId: user.id,
          content: newMessage.trim()
        });

        console.log('Send message result:', result);

        if (result.success) {
          setNewMessage('');
          // No need to reload - real-time listener will pick up the new message
        } else {
          console.error('Failed to send message:', result.error);
          alert('Failed to send message: ' + result.error);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Error sending message: ' + error);
      }
    }
  };
  //flex-1
  return (
    <DashboardLayout user={user}>
      <div className="space-y-6" >
        {/* <div className="hidden lg:block">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Communicate with agents and manage your conversations.
          </p>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" >
          {/* Conversations List - Hidden on mobile when conversation is selected */}
          <div className={`lg:col-span-1 h-full ${selectedConversation ? 'hidden lg:block' : 'block'}`}>
            <Card className="h-full" style={{ maxHeight: 'calc(100vh - 5rem)', height: 'calc(100vh - 5rem)' }}>
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle>Conversations</CardTitle>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                  {filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                      <p>No conversations found</p>
                    </div>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-4 cursor-pointer hover:bg-muted transition-colors border-b ${selectedConversation === conversation.id ? 'bg-muted' : ''
                          }`}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={conversation.participant.avatar} />
                            <AvatarFallback>
                              {conversation.participant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate">
                                {conversation.participant.name}
                              </p>
                              <div className="flex items-center space-x-1">
                                {conversation.lastMessage.unread && (
                                  <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {conversation.lastMessage.timestamp}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground capitalize mb-1">
                              {conversation.participant.role}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage.content}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Re: {conversation.property.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area - Hidden on mobile when no conversation is selected */}
          <div className={`lg:col-span-2 h-full ${selectedConversation ? 'block' : 'hidden lg:block'}`}>
            <Card className="h-full flex flex-col h-calc(100vh - 5rem) max-h-calc(100vh - 5rem)" style={{ maxHeight: 'calc(100vh - 5rem)', height: 'calc(100vh - 5rem)' }}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b flex-shrink-0 p-3 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 lg:space-x-3 min-w-0 flex-1">
                        {/* Back button for mobile */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="lg:hidden flex-shrink-0"
                          onClick={() => setSelectedConversation(null)}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Avatar className="h-8 w-8 lg:h-10 lg:w-10 flex-shrink-0">
                          <AvatarImage src={filteredConversations.find(c => c.id === selectedConversation)?.participant.avatar} />
                          <AvatarFallback>
                            {filteredConversations.find(c => c.id === selectedConversation)?.participant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm lg:text-base truncate">
                            {filteredConversations.find(c => c.id === selectedConversation)?.participant.name}
                          </h3>
                          <p className="text-xs lg:text-sm text-muted-foreground truncate">
                            {filteredConversations.find(c => c.id === selectedConversation)?.participant.lastSeen}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 lg:space-x-2 flex-shrink-0">
                        <Button size="sm" variant="outline" className="hidden sm:flex">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="hidden sm:flex">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-2 mt-2 lg:mt-3">
                      <p className="text-xs lg:text-sm font-medium truncate">
                        {filteredConversations.find(c => c.id === selectedConversation)?.property.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {filteredConversations.find(c => c.id === selectedConversation)?.property.address}
                      </p>
                    </div>
                  </CardHeader>

                  {/* Messages Area */}
                  <CardContent className="flex-1 p-0 overflow-hidden">
                    <div className="h-full overflow-y-auto p-4">
                      <div className="space-y-4">
                        {loadingMessages ? (
                          <div className="flex items-center justify-center py-12">
                            <div className="text-center text-muted-foreground">
                              <MessageSquare className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                              <p>Loading messages...</p>
                            </div>
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="flex items-center justify-center py-12">
                            <div className="text-center text-muted-foreground">
                              <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                              <p>No messages yet</p>
                              <p className="text-xs mt-1">Start the conversation below</p>
                            </div>
                          </div>
                        ) : (
                          messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg px-4 py-2 ${message.senderId === user.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                                  }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {new Date(message.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                        {/* Auto-scroll anchor */}
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                  </CardContent>

                  {/* Message Input */}
                  <div className="border-t p-4 flex-shrink-0">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <CardContent className="flex-1 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a Conversation</h3>
                    <p>Choose a conversation from the list to start messaging.</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}