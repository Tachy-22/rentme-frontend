export type UserRole = 'student' | 'agent';

export type PropertyType = 'apartment' | 'house' | 'room' | 'studio' | 'shared';

export type PropertyStatus = 'available' | 'rented' | 'pending' | 'maintenance';

export type MessageStatus = 'sent' | 'delivered' | 'read';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

export type NotificationType = 'message' | 'application' | 'property_update' | 'system';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile: StudentProfile | AgentProfile;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface StudentProfile {
  firstName: string;
  lastName: string;
  university: string;
  course: string;
  yearOfStudy: number;
  budget: {
    min: number;
    max: number;
  };
  preferredPropertyTypes: PropertyType[];
  bio: string;
  profilePicture: string;
  videoIntroduction?: string;
  phoneNumber: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
}

export interface AgentProfile {
  firstName: string;
  lastName: string;
  company: string;
  license: string;
  nin?: string;
  agentId?: string;
  bio: string;
  profilePicture: string;
  phoneNumber: string;
  officeAddress: string;
  specialties: PropertyType[];
  rating: number;
  totalReviews: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationDocuments: string[];
}

export interface Property {
  id: string;
  agentId: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: {
    amount: number;
    currency: string;
    period: 'monthly' | 'weekly' | 'yearly';
  };
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    nearbyUniversities: string[];
    distanceToUniversity: {
      [universityName: string]: {
        distance: number;
        unit: 'km' | 'miles';
        transportMethods: {
          walking: number;
          driving: number;
          publicTransport: number;
        };
      };
    };
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    area: {
      value: number;
      unit: 'sqm' | 'sqft';
    };
    furnished: boolean;
    petsAllowed: boolean;
    smokingAllowed: boolean;
    availableFrom: string;
    leaseDuration: {
      min: number;
      max: number;
      unit: 'months';
    };
  };
  amenities: string[];
  images: CloudinaryImage[];
  virtualTourUrl?: string;
  utilities: {
    included: string[];
    excluded: string[];
  };
  rules: string[];
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  saveCount: number;
  applicationCount: number;
}

export interface CloudinaryImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  caption?: string;
}

export interface Application {
  id: string;
  propertyId: string;
  studentId: string;
  agentId: string;
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  documents: ApplicationDocument[];
  personalStatement: string;
  references: Reference[];
  preferredMoveInDate: string;
  additionalNotes?: string;
  agentNotes?: string;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  url: string;
  type: 'id' | 'student_verification' | 'income_proof' | 'reference_letter' | 'other';
  uploadedAt: string;
}

export interface Reference {
  name: string;
  relationship: string;
  email: string;
  phoneNumber: string;
  organization?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  propertyId?: string;
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
  isGroup: boolean;
  groupName?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'document' | 'system';
  status: MessageStatus;
  sentAt: string;
  readAt?: string;
  attachments?: MessageAttachment[];
  replyTo?: string;
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'document' | 'video';
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface SavedProperty {
  id: string;
  userId: string;
  propertyId: string;
  savedAt: string;
  notes?: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewedId: string;
  propertyId?: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerified: boolean;
  helpful: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, string>;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface SearchFilters {
  propertyTypes: PropertyType[];
  priceRange: {
    min: number;
    max: number;
  };
  bedrooms: {
    min: number;
    max: number;
  };
  bathrooms: {
    min: number;
    max: number;
  };
  amenities: string[];
  furnished: boolean | null;
  petsAllowed: boolean | null;
  smokingAllowed: boolean | null;
  availableFrom: string | null;
  maxDistanceToUniversity: number | null;
  university: string | null;
}

export interface PropertyAnalytics {
  propertyId: string;
  views: AnalyticsMetric[];
  saves: AnalyticsMetric[];
  applications: AnalyticsMetric[];
  inquiries: AnalyticsMetric[];
  totalViews: number;
  totalSaves: number;
  totalApplications: number;
  conversionRate: number;
  averageTimeOnProperty: number;
}

export interface AnalyticsMetric {
  date: string;
  count: number;
}

export interface AgentDashboard {
  totalProperties: number;
  activeProperties: number;
  rentedProperties: number;
  pendingApplications: number;
  totalInquiries: number;
  monthlyRevenue: number;
  averageRating: number;
  responseTime: number;
  recentActivities: DashboardActivity[];
}

export interface DashboardActivity {
  id: string;
  type: 'new_inquiry' | 'new_application' | 'property_viewed' | 'review_received';
  title: string;
  description: string;
  timestamp: string;
  actionUrl?: string;
}

export interface UniversityDistance {
  universityName: string;
  distance: number;
  unit: 'km' | 'miles';
  transportMethods: {
    walking: number;
    driving: number;
    publicTransport: number;
  };
}

export interface PropertyCard {
  id: string;
  title: string;
  price: {
    amount: number;
    currency: string;
    period: string;
  };
  location: {
    address: string;
    city: string;
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    area: {
      value: number;
      unit: string;
    };
  };
  images: CloudinaryImage[];
  distanceToUniversity: string;
  isSaved: boolean;
  agent: {
    name: string;
    profilePicture: string;
    rating: number;
  };
}

export interface ChatRoom {
  id: string;
  participants: ChatParticipant[];
  lastMessage?: RealtimeMessage;
  updatedAt: number;
  propertyId?: string;
  propertyTitle?: string;
}

export interface ChatParticipant {
  id: string;
  name: string;
  profilePicture: string;
  role: UserRole;
  online: boolean;
  lastSeen: number;
}

export interface RealtimeMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'image' | 'document';
  read: boolean;
  attachments?: MessageAttachment[];
}

export interface OnlineStatus {
  userId: string;
  online: boolean;
  lastSeen: number;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  typing: boolean;
  timestamp: number;
}