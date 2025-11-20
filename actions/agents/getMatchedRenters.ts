'use server';

import { cookies } from 'next/headers';
import { queryDocuments, getDocument } from '@/actions/firebase';

interface MatchedRenter {
  id: string;
  name: string;
  email: string;
  university: string;
  budget: {
    min: number;
    max: number;
  };
  preferredLocation: string;
  accommodationType: string[];
  verificationStatus: string;
  profilePicture?: string;
  matchScore: number;
  lastActive: string;
  contact?: {
    phone?: string;
    email: string;
  };
}

export async function getMatchedRenters() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;
    const userRole = cookieStore.get('user-role')?.value;

    if (!userId || userRole !== 'agent') {
      return {
        success: false,
        error: 'Unauthorized access'
      };
    }

    // Get agent's verification status and properties
    const agentResult = await getDocument({
      collectionName: 'users',
      documentId: userId
    });

    if (!agentResult.success || !agentResult.data) {
      return {
        success: false,
        error: 'Agent not found'
      };
    }

    const agent = agentResult.data as Record<string, unknown>;
    const isVerified = agent.profile?.verificationStatus === 'verified';

    // Only verified agents can access matched renters
    if (!isVerified) {
      return {
        success: false,
        error: 'VERIFICATION_REQUIRED',
        message: 'Get verified to access matched renters'
      };
    }

    // Get agent's properties to understand their typical offerings
    const propertiesResult = await queryDocuments({
      collectionName: 'properties',
      filters: [
        { field: 'agentId', operator: '==', value: userId },
        { field: 'status', operator: '==', value: 'available' }
      ]
    });

    const agentProperties = propertiesResult.success ? (propertiesResult.data || []) : [];

    // Calculate agent's typical price range and locations
    const agentPriceRange = calculateAgentPriceRange(agentProperties);
    const agentLocations = extractAgentLocations(agentProperties);
    const agentPropertyTypes = extractPropertyTypes(agentProperties);

    // Get verified renters
    const rentersResult = await queryDocuments({
      collectionName: 'users',
      filters: [
        { field: 'role', operator: '==', value: 'renter' },
        { field: 'profile.verificationStatus', operator: '==', value: 'verified' }
      ],
      limitCount: 50
    });

    const renters = rentersResult.success ? (rentersResult.data || []) : [];

    // Calculate match scores and filter
    const matchedRenters: MatchedRenter[] = renters
      .map((renter: Record<string, unknown>) => {
        const matchScore = calculateMatchScore(renter, {
          priceRange: agentPriceRange,
          locations: agentLocations,
          propertyTypes: agentPropertyTypes
        });

        return {
          id: renter.id,
          name: `${renter.profile?.firstName || ''} ${renter.profile?.lastName || ''}`.trim(),
          email: renter.email,
          university: renter.profile?.university || 'Not specified',
          budget: {
            min: renter.profile?.budgetMin || 0,
            max: renter.profile?.budgetMax || 0
          },
          preferredLocation: renter.profile?.preferredLocation || 'Any',
          accommodationType: renter.profile?.accommodationType || [],
          verificationStatus: renter.profile?.verificationStatus || 'unverified',
          profilePicture: renter.profile?.profilePicture,
          matchScore,
          lastActive: renter.profile?.lastActive || renter.createdAt,
          contact: {
            phone: renter.profile?.phone,
            email: renter.email
          }
        };
      })
      .filter((renter: MatchedRenter) => renter.matchScore > 30) // Only show renters with >30% match
      .sort((a: MatchedRenter, b: MatchedRenter) => b.matchScore - a.matchScore) // Sort by match score
      .slice(0, 20); // Limit to top 20 matches

    return {
      success: true,
      data: matchedRenters
    };

  } catch (error) {
    console.error('Error getting matched renters:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get matched renters'
    };
  }
}

function calculateAgentPriceRange(properties: Record<string, unknown>[]) {
  if (properties.length === 0) return { min: 0, max: 1000000 };

  const prices = properties.map(p => p.price?.amount || 0).filter(p => p > 0);
  if (prices.length === 0) return { min: 0, max: 1000000 };

  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}

function extractAgentLocations(properties: Record<string, unknown>[]) {
  const locations = new Set<string>();
  properties.forEach(p => {
    if (p.location?.city) locations.add(p.location.city.toLowerCase());
    if (p.location?.area) locations.add(p.location.area.toLowerCase());
  });
  return Array.from(locations);
}

function extractPropertyTypes(properties: Record<string, unknown>[]) {
  const types = new Set<string>();
  properties.forEach(p => {
    if (p.propertyType) types.add(p.propertyType.toLowerCase());
  });
  return Array.from(types);
}

function calculateMatchScore(renter: Record<string, unknown>, agentCriteria: { priceRange: { min: number; max: number }; locations: string[]; propertyTypes: string[] }): number {
  let score = 0;
  let factors = 0;

  // Budget compatibility (40% weight)
  const renterBudget = {
    min: renter.profile?.budgetMin || 0,
    max: renter.profile?.budgetMax || 0
  };

  if (renterBudget.max > 0 && agentCriteria.priceRange.min > 0) {
    const overlapMin = Math.max(renterBudget.min, agentCriteria.priceRange.min);
    const overlapMax = Math.min(renterBudget.max, agentCriteria.priceRange.max);
    
    if (overlapMax >= overlapMin) {
      const overlapSize = overlapMax - overlapMin;
      const renterRange = renterBudget.max - renterBudget.min;
      const budgetScore = renterRange > 0 ? (overlapSize / renterRange) * 100 : 50;
      score += budgetScore * 0.4;
    }
    factors += 0.4;
  }

  // Location match (30% weight)
  const renterLocation = renter.profile?.preferredLocation?.toLowerCase() || '';
  if (renterLocation && agentCriteria.locations.length > 0) {
    const locationMatch = agentCriteria.locations.some((loc: string) => 
      renterLocation.includes(loc) || loc.includes(renterLocation)
    );
    if (locationMatch) {
      score += 100 * 0.3;
    }
    factors += 0.3;
  }

  // Property type match (20% weight)
  const renterAccommodationType = renter.profile?.accommodationType || [];
  if (renterAccommodationType.length > 0 && agentCriteria.propertyTypes.length > 0) {
    const typeMatch = renterAccommodationType.some((type: string) =>
      agentCriteria.propertyTypes.includes(type.toLowerCase())
    );
    if (typeMatch) {
      score += 100 * 0.2;
    }
    factors += 0.2;
  }

  // Verification status (10% weight) - already filtered for verified
  score += 100 * 0.1;
  factors += 0.1;

  // Normalize score based on available factors
  return factors > 0 ? Math.round(score / factors) : 0;
}