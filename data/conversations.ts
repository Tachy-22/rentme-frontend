import { Conversation, Message } from '../types';

export const conversations: Conversation[] = [
  {
    id: 'conversation_1',
    participants: ['student_1', 'agent_1'],
    propertyId: 'property_1',
    lastMessage: {
      id: 'message_5',
      conversationId: 'conversation_1',
      senderId: 'agent_1',
      content: 'Thank you for your application. I will review it and get back to you within 24 hours.',
      type: 'text',
      status: 'read',
      sentAt: '2024-03-25T15:30:00Z',
      readAt: '2024-03-25T15:45:00Z'
    },
    createdAt: '2024-03-25T14:20:00Z',
    updatedAt: '2024-03-25T15:30:00Z',
    isGroup: false
  },
  {
    id: 'conversation_2',
    participants: ['student_2', 'agent_2'],
    propertyId: 'property_2',
    lastMessage: {
      id: 'message_12',
      conversationId: 'conversation_2',
      senderId: 'agent_2',
      content: 'Congratulations! Your application has been approved. Please come to our office to sign the lease agreement.',
      type: 'text',
      status: 'read',
      sentAt: '2024-03-22T16:30:00Z',
      readAt: '2024-03-22T17:15:00Z'
    },
    createdAt: '2024-03-20T09:30:00Z',
    updatedAt: '2024-03-22T16:30:00Z',
    isGroup: false
  },
  {
    id: 'conversation_3',
    participants: ['student_9', 'agent_4'],
    propertyId: 'property_4',
    lastMessage: {
      id: 'message_18',
      conversationId: 'conversation_3',
      senderId: 'student_9',
      content: 'I have submitted my application. When can I schedule a viewing?',
      type: 'text',
      status: 'delivered',
      sentAt: '2024-03-28T12:00:00Z'
    },
    createdAt: '2024-03-28T10:15:00Z',
    updatedAt: '2024-03-28T12:00:00Z',
    isGroup: false
  },
  {
    id: 'conversation_4',
    participants: ['student_6', 'agent_3'],
    propertyId: 'property_3',
    lastMessage: {
      id: 'message_25',
      conversationId: 'conversation_4',
      senderId: 'agent_3',
      content: 'Welcome to your new home! The keys are ready for pickup. Please bring your ID when you come.',
      type: 'text',
      status: 'read',
      sentAt: '2024-03-24T10:00:00Z',
      readAt: '2024-03-24T10:30:00Z'
    },
    createdAt: '2024-03-22T14:45:00Z',
    updatedAt: '2024-03-24T10:00:00Z',
    isGroup: false
  },
  {
    id: 'conversation_5',
    participants: ['student_4', 'agent_1'],
    propertyId: 'property_1',
    lastMessage: {
      id: 'message_30',
      conversationId: 'conversation_5',
      senderId: 'student_4',
      content: 'Hello, I am interested in the studio apartment. Is it still available?',
      type: 'text',
      status: 'delivered',
      sentAt: '2024-03-26T08:45:00Z'
    },
    createdAt: '2024-03-26T08:45:00Z',
    updatedAt: '2024-03-26T08:45:00Z',
    isGroup: false
  },
  {
    id: 'conversation_6',
    participants: ['student_7', 'student_10', 'student_5'],
    lastMessage: {
      id: 'message_35',
      conversationId: 'conversation_6',
      senderId: 'student_10',
      content: 'I think the 3-bedroom house would be perfect for us. Should we apply together?',
      type: 'text',
      status: 'read',
      sentAt: '2024-03-29T14:20:00Z',
      readAt: '2024-03-29T14:35:00Z'
    },
    createdAt: '2024-03-29T13:30:00Z',
    updatedAt: '2024-03-29T14:20:00Z',
    isGroup: true,
    groupName: 'House Sharing Group'
  }
];

export const messages: Message[] = [
  // Conversation 1 messages
  {
    id: 'message_1',
    conversationId: 'conversation_1',
    senderId: 'student_1',
    content: 'Hello, I am interested in the studio apartment. Can you tell me more about it?',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-25T14:20:00Z',
    readAt: '2024-03-25T14:25:00Z'
  },
  {
    id: 'message_2',
    conversationId: 'conversation_1',
    senderId: 'agent_1',
    content: 'Hello John! Thank you for your interest. The studio is 35 sqm, fully furnished with modern amenities. It\'s perfect for students with WiFi, AC, and study desk included.',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-25T14:27:00Z',
    readAt: '2024-03-25T14:30:00Z'
  },
  {
    id: 'message_3',
    conversationId: 'conversation_1',
    senderId: 'student_1',
    content: 'That sounds great! What are the lease terms and when can I view it?',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-25T14:32:00Z',
    readAt: '2024-03-25T14:35:00Z'
  },
  {
    id: 'message_4',
    conversationId: 'conversation_1',
    senderId: 'agent_1',
    content: 'The lease is flexible from 6-12 months. I can schedule a viewing for tomorrow afternoon. Are you available around 2 PM?',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-25T14:37:00Z',
    readAt: '2024-03-25T14:40:00Z'
  },
  {
    id: 'message_5',
    conversationId: 'conversation_1',
    senderId: 'agent_1',
    content: 'Thank you for your application. I will review it and get back to you within 24 hours.',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-25T15:30:00Z',
    readAt: '2024-03-25T15:45:00Z'
  },

  // Conversation 2 messages
  {
    id: 'message_6',
    conversationId: 'conversation_2',
    senderId: 'student_2',
    content: 'Hi! I\'m interested in the 2-bedroom apartment for sharing. Is it still available?',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-20T09:30:00Z',
    readAt: '2024-03-20T09:45:00Z'
  },
  {
    id: 'message_7',
    conversationId: 'conversation_2',
    senderId: 'agent_2',
    content: 'Hello Sarah! Yes, it\'s still available. The apartment has 2 bedrooms, 2 bathrooms, and is perfect for sharing. Would you like to schedule a viewing?',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-20T09:47:00Z',
    readAt: '2024-03-20T09:50:00Z'
  },
  {
    id: 'message_8',
    conversationId: 'conversation_2',
    senderId: 'student_2',
    content: 'Yes, please! I\'m looking for a female roommate. Is that something you can help with?',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-20T09:52:00Z',
    readAt: '2024-03-20T09:55:00Z'
  },
  {
    id: 'message_9',
    conversationId: 'conversation_2',
    senderId: 'agent_2',
    content: 'Absolutely! I can help you find a compatible roommate. Let\'s schedule the viewing first. Are you free this weekend?',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-20T09:57:00Z',
    readAt: '2024-03-20T10:00:00Z'
  },
  {
    id: 'message_10',
    conversationId: 'conversation_2',
    senderId: 'student_2',
    content: 'Saturday afternoon works perfect for me!',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-20T10:02:00Z',
    readAt: '2024-03-20T10:05:00Z'
  },
  {
    id: 'message_11',
    conversationId: 'conversation_2',
    senderId: 'agent_2',
    content: 'Perfect! Saturday at 3 PM it is. I\'ll send you the address details.',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-20T10:07:00Z',
    readAt: '2024-03-20T10:10:00Z'
  },
  {
    id: 'message_12',
    conversationId: 'conversation_2',
    senderId: 'agent_2',
    content: 'Congratulations! Your application has been approved. Please come to our office to sign the lease agreement.',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-22T16:30:00Z',
    readAt: '2024-03-22T17:15:00Z'
  },

  // Conversation 3 messages
  {
    id: 'message_13',
    conversationId: 'conversation_3',
    senderId: 'student_9',
    content: 'Hello, I\'m very interested in the luxury apartment near Covenant University.',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-28T10:15:00Z',
    readAt: '2024-03-28T10:20:00Z'
  },
  {
    id: 'message_14',
    conversationId: 'conversation_3',
    senderId: 'agent_4',
    content: 'Hello Emmanuel! Thank you for your interest. This is indeed our premium property with luxury amenities including pool, gym, and 24/7 security.',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-28T10:22:00Z',
    readAt: '2024-03-28T10:25:00Z'
  },
  {
    id: 'message_15',
    conversationId: 'conversation_3',
    senderId: 'student_9',
    content: 'That sounds perfect for my final year studies. I need space for architectural projects. Does it have good workspace?',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-28T10:27:00Z',
    readAt: '2024-03-28T10:30:00Z'
  },
  {
    id: 'message_16',
    conversationId: 'conversation_3',
    senderId: 'agent_4',
    content: 'Absolutely! The apartment has a dedicated study area and spacious rooms. Perfect for your architecture work. Would you like to see the virtual tour?',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-28T10:32:00Z',
    readAt: '2024-03-28T10:35:00Z'
  },
  {
    id: 'message_17',
    conversationId: 'conversation_3',
    senderId: 'student_9',
    content: 'Yes please! And I\'d like to schedule an in-person viewing as well.',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-28T10:37:00Z',
    readAt: '2024-03-28T10:40:00Z'
  },
  {
    id: 'message_18',
    conversationId: 'conversation_3',
    senderId: 'student_9',
    content: 'I have submitted my application. When can I schedule a viewing?',
    type: 'text',
    status: 'delivered',
    sentAt: '2024-03-28T12:00:00Z'
  },

  // Conversation 4 messages
  {
    id: 'message_19',
    conversationId: 'conversation_4',
    senderId: 'student_6',
    content: 'Hello, I am interested in the single room near ABU. Is it still available?',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-22T14:45:00Z',
    readAt: '2024-03-22T14:50:00Z'
  },
  {
    id: 'message_20',
    conversationId: 'conversation_4',
    senderId: 'agent_3',
    content: 'Hello Fatima! Yes, the room is available. It\'s perfect for students - quiet environment with study desk and shared facilities.',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-22T14:52:00Z',
    readAt: '2024-03-22T14:55:00Z'
  },
  {
    id: 'message_21',
    conversationId: 'conversation_4',
    senderId: 'student_6',
    content: 'Great! I\'m a Psychology student and need a quiet place for studying. Can I apply today?',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-22T14:57:00Z',
    readAt: '2024-03-22T15:00:00Z'
  },
  {
    id: 'message_22',
    conversationId: 'conversation_4',
    senderId: 'agent_3',
    content: 'Perfect! You can submit your application through the app. I\'ll need your ID and university verification.',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-22T15:02:00Z',
    readAt: '2024-03-22T15:05:00Z'
  },
  {
    id: 'message_23',
    conversationId: 'conversation_4',
    senderId: 'student_6',
    content: 'Application submitted! All documents are attached.',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-22T15:20:00Z',
    readAt: '2024-03-22T15:25:00Z'
  },
  {
    id: 'message_24',
    conversationId: 'conversation_4',
    senderId: 'agent_3',
    content: 'Excellent! Your application looks good. You\'re approved! When would you like to move in?',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-24T09:30:00Z',
    readAt: '2024-03-24T09:45:00Z'
  },
  {
    id: 'message_25',
    conversationId: 'conversation_4',
    senderId: 'agent_3',
    content: 'Welcome to your new home! The keys are ready for pickup. Please bring your ID when you come.',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-24T10:00:00Z',
    readAt: '2024-03-24T10:30:00Z'
  },

  // Conversation 5 messages
  {
    id: 'message_30',
    conversationId: 'conversation_5',
    senderId: 'student_4',
    content: 'Hello, I am interested in the studio apartment. Is it still available?',
    type: 'text',
    status: 'delivered',
    sentAt: '2024-03-26T08:45:00Z'
  },

  // Conversation 6 messages (Group chat)
  {
    id: 'message_31',
    conversationId: 'conversation_6',
    senderId: 'student_7',
    content: 'Hey guys! I found a great 3-bedroom house near OAU. Want to check it out together?',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-29T13:30:00Z',
    readAt: '2024-03-29T13:35:00Z'
  },
  {
    id: 'message_32',
    conversationId: 'conversation_6',
    senderId: 'student_10',
    content: 'Sounds interesting! What\'s the rent like?',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-29T13:37:00Z',
    readAt: '2024-03-29T13:40:00Z'
  },
  {
    id: 'message_33',
    conversationId: 'conversation_6',
    senderId: 'student_5',
    content: '750k monthly total, so about 250k each. That\'s within our budget!',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-29T13:42:00Z',
    readAt: '2024-03-29T13:45:00Z'
  },
  {
    id: 'message_34',
    conversationId: 'conversation_6',
    senderId: 'student_7',
    content: 'Exactly! Plus it has parking, garden, and all the amenities we need.',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-29T14:10:00Z',
    readAt: '2024-03-29T14:15:00Z'
  },
  {
    id: 'message_35',
    conversationId: 'conversation_6',
    senderId: 'student_10',
    content: 'I think the 3-bedroom house would be perfect for us. Should we apply together?',
    type: 'text',
    status: 'read',
    sentAt: '2024-03-29T14:20:00Z',
    readAt: '2024-03-29T14:35:00Z'
  }
];