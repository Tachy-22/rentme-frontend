'use server';

import { queryDocuments } from '@/actions/firebase/queryDocuments';

interface PropertyStatsResult {
  success: boolean;
  stats: {
    totalProperties: number;
    activeProperties: number;
    rentedProperties: number;
    pendingApplications: number;
    totalViews: number;
    totalInquiries: number;
    monthlyRevenue: number;
  };
  error?: string;
}

export async function getAgentPropertyStats(agentId: string): Promise<PropertyStatsResult> {
  try {
    if (!agentId) {
      return {
        success: false,
        stats: {
          totalProperties: 0,
          activeProperties: 0,
          rentedProperties: 0,
          pendingApplications: 0,
          totalViews: 0,
          totalInquiries: 0,
          monthlyRevenue: 0
        },
        error: 'Agent ID is required'
      };
    }

    // Get all properties for the agent
    const propertiesResult = await queryDocuments({
      collectionName: 'properties',
      filters: [
        {
          field: 'agentId',
          operator: '==',
          value: agentId
        }
      ]
    });

    if (!propertiesResult.success) {
      return {
        success: false,
        stats: {
          totalProperties: 0,
          activeProperties: 0,
          rentedProperties: 0,
          pendingApplications: 0,
          totalViews: 0,
          totalInquiries: 0,
          monthlyRevenue: 0
        },
        error: propertiesResult.error || 'Failed to fetch properties'
      };
    }

    const properties = propertiesResult.data || [];
    const totalProperties = properties.length;
    const activeProperties = properties.filter((p: Record<string, unknown>) => p.status === 'available').length;
    const rentedProperties = properties.filter((p: Record<string, unknown>) => p.status === 'rented').length;
    
    // Calculate total views
    const totalViews = properties.reduce((sum: number, p: Record<string, unknown>) => sum + ((p.viewCount as number) || 0), 0);

    // Get pending applications for all properties
    let pendingApplications = 0;
    let totalInquiries = 0;
    
    for (const property of properties) {
      // Get applications for this property
      const applicationsResult = await queryDocuments({
        collectionName: 'applications',
        filters: [
          {
            field: 'propertyId',
            operator: '==',
            value: (property as Record<string, unknown>).id as string
          },
          {
            field: 'status',
            operator: '==',
            value: 'pending'
          }
        ]
      });

      if (applicationsResult.success && applicationsResult.data) {
        pendingApplications += applicationsResult.data.length;
      }

      // Get conversations/inquiries for this property
      const conversationsResult = await queryDocuments({
        collectionName: 'conversations',
        filters: [
          {
            field: 'propertyId',
            operator: '==',
            value: (property as Record<string, unknown>).id as string
          }
        ]
      });

      if (conversationsResult.success && conversationsResult.data) {
        totalInquiries += conversationsResult.data.length;
      }
    }

    // Calculate monthly revenue (this would typically come from a payments collection)
    // For now, we'll calculate based on rented properties and their prices
    const monthlyRevenue = properties
      .filter((p: Record<string, unknown>) => p.status === 'rented')
      .reduce((sum: number, p: Record<string, unknown>) => {
        const price = p.price as { amount?: number; period?: string } | undefined;
        const amount = price?.amount || 0;
        const period = price?.period || 'monthly';
        
        // Convert to monthly revenue
        let monthlyAmount = amount;
        if (period === 'weekly') {
          monthlyAmount = amount * 4.33; // Average weeks per month
        } else if (period === 'yearly') {
          monthlyAmount = amount / 12;
        }
        
        return sum + monthlyAmount;
      }, 0);

    return {
      success: true,
      stats: {
        totalProperties,
        activeProperties,
        rentedProperties,
        pendingApplications,
        totalViews,
        totalInquiries,
        monthlyRevenue: Math.round(monthlyRevenue)
      }
    };
  } catch (error) {
    console.error('Error fetching property stats:', error);
    return {
      success: false,
      stats: {
        totalProperties: 0,
        activeProperties: 0,
        rentedProperties: 0,
        pendingApplications: 0,
        totalViews: 0,
        totalInquiries: 0,
        monthlyRevenue: 0
      },
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}