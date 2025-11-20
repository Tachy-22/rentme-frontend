'use server';

import { cookies } from 'next/headers';
import { queryDocuments, getDocument } from '@/actions/firebase';

interface PropertyAnalytics {
  propertyId: string;
  title: string;
  status: string;
  views: number;
  inquiries: number;
  applications: number;
  conversionRate: number;
  averageViewTime?: number;
  lastViewed?: string;
  createdAt: string;
  daysListed: number;
  pricePerView?: number;
  location: {
    city: string;
    area?: string;
  };
  price: {
    amount: number;
    currency: string;
  };
}

interface AgentAnalytics {
  totalProperties: number;
  activeProperties: number;
  totalViews: number;
  totalInquiries: number;
  totalApplications: number;
  averageConversionRate: number;
  topPerformingProperty?: PropertyAnalytics;
  recentActivity: {
    viewsThisWeek: number;
    inquiriesThisWeek: number;
    applicationsThisWeek: number;
  };
  monthlyStats: {
    month: string;
    views: number;
    inquiries: number;
    applications: number;
  }[];
}

export async function getPropertyAnalytics() {
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

    // Get agent's properties
    const propertiesResult = await queryDocuments({
      collectionName: 'properties',
      filters: [
        { field: 'agentId', operator: '==', value: userId }
      ]
    });

    if (!propertiesResult.success || !propertiesResult.data) {
      return {
        success: false,
        error: 'Failed to fetch properties'
      };
    }

    const properties = propertiesResult.data as Record<string, unknown>[];
    
    // Calculate analytics for each property
    const propertyAnalytics: PropertyAnalytics[] = properties.map((property: Record<string, unknown>) => {
      const views = property.viewCount || 0;
      const inquiries = property.inquiries || 0;
      const applications = property.applications || 0;
      const conversionRate = views > 0 ? ((applications / views) * 100) : 0;
      
      const createdAt = new Date(property.createdAt);
      const now = new Date();
      const daysListed = Math.ceil((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      
      const pricePerView = views > 0 ? (property.price?.amount || 0) / views : undefined;

      return {
        propertyId: property.id,
        title: property.title,
        status: property.status,
        views,
        inquiries,
        applications,
        conversionRate: Math.round(conversionRate * 100) / 100,
        createdAt: property.createdAt,
        daysListed,
        pricePerView,
        location: {
          city: property.location?.city || 'Unknown',
          area: property.location?.area
        },
        price: {
          amount: property.price?.amount || 0,
          currency: property.price?.currency || 'USD'
        },
        lastViewed: property.lastViewed,
        averageViewTime: property.averageViewTime
      };
    });

    // Calculate aggregate analytics
    const totalViews = propertyAnalytics.reduce((sum, p) => sum + p.views, 0);
    const totalInquiries = propertyAnalytics.reduce((sum, p) => sum + p.inquiries, 0);
    const totalApplications = propertyAnalytics.reduce((sum, p) => sum + p.applications, 0);
    const averageConversionRate = totalViews > 0 ? (totalApplications / totalViews) * 100 : 0;
    
    const activeProperties = propertyAnalytics.filter(p => p.status === 'available').length;
    
    // Find top performing property (by conversion rate, then by views)
    const topPerformingProperty = propertyAnalytics
      .sort((a, b) => {
        if (a.conversionRate !== b.conversionRate) {
          return b.conversionRate - a.conversionRate;
        }
        return b.views - a.views;
      })[0];

    // Calculate recent activity (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    // Note: In a real implementation, you'd track daily analytics
    // For now, we'll estimate based on creation dates
    const recentProperties = properties.filter((p: Record<string, unknown>) => 
      new Date(p.createdAt as string) >= weekAgo
    );
    
    const recentActivity = {
      viewsThisWeek: recentProperties.reduce((sum: number, p: Record<string, unknown>) => sum + ((p.viewCount as number) || 0), 0),
      inquiriesThisWeek: recentProperties.reduce((sum: number, p: Record<string, unknown>) => sum + ((p.inquiries as number) || 0), 0),
      applicationsThisWeek: recentProperties.reduce((sum: number, p: Record<string, unknown>) => sum + ((p.applications as number) || 0), 0)
    };

    // Generate monthly stats for last 6 months
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthProperties = properties.filter((p: Record<string, unknown>) => {
        const createdAt = new Date(p.createdAt as string);
        return createdAt >= monthStart && createdAt <= monthEnd;
      });
      
      monthlyStats.push({
        month: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        views: monthProperties.reduce((sum: number, p: Record<string, unknown>) => sum + ((p.viewCount as number) || 0), 0),
        inquiries: monthProperties.reduce((sum: number, p: Record<string, unknown>) => sum + ((p.inquiries as number) || 0), 0),
        applications: monthProperties.reduce((sum: number, p: Record<string, unknown>) => sum + ((p.applications as number) || 0), 0)
      });
    }

    const agentAnalytics: AgentAnalytics = {
      totalProperties: properties.length,
      activeProperties,
      totalViews,
      totalInquiries,
      totalApplications,
      averageConversionRate: Math.round(averageConversionRate * 100) / 100,
      topPerformingProperty,
      recentActivity,
      monthlyStats
    };

    return {
      success: true,
      data: {
        agentAnalytics,
        propertyAnalytics: propertyAnalytics.sort((a, b) => b.views - a.views) // Sort by views descending
      }
    };

  } catch (error) {
    console.error('Error getting property analytics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get property analytics'
    };
  }
}

export async function updatePropertyView(propertyId: string) {
  try {
    if (!propertyId) {
      return {
        success: false,
        error: 'Property ID is required'
      };
    }

    // Get the current property
    const propertyResult = await getDocument({
      collectionName: 'properties',
      documentId: propertyId
    });

    if (!propertyResult.success || !propertyResult.data) {
      return {
        success: false,
        error: 'Property not found'
      };
    }

    const property = propertyResult.data as Record<string, unknown>;
    const currentViews = (property.viewCount as number) || 0;

    // Update view count and last viewed timestamp
    const { updateDocument } = await import('@/actions/firebase');
    const updateResult = await updateDocument({
      collectionName: 'properties',
      documentId: propertyId,
      data: {
        viewCount: currentViews + 1,
        lastViewed: new Date().toISOString()
      }
    });

    return updateResult;

  } catch (error) {
    console.error('Error updating property view:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update property view'
    };
  }
}

export async function updatePropertyInquiry(propertyId: string) {
  try {
    if (!propertyId) {
      return {
        success: false,
        error: 'Property ID is required'
      };
    }

    // Get the current property
    const propertyResult = await getDocument({
      collectionName: 'properties',
      documentId: propertyId
    });

    if (!propertyResult.success || !propertyResult.data) {
      return {
        success: false,
        error: 'Property not found'
      };
    }

    const property = propertyResult.data as Record<string, unknown>;
    const currentInquiries = (property.inquiries as number) || 0;

    // Update inquiry count
    const { updateDocument } = await import('@/actions/firebase');
    const updateResult = await updateDocument({
      collectionName: 'properties',
      documentId: propertyId,
      data: {
        inquiries: currentInquiries + 1
      }
    });

    return updateResult;

  } catch (error) {
    console.error('Error updating property inquiry:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update property inquiry'
    };
  }
}