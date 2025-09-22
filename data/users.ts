import { User, StudentProfile, AgentProfile } from '../types';

export const users: User[] = [
  // Students (10)
  {
    id: 'student_1',
    email: 'john.doe@university.edu',
    role: 'student',
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      university: 'University of Lagos',
      course: 'Computer Science',
      yearOfStudy: 2,
      budget: {
        min: 150000,
        max: 300000
      },
      preferredPropertyTypes: ['room', 'studio'],
      bio: 'Second year Computer Science student looking for a quiet place to study. Love gaming and coding.',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      videoIntroduction: 'https://res.cloudinary.com/rentme/video/upload/v1/intros/student_1.mp4',
      phoneNumber: '+234-801-234-5678',
      emergencyContact: {
        name: 'Mary Doe',
        relationship: 'Mother',
        phoneNumber: '+234-803-456-7890'
      }
    } as StudentProfile,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-02-20T14:45:00Z',
    isActive: true
  },
  {
    id: 'student_2',
    email: 'sarah.johnson@university.edu',
    role: 'student',
    profile: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      university: 'Covenant University',
      course: 'Business Administration',
      yearOfStudy: 3,
      budget: {
        min: 200000,
        max: 400000
      },
      preferredPropertyTypes: ['apartment', 'studio'],
      bio: 'Third year Business student. Love cooking and hosting friends. Looking for a spacious place.',
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b812e672?w=400&h=400&fit=crop&crop=face',
      phoneNumber: '+234-802-345-6789',
      emergencyContact: {
        name: 'Robert Johnson',
        relationship: 'Father',
        phoneNumber: '+234-804-567-8901'
      }
    } as StudentProfile,
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-02-25T16:20:00Z',
    isActive: true
  },
  {
    id: 'student_3',
    email: 'ahmed.hassan@university.edu',
    role: 'student',
    profile: {
      firstName: 'Ahmed',
      lastName: 'Hassan',
      university: 'University of Abuja',
      course: 'Medicine',
      yearOfStudy: 4,
      budget: {
        min: 250000,
        max: 500000
      },
      preferredPropertyTypes: ['apartment', 'house'],
      bio: 'Fourth year medical student. Need a quiet environment for studying. Non-smoker.',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      videoIntroduction: 'https://res.cloudinary.com/rentme/video/upload/v1/intros/student_3.mp4',
      phoneNumber: '+234-803-456-7890',
      emergencyContact: {
        name: 'Fatima Hassan',
        relationship: 'Sister',
        phoneNumber: '+234-805-678-9012'
      }
    } as StudentProfile,
    createdAt: '2024-02-01T11:20:00Z',
    updatedAt: '2024-03-01T10:15:00Z',
    isActive: true
  },
  {
    id: 'student_4',
    email: 'grace.okoro@university.edu',
    role: 'student',
    profile: {
      firstName: 'Grace',
      lastName: 'Okoro',
      university: 'University of Lagos',
      course: 'Law',
      yearOfStudy: 1,
      budget: {
        min: 180000,
        max: 350000
      },
      preferredPropertyTypes: ['room', 'shared'],
      bio: 'First year Law student. Love reading and quiet environments. Looking for affordable accommodation.',
      profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      phoneNumber: '+234-804-567-8901',
      emergencyContact: {
        name: 'Peter Okoro',
        relationship: 'Father',
        phoneNumber: '+234-806-789-0123'
      }
    } as StudentProfile,
    createdAt: '2024-02-10T08:30:00Z',
    updatedAt: '2024-02-28T12:45:00Z',
    isActive: true
  },
  {
    id: 'student_5',
    email: 'david.williams@university.edu',
    role: 'student',
    profile: {
      firstName: 'David',
      lastName: 'Williams',
      university: 'Babcock University',
      course: 'Engineering',
      yearOfStudy: 3,
      budget: {
        min: 220000,
        max: 450000
      },
      preferredPropertyTypes: ['apartment', 'studio'],
      bio: 'Third year Engineering student. Love music and technology. Need good internet connection.',
      profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      videoIntroduction: 'https://res.cloudinary.com/rentme/video/upload/v1/intros/student_5.mp4',
      phoneNumber: '+234-805-678-9012',
      emergencyContact: {
        name: 'Jennifer Williams',
        relationship: 'Mother',
        phoneNumber: '+234-807-890-1234'
      }
    } as StudentProfile,
    createdAt: '2024-02-15T13:45:00Z',
    updatedAt: '2024-03-05T15:30:00Z',
    isActive: true
  },
  {
    id: 'student_6',
    email: 'fatima.ibrahim@university.edu',
    role: 'student',
    profile: {
      firstName: 'Fatima',
      lastName: 'Ibrahim',
      university: 'Ahmadu Bello University',
      course: 'Psychology',
      yearOfStudy: 2,
      budget: {
        min: 160000,
        max: 320000
      },
      preferredPropertyTypes: ['room', 'studio'],
      bio: 'Second year Psychology student. Love art and painting. Looking for a creative space.',
      profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
      phoneNumber: '+234-806-789-0123',
      emergencyContact: {
        name: 'Hassan Ibrahim',
        relationship: 'Brother',
        phoneNumber: '+234-808-901-2345'
      }
    } as StudentProfile,
    createdAt: '2024-02-20T16:20:00Z',
    updatedAt: '2024-03-10T11:15:00Z',
    isActive: true
  },
  {
    id: 'student_7',
    email: 'michael.okafor@university.edu',
    role: 'student',
    profile: {
      firstName: 'Michael',
      lastName: 'Okafor',
      university: 'University of Nigeria',
      course: 'Economics',
      yearOfStudy: 4,
      budget: {
        min: 280000,
        max: 550000
      },
      preferredPropertyTypes: ['apartment', 'house'],
      bio: 'Final year Economics student. Love sports and socializing. Need space for friends to visit.',
      profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
      videoIntroduction: 'https://res.cloudinary.com/rentme/video/upload/v1/intros/student_7.mp4',
      phoneNumber: '+234-807-890-1234',
      emergencyContact: {
        name: 'Chioma Okafor',
        relationship: 'Mother',
        phoneNumber: '+234-809-012-3456'
      }
    } as StudentProfile,
    createdAt: '2024-01-25T12:10:00Z',
    updatedAt: '2024-03-15T14:25:00Z',
    isActive: true
  },
  {
    id: 'student_8',
    email: 'blessing.adeyemi@university.edu',
    role: 'student',
    profile: {
      firstName: 'Blessing',
      lastName: 'Adeyemi',
      university: 'University of Ibadan',
      course: 'Pharmacy',
      yearOfStudy: 3,
      budget: {
        min: 190000,
        max: 380000
      },
      preferredPropertyTypes: ['studio', 'room'],
      bio: 'Third year Pharmacy student. Love cooking and fitness. Need a place with good kitchen facilities.',
      profilePicture: 'https://images.unsplash.com/photo-1488508872907-592763824245?w=400&h=400&fit=crop&crop=face',
      phoneNumber: '+234-808-901-2345',
      emergencyContact: {
        name: 'Tunde Adeyemi',
        relationship: 'Father',
        phoneNumber: '+234-810-123-4567'
      }
    } as StudentProfile,
    createdAt: '2024-02-05T14:50:00Z',
    updatedAt: '2024-03-20T09:40:00Z',
    isActive: true
  },
  {
    id: 'student_9',
    email: 'emmanuel.nwosu@university.edu',
    role: 'student',
    profile: {
      firstName: 'Emmanuel',
      lastName: 'Nwosu',
      university: 'Covenant University',
      course: 'Architecture',
      yearOfStudy: 5,
      budget: {
        min: 300000,
        max: 600000
      },
      preferredPropertyTypes: ['apartment', 'house'],
      bio: 'Final year Architecture student. Love design and creativity. Need space for drafting and projects.',
      profilePicture: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face',
      videoIntroduction: 'https://res.cloudinary.com/rentme/video/upload/v1/intros/student_9.mp4',
      phoneNumber: '+234-809-012-3456',
      emergencyContact: {
        name: 'Ngozi Nwosu',
        relationship: 'Mother',
        phoneNumber: '+234-811-234-5678'
      }
    } as StudentProfile,
    createdAt: '2024-01-30T10:25:00Z',
    updatedAt: '2024-03-25T13:15:00Z',
    isActive: true
  },
  {
    id: 'student_10',
    email: 'kemi.ogundipe@university.edu',
    role: 'student',
    profile: {
      firstName: 'Kemi',
      lastName: 'Ogundipe',
      university: 'Lagos State University',
      course: 'Mass Communication',
      yearOfStudy: 2,
      budget: {
        min: 170000,
        max: 340000
      },
      preferredPropertyTypes: ['room', 'studio'],
      bio: 'Second year Mass Communication student. Love photography and social media. Need good lighting.',
      profilePicture: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&h=400&fit=crop&crop=face',
      phoneNumber: '+234-810-123-4567',
      emergencyContact: {
        name: 'Bola Ogundipe',
        relationship: 'Sister',
        phoneNumber: '+234-812-345-6789'
      }
    } as StudentProfile,
    createdAt: '2024-02-12T15:40:00Z',
    updatedAt: '2024-03-18T11:55:00Z',
    isActive: true
  },

  // Agents (5)
  {
    id: 'agent_1',
    email: 'james.property@realestate.com',
    role: 'agent',
    profile: {
      firstName: 'James',
      lastName: 'Adebayo',
      company: 'Lagos Property Solutions',
      license: 'LPS-2019-001',
      nin: '12345678901',
      agentId: 'LPS-JA-001',
      bio: 'Experienced property agent specializing in student accommodation around Lagos universities. 8+ years in real estate.',
      profilePicture: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
      phoneNumber: '+234-813-456-7890',
      officeAddress: '15 Admiralty Way, Lekki Phase 1, Lagos',
      specialties: ['apartment', 'studio', 'room'],
      rating: 4.8,
      totalReviews: 127,
      verificationStatus: 'verified',
      verificationDocuments: [
        'https://res.cloudinary.com/rentme/image/upload/v1/docs/agent_1_license.jpg',
        'https://res.cloudinary.com/rentme/image/upload/v1/docs/agent_1_nin.jpg'
      ]
    } as AgentProfile,
    createdAt: '2023-05-10T08:00:00Z',
    updatedAt: '2024-03-22T16:30:00Z',
    isActive: true
  },
  {
    id: 'agent_2',
    email: 'chioma.realty@propertyworld.com',
    role: 'agent',
    profile: {
      firstName: 'Chioma',
      lastName: 'Okafor',
      company: 'PropertyWorld Realty',
      license: 'PWR-2020-089',
      nin: '23456789012',
      agentId: 'PWR-CO-089',
      bio: 'Dedicated real estate professional focused on providing quality student housing. Known for excellent customer service.',
      profilePicture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
      phoneNumber: '+234-814-567-8901',
      officeAddress: '28 Herbert Macaulay Street, Yaba, Lagos',
      specialties: ['apartment', 'shared', 'studio'],
      rating: 4.6,
      totalReviews: 89,
      verificationStatus: 'verified',
      verificationDocuments: [
        'https://res.cloudinary.com/rentme/image/upload/v1/docs/agent_2_license.jpg',
        'https://res.cloudinary.com/rentme/image/upload/v1/docs/agent_2_nin.jpg'
      ]
    } as AgentProfile,
    createdAt: '2023-08-15T12:30:00Z',
    updatedAt: '2024-03-20T14:45:00Z',
    isActive: true
  },
  {
    id: 'agent_3',
    email: 'ibrahim.homes@universityhomes.ng',
    role: 'agent',
    profile: {
      firstName: 'Ibrahim',
      lastName: 'Musa',
      company: 'University Homes Nigeria',
      license: 'UHN-2018-045',
      nin: '34567890123',
      agentId: 'UHN-IM-045',
      bio: 'Specialist in affordable student accommodation across major Nigerian universities. 10+ years experience.',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      phoneNumber: '+234-815-678-9012',
      officeAddress: '42 Zaria Road, Samaru, Kaduna',
      specialties: ['room', 'shared', 'house'],
      rating: 4.7,
      totalReviews: 156,
      verificationStatus: 'verified',
      verificationDocuments: [
        'https://res.cloudinary.com/rentme/image/upload/v1/docs/agent_3_license.jpg',
        'https://res.cloudinary.com/rentme/image/upload/v1/docs/agent_3_nin.jpg'
      ]
    } as AgentProfile,
    createdAt: '2023-03-20T09:15:00Z',
    updatedAt: '2024-03-25T10:20:00Z',
    isActive: true
  },
  {
    id: 'agent_4',
    email: 'funmi.properties@premiumstudentliving.com',
    role: 'agent',
    profile: {
      firstName: 'Funmi',
      lastName: 'Adesanya',
      company: 'Premium Student Living',
      license: 'PSL-2021-012',
      nin: '45678901234',
      agentId: 'PSL-FA-012',
      bio: 'Premium accommodation specialist for discerning students. Focus on luxury and comfort in student housing.',
      profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
      phoneNumber: '+234-816-789-0123',
      officeAddress: '67 Awolowo Road, Ikoyi, Lagos',
      specialties: ['apartment', 'studio', 'house'],
      rating: 4.9,
      totalReviews: 73,
      verificationStatus: 'verified',
      verificationDocuments: [
        'https://res.cloudinary.com/rentme/image/upload/v1/docs/agent_4_license.jpg',
        'https://res.cloudinary.com/rentme/image/upload/v1/docs/agent_4_nin.jpg'
      ]
    } as AgentProfile,
    createdAt: '2023-11-05T14:20:00Z',
    updatedAt: '2024-03-28T12:10:00Z',
    isActive: true
  },
  {
    id: 'agent_5',
    email: 'samuel.housing@campusaccommodation.ng',
    role: 'agent',
    profile: {
      firstName: 'Samuel',
      lastName: 'Tunde',
      company: 'Campus Accommodation Services',
      license: 'CAS-2019-078',
      nin: '56789012345',
      agentId: 'CAS-ST-078',
      bio: 'Campus-focused real estate agent with deep understanding of student needs. Quick response and reliable service.',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      phoneNumber: '+234-817-890-1234',
      officeAddress: '33 University Road, Nsukka, Enugu',
      specialties: ['room', 'apartment', 'shared'],
      rating: 4.5,
      totalReviews: 112,
      verificationStatus: 'verified',
      verificationDocuments: [
        'https://res.cloudinary.com/rentme/image/upload/v1/docs/agent_5_license.jpg',
        'https://res.cloudinary.com/rentme/image/upload/v1/docs/agent_5_nin.jpg'
      ]
    } as AgentProfile,
    createdAt: '2023-07-12T11:45:00Z',
    updatedAt: '2024-03-15T15:25:00Z',
    isActive: true
  }
];