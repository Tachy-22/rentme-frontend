import { User, UserRole, RenterProfile, AgentProfile, AdminProfile } from '@/types';

export interface AccessRules {
  canMessageAgents: boolean;
  messageLimit?: number;
  canViewAgentContact: boolean;
  canAppearInMatching: boolean;
  canSaveProperties: boolean;
  hasSearchPriority: boolean;
  canAddProperties: boolean;
  propertyLimit?: number;
  hasListingPriority: boolean;
  canViewMatchedRenters: boolean;
  canUnlockRenterContact: boolean;
}

export function getUserAccessRules(user: User | null): AccessRules {
  if (!user) {
    return {
      canMessageAgents: false,
      canViewAgentContact: false,
      canAppearInMatching: false,
      canSaveProperties: false,
      hasSearchPriority: false,
      canAddProperties: false,
      hasListingPriority: false,
      canViewMatchedRenters: false,
      canUnlockRenterContact: false,
    };
  }

  // Check verification status from profile.verificationStatus
  const profile = user.profile as RenterProfile | AgentProfile | AdminProfile;
  const isVerified = profile?.verificationStatus === 'verified';

  if (user.role === 'renter') {
    return {
      canMessageAgents: true,
      messageLimit: isVerified ? undefined : 3, // 3 messages per week for unverified
      canViewAgentContact: isVerified,
      canAppearInMatching: isVerified,
      canSaveProperties: true,
      hasSearchPriority: isVerified,
      canAddProperties: false,
      hasListingPriority: false,
      canViewMatchedRenters: false,
      canUnlockRenterContact: false,
    };
  }

  if (user.role === 'agent') {
    return {
      canMessageAgents: true,
      canViewAgentContact: true,
      canAppearInMatching: true,
      canSaveProperties: true,
      hasSearchPriority: true,
      canAddProperties: true,
      propertyLimit: isVerified ? undefined : 3, // Up to 3 for unverified
      hasListingPriority: isVerified,
      canViewMatchedRenters: isVerified,
      canUnlockRenterContact: isVerified,
    };
  }

  // Admin has full access
  return {
    canMessageAgents: true,
    canViewAgentContact: true,
    canAppearInMatching: true,
    canSaveProperties: true,
    hasSearchPriority: true,
    canAddProperties: true,
    hasListingPriority: true,
    canViewMatchedRenters: true,
    canUnlockRenterContact: true,
  };
}

export function getVerificationStatus(user: User | null): {
  status: 'unverified' | 'pending' | 'verified' | 'rejected';
  color: string;
  bgColor: string;
  icon: string;
} {
  if (!user) {
    return {
      status: 'unverified',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      icon: '⚫'
    };
  }

  // Check verification status from profile.verificationStatus
  const profile = user.profile as RenterProfile | AgentProfile | AdminProfile;
  const verificationStatus = profile?.verificationStatus || 'unverified';

  // Use verification documents status
  if (verificationStatus === 'verified') {
    return {
      status: 'verified',
      color: 'text-blue-800',
      bgColor: 'bg-blue-100',
      icon: '🔵'
    };
  }

  if (verificationStatus === 'pending') {
    return {
      status: 'pending',
      color: 'text-yellow-800',
      bgColor: 'bg-yellow-100',
      icon: '🟡'
    };
  }

  if (verificationStatus === 'rejected') {
    return {
      status: 'rejected',
      color: 'text-red-800',
      bgColor: 'bg-red-100',
      icon: '🔴'
    };
  }

  return {
    status: 'unverified',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: '⚫'
  };
}

export function checkMessageLimit(user: User | null, currentMessageCount: number): {
  canSend: boolean;
  remaining?: number;
  message?: string;
} {
  const rules = getUserAccessRules(user);
  
  if (!rules.canMessageAgents) {
    return {
      canSend: false,
      message: 'You need to be logged in to send messages'
    };
  }

  if (!rules.messageLimit) {
    return { canSend: true };
  }

  const remaining = rules.messageLimit - currentMessageCount;
  
  if (remaining <= 0) {
    return {
      canSend: false,
      remaining: 0,
      message: `You've reached your weekly message limit of ${rules.messageLimit}. Get verified for unlimited messaging.`
    };
  }

  return {
    canSend: true,
    remaining,
    message: `${remaining} messages remaining this week. Get verified for unlimited messaging.`
  };
}

export function checkPropertyLimit(user: User | null, currentPropertyCount: number): {
  canAdd: boolean;
  remaining?: number;
  message?: string;
} {
  const rules = getUserAccessRules(user);
  
  if (!rules.canAddProperties) {
    return {
      canAdd: false,
      message: 'You are not authorized to add properties'
    };
  }

  if (!rules.propertyLimit) {
    return { canAdd: true };
  }

  const remaining = rules.propertyLimit - currentPropertyCount;
  
  if (remaining <= 0) {
    return {
      canAdd: false,
      remaining: 0,
      message: `You've reached your property limit of ${rules.propertyLimit}. Get verified for unlimited listings.`
    };
  }

  return {
    canAdd: true,
    remaining,
    message: `${remaining} properties remaining. Get verified for unlimited listings.`
  };
}