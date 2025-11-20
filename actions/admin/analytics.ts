'use server';

import { cookies } from 'next/headers';
import { queryDocuments } from '@/actions/firebase';

export async function getAnalyticsData() {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('user-role')?.value;

    if (userRole !== 'admin') {
      return {
        success: false,
        error: 'Unauthorized access'
      };
    }

    // Get users data
    const usersResult = await queryDocuments({
      collectionName: 'users'
    });

    // Get properties data
    const propertiesResult = await queryDocuments({
      collectionName: 'properties'
    });

    // Get conversations data
    const conversationsResult = await queryDocuments({
      collectionName: 'conversations'
    });

    // Get applications data
    const applicationsResult = await queryDocuments({
      collectionName: 'applications'
    });

    const users = usersResult.success ? usersResult.data || [] : [];
    const properties = propertiesResult.success ? propertiesResult.data || [] : [];
    const conversations = conversationsResult.success ? conversationsResult.data || [] : [];
    const applications = applicationsResult.success ? applicationsResult.data || [] : [];

    // Calculate growth metrics
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    // User growth
    const newUsersThisWeek = users.filter((u: Record<string, unknown>) => new Date(u.createdAt) >= lastWeek).length;
    const newUsersLastMonth = users.filter((u: Record<string, unknown>) => new Date(u.createdAt) >= lastMonth).length;

    // Property growth
    const newPropertiesThisWeek = properties.filter((p: Record<string, unknown>) => new Date(p.createdAt) >= lastWeek).length;
    const newPropertiesLastMonth = properties.filter((p: Record<string, unknown>) => new Date(p.createdAt) >= lastMonth).length;

    // Engagement metrics
    const activeConversations = conversations.filter((c: Record<string, unknown>) => {
      const lastActivity = new Date(c.updatedAt);
      return lastActivity >= lastWeek;
    }).length;

    const newApplicationsThisWeek = applications.filter((a: Record<string, unknown>) => new Date(a.submittedAt) >= lastWeek).length;

    // University distribution
    const universityDistribution = users
      .filter((u: Record<string, unknown>) => u.role === 'renter' && u.profile?.university)
      .reduce((acc: Record<string, number>, user: Record<string, unknown>) => {
        const university = user.profile.university;
        acc[university] = (acc[university] || 0) + 1;
        return acc;
      }, {});

    // Location distribution  
    const locationDistribution = properties
      .filter((p: Record<string, unknown>) => p.location?.city)
      .reduce((acc: Record<string, number>, property: Record<string, unknown>) => {
        const city = property.location.city;
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {});

    // Property type distribution
    const propertyTypeDistribution = properties
      .reduce((acc: Record<string, number>, property: Record<string, unknown>) => {
        const type = property.type || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

    // Monthly user registration trend (last 6 months)
    const monthlyRegistrations = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthUsers = users.filter((u: Record<string, unknown>) => {
        const userDate = new Date(u.createdAt);
        return userDate >= monthStart && userDate <= monthEnd;
      }).length;

      monthlyRegistrations.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        users: monthUsers
      });
    }

    // Property listing trends (last 6 months)
    const monthlyListings = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthProperties = properties.filter((p: Record<string, unknown>) => {
        const propertyDate = new Date(p.createdAt);
        return propertyDate >= monthStart && propertyDate <= monthEnd;
      }).length;

      monthlyListings.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        properties: monthProperties
      });
    }

    const analytics = {
      overview: {
        totalUsers: users.length,
        totalProperties: properties.length,
        totalConversations: conversations.length,
        totalApplications: applications.length,
        newUsersThisWeek,
        newUsersLastMonth,
        newPropertiesThisWeek,
        newPropertiesLastMonth,
        activeConversations,
        newApplicationsThisWeek
      },
      userMetrics: {
        totalRenters: users.filter((u: Record<string, unknown>) => u.role === 'renter').length,
        totalAgents: users.filter((u: Record<string, unknown>) => u.role === 'agent').length,
        verifiedUsers: users.filter((u: Record<string, unknown>) => u.profile?.verificationStatus === 'verified').length,
        pendingVerifications: users.filter((u: Record<string, unknown>) => u.profile?.verificationStatus === 'pending').length
      },
      propertyMetrics: {
        availableProperties: properties.filter((p: Record<string, unknown>) => p.status === 'available').length,
        rentedProperties: properties.filter((p: Record<string, unknown>) => p.status === 'rented').length,
        pendingProperties: properties.filter((p: Record<string, unknown>) => p.status === 'pending').length,
        totalViews: properties.reduce((sum: number, p: Record<string, unknown>) => sum + (p.viewCount || 0), 0),
        averagePrice: properties.length > 0 
          ? Math.round(properties.reduce((sum: number, p: Record<string, unknown>) => sum + (p.price?.amount || 0), 0) / properties.length)
          : 0
      },
      distributions: {
        universities: Object.entries(universityDistribution)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        locations: Object.entries(locationDistribution)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        propertyTypes: Object.entries(propertyTypeDistribution)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
      },
      trends: {
        monthlyRegistrations,
        monthlyListings
      }
    };

    return {
      success: true,
      data: analytics
    };

  } catch (error) {
    console.error('Error getting analytics data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get analytics data'
    };
  }
}

export async function getMessageStats() {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('user-role')?.value;

    if (userRole !== 'admin') {
      return {
        success: false,
        error: 'Unauthorized access'
      };
    }

    // Get conversations
    const conversationsResult = await queryDocuments({
      collectionName: 'conversations'
    });

    // Get messages
    const messagesResult = await queryDocuments({
      collectionName: 'messages'
    });

    const conversations = conversationsResult.success ? conversationsResult.data || [] : [];
    const messages = messagesResult.success ? messagesResult.data || [] : [];

    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const stats = {
      totalConversations: conversations.length,
      totalMessages: messages.length,
      activeConversations: conversations.filter((c: Record<string, unknown>) => {
        const lastActivity = new Date(c.updatedAt);
        return lastActivity >= weekAgo;
      }).length,
      messagesThisWeek: messages.filter((m: Record<string, unknown>) => {
        const messageDate = new Date(m.sentAt);
        return messageDate >= weekAgo;
      }).length,
      averageMessagesPerConversation: conversations.length > 0 
        ? Math.round(messages.length / conversations.length)
        : 0
    };

    return {
      success: true,
      data: stats
    };

  } catch (error) {
    console.error('Error getting message stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get message stats'
    };
  }
}