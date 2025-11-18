'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Send,
  Search,
  MessageCircle,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Paperclip,
  Image as ImageIcon,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { getUserAccessRules, getVerificationStatus } from '@/lib/access-control';
import { createConversation } from '@/actions/messages/createConversation';
import { useFirestoreRealTimeMessages } from '@/hooks/useFirestoreRealTimeMessages';
import { useRealTimeConversations } from '@/hooks/useRealTimeConversations';
import { toast } from 'sonner';
import { useSearchParams, useRouter } from 'next/navigation';

interface Conversation {
  id: string;
  participants: string[];
  propertyId?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  otherParticipant: {
    id: string;
    name: string;
    profilePicture?: string;
    role: string;
    verificationStatus: string;
    isOnline: boolean;
  };
  property?: {
    id: string;
    title: string;
    price: { amount: number; currency: string };
    images: Array<{ url: string }>;
  };
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  attachmentUrl?: string;
  sentAt: string;
  isRead: boolean;
  isOwn: boolean;
  sender: {
    id: string;
    name: string;
    profilePicture?: string;
    role: string;
    verificationStatus: string;
  };
}

interface MessagesPageProps {
  initialConversations?: Conversation[];
  agentId?: string;
  propertyId?: string;
}

export default function MessagesPage({
  initialConversations = [],
  agentId,
  propertyId
}: MessagesPageProps) {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConversations, setShowConversations] = useState(true); // For mobile view toggle

  // Use real-time hooks
  const { conversations, loadConversations } = useRealTimeConversations({
    userId: user?.id || '',
    initialConversations
  });

  const { messages, isLoading, isSending, sendMessage: sendRealTimeMessage } = useFirestoreRealTimeMessages({
    conversationId: selectedConversation,
    userId: user?.id || ''
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const accessRules = getUserAccessRules(user);


  useEffect(() => {
    // Handle URL parameters for direct messaging
    const agent = searchParams.get('agent');
    const property = searchParams.get('property');

    if (agent && property && user) {
      handleDirectMessage(agent, property);
    }
  }, [searchParams, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };



  const handleDirectMessage = async (agentId: string, propertyId: string) => {
    try {
      const result = await createConversation({
        participantId: agentId,
        propertyId
      });

      if (result.success && result.conversationId) {
        setSelectedConversation(result.conversationId as string);
        loadConversations();
        // Clear URL parameters
        router.replace('/messages', { scroll: false });
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to start conversation');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    // Check access rules
    if (!accessRules.canMessageAgents) {
      toast.error('You are not authorized to send messages');
      return;
    }

    if (accessRules.messageLimit !== undefined) {
      toast.error(`Message limit reached. Unverified ${user.role}s can send up to ${accessRules.messageLimit} messages per week.`);
      return;
    }

    const success = await sendRealTimeMessage(newMessage.trim());
    if (success) {
      setNewMessage('');
      // Reload conversations to update last message
      loadConversations();
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-3 h-3 text-green-600" />;
      case 'pending':
        return <Clock className="w-3 h-3 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-3 h-3 text-red-600" />;
      default:
        return <AlertCircle className="w-3 h-3 text-gray-600" />;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherParticipant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.property?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  // Handle selecting a conversation on mobile
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    setShowConversations(false); // Hide conversations list on mobile
  };

  // Handle back to conversations on mobile
  const handleBackToConversations = () => {
    setSelectedConversation(null);
    setShowConversations(true);
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/properties';
    }
  };

  return (
    <div className="h-full max-h-screen bg-background w-full">
      <div className="flex h-full w-full ">
        {/* Conversations List */}
        <div className={`${showConversations ? 'flex' : 'hidden'} md:flex w-full md:w-80 h-full border-r bg-card flex-col`}>
          <div className="p-3 md:p-4 border-b">
            <div className="flex items-center gap-3 mb-3 md:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleGoBack}
                className="p-2 h-8 w-8 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-semibold">Messages</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <ScrollArea className="h-[calc(100%-120px)]">
            <div className="p-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-sm">Start messaging agents about properties</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={cn(
                      "p-4 md:p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors mb-1 active:bg-muted/80 touch-manipulation",
                      selectedConversation === conversation.id && "bg-muted"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.otherParticipant?.profilePicture} />
                          <AvatarFallback>
                            {conversation.otherParticipant?.name?.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.otherParticipant?.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm truncate">
                            {conversation.otherParticipant?.name}
                          </span>
                          {getVerificationIcon(conversation.otherParticipant?.verificationStatus)}
                          <Badge variant="secondary" className="text-xs capitalize">
                            {conversation.otherParticipant?.role}
                          </Badge>
                        </div>

                        {conversation.property && (
                          <div className="text-xs text-muted-foreground mb-1 truncate">
                            📍 {conversation.property.title}
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.lastMessage || 'No messages yet'}
                        </p>

                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">
                            {conversation.lastMessageAt &&
                              new Date(conversation.lastMessageAt).toLocaleDateString()
                            }
                          </span>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs h-5 w-5 p-0 flex items-center justify-center">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={`${!showConversations ? 'flex' : 'hidden'} md:flex flex-1 h-full flex-col w-full`}>
          {selectedConversation && selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-3 md:p-4 border-b bg-card">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="md:hidden p-2 h-8 w-8" 
                    onClick={handleBackToConversations}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div className="relative">
                    <Avatar className="h-8 w-8 md:h-10 md:w-10">
                      <AvatarImage src={selectedConv.otherParticipant?.profilePicture} />
                      <AvatarFallback>
                        {selectedConv.otherParticipant?.name?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {selectedConv.otherParticipant?.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base md:text-lg truncate">{selectedConv.otherParticipant?.name}</h3>
                      <div className="hidden sm:flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        <Badge
                          className={cn(
                            "text-xs",
                            getVerificationStatus(selectedConv.otherParticipant as any).bgColor,
                            getVerificationStatus(selectedConv.otherParticipant as any).color
                          )}
                        >
                          {getVerificationStatus(selectedConv.otherParticipant as any).status}
                        </Badge>
                      </div>
                    </div>

                    {selectedConv.property && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs md:text-sm text-muted-foreground truncate">About: {selectedConv.property.title}</span>
                        <span className="text-xs md:text-sm font-medium whitespace-nowrap">
                          ₦{selectedConv.property.price.amount.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs md:text-sm text-muted-foreground">
                    {selectedConv.otherParticipant?.isOnline ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-3 md:p-4 max-h-[calc(100vh-16rem)] md:max-h-[70vh]" >
                <div className="space-y-3 md:space-y-4">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-muted-foreground mt-2">Loading messages...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No messages yet</p>
                      <p className="text-sm">Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3",
                          message.isOwn ? "justify-end" : "justify-start"
                        )}
                      >
                        {!message.isOwn && (
                          <Avatar className="hidden md:flex h-8 w-8">
                            <AvatarImage src={message.sender?.profilePicture} />
                            <AvatarFallback className="text-xs">
                              {message.sender?.name?.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div className={cn(
                          "max-w-xs lg:max-w-md",
                          message.isOwn ? "order-1" : "order-2"
                        )}>
                          <div className={cn(
                            "px-3 py-2 rounded-2xl max-w-[85%] md:max-w-xs",
                            message.isOwn
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(message.sentAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>

                        {message.isOwn && (
                          <Avatar className="hidden md:flex h-8 w-8">
                            <AvatarImage src={message.sender?.profilePicture} />
                            <AvatarFallback className="text-xs">
                              {message.sender?.name?.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-3 md:p-4 border-t bg-card">
                {accessRules.messageLimit !== undefined && (
                  <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Unverified {user?.role}s can send up to {accessRules.messageLimit} messages per week.
                      <Button variant="link" className="p-0 h-auto ml-1 text-yellow-800" asChild>
                        <a href="/verification">Get verified</a>
                      </Button> for unlimited messaging.
                    </p>
                  </div>
                )}

                <div className="flex items-end gap-2 md:gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={isSending || !accessRules.canMessageAgents}
                      className="h-10 md:h-9 text-base md:text-sm"
                    />
                  </div>

                  <Button size="sm" variant="outline" disabled className="h-10 w-10 md:h-9 md:w-auto md:px-3">
                    <Paperclip className="w-4 h-4" />
                  </Button>

                  <Button size="sm" variant="outline" disabled className="h-10 w-10 md:h-9 md:w-auto md:px-3">
                    <ImageIcon className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSending || !accessRules.canMessageAgents}
                    className="h-10 w-10 md:h-9 md:w-auto md:px-3"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground p-6">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-sm md:text-base">Choose a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}