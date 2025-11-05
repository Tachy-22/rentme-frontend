export type UserRole = 'renter' | 'agent' | 'admin' | 'super_admin';

export type PropertyType = 'apartment' | 'house' | 'room' | 'studio' | 'shared' | 'shared_room' | 'lodge';

export type PropertyStatus = 'available' | 'rented' | 'pending' | 'maintenance';

export type MessageStatus = 'sent' | 'delivered' | 'read';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

export type NotificationType = 'message' | 'application' | 'property_update' | 'system';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile: RenterProfile | AgentProfile | AdminProfile;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: string;
  identityVerified?: boolean
}

export interface RenterProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  phone: string;
  occupation: string;
  employer?: string;
  monthlyIncome: number;
  preferredBudget: {
    min: number;
    max: number;
  };
  preferredPropertyTypes: PropertyType[];
  preferredLocations: string[];
  bio: string;
  profilePicture: string;
  identityVerified: boolean;
  incomeVerified: boolean;
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
    email: string;
  };
  preferences: {
    petsAllowed: boolean;
    smokingAllowed: boolean;
    furnished: boolean;
    maxCommute: number; // in minutes
  };
  savedSearches: string[];
  viewedProperties: string[];
  address?: string;
  city?: string;
  state?: string;
  university?: string;
  studentId?: string;
  preferredContactMethod?: string;
}

export interface AgentProfile {
  firstName: string;
  lastName: string;
  company: string;
  position: string;
  licenseNumber: string;
  nin?: string;
  agentId?: string;
  bio: string;
  profilePicture: string;
  phoneNumber: string;
  phone: string;
  officeAddress: string;
  website?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  specialties: PropertyType[];
  serviceAreas: string[];
  languages: string[];
  rating: number;
  totalReviews: number;
  totalProperties: number;
  totalDeals: number;
  identityVerified: boolean;
  responseTime: number; // in hours
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationDocuments: string[];
  commissionRate: number;
  availabilitySchedule: {
    [key: string]: {
      available: boolean;
      startTime?: string;
      endTime?: string;
    };
  };
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  preferredContactMethod?: string;
  university?: string;
  studentId?: string;
}

export interface AdminProfile {
  firstName: string;
  lastName: string;
  profilePicture: string;
  phoneNumber: string;
  phone: string;
  department: string;
  permissions: string[];
  employeeId: string;
  identityVerified: boolean;
  bio?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  university?: string;
  studentId?: string;
  preferredContactMethod?: string;

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
  savedAt?: any; // For saved properties
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
  renterId: string;
  agentId: string;
  status: ApplicationStatus;
  submittedAt: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    socialSecurityNumber?: string;
  };
  employmentInfo: {
    employmentStatus: 'employed' | 'self_employed' | 'student' | 'unemployed' | 'retired';
    employer?: string;
    jobTitle?: string;
    monthlyIncome: number;
    employmentLength?: string;
  };
  rentalHistory: {
    currentAddress: string;
    landlordName?: string;
    landlordPhone?: string;
    monthlyRent?: number;
    reasonForMoving: string;
  };
  references: {
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
    personalReferenceName?: string;
    personalReferencePhone?: string;
  };
  additionalInfo: {
    hasPets: boolean;
    petDescription?: string;
    smokingPreference: 'non_smoker' | 'smoker' | 'occasional';
    moveInDate: string;
    leaseDuration: '6_months' | '12_months' | '18_months' | '24_months' | 'month_to_month';
    additionalComments?: string;
  };
  documents: {
    idDocument: boolean;
    incomeProof: boolean;
    bankStatements: boolean;
    references: boolean;
    uploadedFiles?: Record<string, string[]>;
  };
  agreements: {
    backgroundCheck: boolean;
    creditCheck: boolean;
    termsAndConditions: boolean;
  };
  reviewedAt: string | null;
  reviewedBy: string | null;
  notes: string | null;
  property?: {
    id: string;
    title: string;
    location: {
      city: string;
      state: string;
    };
    price: {
      amount: number;
      currency: string;
      period: string;
    };
    images: any[];
    agent?: any;
  };
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
  location?: {
    address: string;
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
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

export interface ApplicationFormData {
  propertyId: string;
  renterId: string;
  agentId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    socialSecurityNumber?: string;
  };
  employmentInfo: {
    employmentStatus: 'employed' | 'self_employed' | 'student' | 'unemployed' | 'retired';
    employer?: string;
    jobTitle?: string;
    monthlyIncome: number;
    employmentLength?: string;
  };
  rentalHistory: {
    currentAddress: string;
    landlordName?: string;
    landlordPhone?: string;
    monthlyRent?: number;
    reasonForMoving: string;
  };
  references: {
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
    personalReferenceName?: string;
    personalReferencePhone?: string;
  };
  additionalInfo: {
    hasPets: boolean;
    petDescription?: string;
    smokingPreference: 'non_smoker' | 'smoker' | 'occasional';
    moveInDate: string;
    leaseDuration: '6_months' | '12_months' | '18_months' | '24_months' | 'month_to_month';
    additionalComments?: string;
  };
  documents: {
    idDocument: boolean;
    incomeProof: boolean;
    bankStatements: boolean;
    references: boolean;
  };
  agreements: {
    backgroundCheck: boolean;
    creditCheck: boolean;
    termsAndConditions: boolean;
  };
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
    id?: string;
    name: string;
    profilePicture: string;
    rating: number;
  };
  agentId?: string;
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