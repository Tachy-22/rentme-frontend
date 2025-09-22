// Import all dummy data collections
import { users } from './users';
import { properties } from './properties';
import { applications } from './applications';
import { conversations, messages } from './conversations';
import { savedProperties } from './saved-properties';

// Export all dummy data collections
export { users, properties, applications, conversations, messages, savedProperties };

// Helper functions to get data by ID or filter
export const getUserById = (id: string) => {
  return users.find(user => user.id === id);
};

export const getPropertyById = (id: string) => {
  return properties.find(property => property.id === id);
};

export const getPropertiesByAgent = (agentId: string) => {
  return properties.filter(property => property.agentId === agentId);
};

export const getApplicationsByStudent = (studentId: string) => {
  return applications.filter(application => application.studentId === studentId);
};

export const getApplicationsByAgent = (agentId: string) => {
  return applications.filter(application => application.agentId === agentId);
};

export const getApplicationsByProperty = (propertyId: string) => {
  return applications.filter(application => application.propertyId === propertyId);
};

export const getConversationsByUser = (userId: string) => {
  return conversations.filter(conversation => 
    conversation.participants.includes(userId)
  );
};

export const getMessagesByConversation = (conversationId: string) => {
  return messages.filter(message => message.conversationId === conversationId);
};

export const getSavedPropertiesByUser = (userId: string) => {
  return savedProperties.filter(saved => saved.userId === userId);
};

export const getStudents = () => {
  return users.filter(user => user.role === 'student');
};

export const getAgents = () => {
  return users.filter(user => user.role === 'agent');
};

export const getAvailableProperties = () => {
  return properties.filter(property => property.status === 'available');
};

export const getPropertiesByUniversity = (university: string) => {
  return properties.filter(property => 
    property.location.nearbyUniversities.includes(university)
  );
};

