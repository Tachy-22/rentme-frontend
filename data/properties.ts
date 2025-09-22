import { Property } from '../types';

export const properties: Property[] = [
  {
    id: 'property_1',
    agentId: 'agent_1',
    title: 'Modern Studio Apartment Near UNILAG',
    description: 'A beautifully furnished studio apartment perfect for students. Located just 10 minutes walk from University of Lagos main gate. Features modern amenities and 24/7 security.',
    type: 'studio',
    status: 'available',
    price: {
      amount: 280000,
      currency: 'NGN',
      period: 'monthly'
    },
    location: {
      address: '12 Akoka Road, Yaba',
      city: 'Lagos',
      state: 'Lagos',
      coordinates: {
        latitude: 6.5158,
        longitude: 3.3898
      },
      nearbyUniversities: ['University of Lagos'],
      distanceToUniversity: {
        'University of Lagos': {
          distance: 0.8,
          unit: 'km',
          transportMethods: {
            walking: 10,
            driving: 3,
            publicTransport: 5
          }
        }
      }
    },
    details: {
      bedrooms: 1,
      bathrooms: 1,
      area: {
        value: 35,
        unit: 'sqm'
      },
      furnished: true,
      petsAllowed: false,
      smokingAllowed: false,
      availableFrom: '2024-04-01T00:00:00Z',
      leaseDuration: {
        min: 6,
        max: 12,
        unit: 'months'
      }
    },
    amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Wardrobe', 'Study Desk', 'Water Supply', 'Electricity'],
    images: [
      {
        url: 'https://res.cloudinary.com/detyrovtq/image/upload/v1758549805/property-68cd7354154707000dc4bbe4-1758295158965-cover.jpg',
        publicId: 'properties/property_1_main',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'Living area'
      },
      {
        url: 'https://res.cloudinary.com/detyrovtq/image/upload/v1758549811/property-68cd7354154707000dc4bbe4-1758295160212-WhatsApp_Image_2025-09-19_at_14.59.18.jpg',
        publicId: 'properties/property_1_kitchen',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'Kitchen'
      },
      {
        url: 'https://res.cloudinary.com/detyrovtq/image/upload/v1758549803/property-68cd7354154707000dc4bbe4-1758295160211-WhatsApp_Image_2025-09-19_at_14.59.23.jpg',
        publicId: 'properties/property_1_bathroom',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'Bathroom'
      }
    ],
    utilities: {
      included: ['Water', 'Electricity', 'Internet'],
      excluded: ['Cable TV', 'Cleaning Service']
    },
    rules: ['No smoking', 'No pets', 'No loud music after 10 PM', 'Visitors must register'],
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
    viewCount: 245,
    saveCount: 38,
    applicationCount: 12
  },
  {
    id: 'property_2',
    agentId: 'agent_2',
    title: 'Spacious 2-Bedroom Apartment in Yaba',
    description: 'Perfect for students looking to share accommodation. Spacious 2-bedroom apartment with modern facilities. Close to multiple universities and transport links.',
    type: 'apartment',
    status: 'available',
    price: {
      amount: 450000,
      currency: 'NGN',
      period: 'monthly'
    },
    location: {
      address: '45 Herbert Macaulay Way, Yaba',
      city: 'Lagos',
      state: 'Lagos',
      coordinates: {
        latitude: 6.5056,
        longitude: 3.3783
      },
      nearbyUniversities: ['University of Lagos', 'Lagos State University'],
      distanceToUniversity: {
        'University of Lagos': {
          distance: 2.5,
          unit: 'km',
          transportMethods: {
            walking: 30,
            driving: 8,
            publicTransport: 15
          }
        },
        'Lagos State University': {
          distance: 8.2,
          unit: 'km',
          transportMethods: {
            walking: 95,
            driving: 25,
            publicTransport: 40
          }
        }
      }
    },
    details: {
      bedrooms: 2,
      bathrooms: 2,
      area: {
        value: 75,
        unit: 'sqm'
      },
      furnished: true,
      petsAllowed: false,
      smokingAllowed: false,
      availableFrom: '2024-04-15T00:00:00Z',
      leaseDuration: {
        min: 6,
        max: 24,
        unit: 'months'
      }
    },
    amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Wardrobe', 'Study Area', 'Parking', 'Security', 'Generator'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
        publicId: 'properties/property_2_living',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'Living room'
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        publicId: 'properties/property_2_bedroom1',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'Master bedroom'
      },
      {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        publicId: 'properties/property_2_kitchen',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'Kitchen'
      }
    ],
    utilities: {
      included: ['Water', 'Security', 'Waste Management'],
      excluded: ['Electricity', 'Internet', 'Cable TV']
    },
    rules: ['No smoking indoors', 'No pets', 'Quiet hours 10 PM - 7 AM', 'Maximum 2 guests at a time'],
    createdAt: '2024-02-28T09:15:00Z',
    updatedAt: '2024-03-22T11:45:00Z',
    viewCount: 389,
    saveCount: 67,
    applicationCount: 24
  },
  {
    id: 'property_3',
    agentId: 'agent_3',
    title: 'Affordable Single Room Near ABU',
    description: 'Budget-friendly single room accommodation perfect for students at Ahmadu Bello University. Basic amenities provided with shared facilities.',
    type: 'room',
    status: 'available',
    price: {
      amount: 120000,
      currency: 'NGN',
      period: 'monthly'
    },
    location: {
      address: '78 Samaru Road, Zaria',
      city: 'Zaria',
      state: 'Kaduna',
      coordinates: {
        latitude: 11.1069,
        longitude: 7.6837
      },
      nearbyUniversities: ['Ahmadu Bello University'],
      distanceToUniversity: {
        'Ahmadu Bello University': {
          distance: 1.2,
          unit: 'km',
          transportMethods: {
            walking: 15,
            driving: 4,
            publicTransport: 8
          }
        }
      }
    },
    details: {
      bedrooms: 1,
      bathrooms: 0,
      area: {
        value: 20,
        unit: 'sqm'
      },
      furnished: true,
      petsAllowed: false,
      smokingAllowed: false,
      availableFrom: '2024-03-25T00:00:00Z',
      leaseDuration: {
        min: 3,
        max: 12,
        unit: 'months'
      }
    },
    amenities: ['WiFi', 'Study Desk', 'Wardrobe', 'Shared Kitchen', 'Shared Bathroom', 'Water Supply'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
        publicId: 'properties/property_3_room',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'Single room'
      },
      {
        url: 'https://images.unsplash.com/photo-1556909085-f46d05af49bb?w=800&h=600&fit=crop',
        publicId: 'properties/property_3_shared_kitchen',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'Shared kitchen'
      }
    ],
    utilities: {
      included: ['Water', 'Security'],
      excluded: ['Electricity', 'Internet', 'Meal Service']
    },
    rules: ['No smoking', 'No pets', 'Keep shared areas clean', 'Respect other tenants'],
    createdAt: '2024-03-05T12:30:00Z',
    updatedAt: '2024-03-25T08:20:00Z',
    viewCount: 156,
    saveCount: 29,
    applicationCount: 8
  },
  {
    id: 'property_4',
    agentId: 'agent_4',
    title: 'Luxury Student Apartment - Covenant University',
    description: 'Premium furnished apartment designed specifically for students. High-end amenities and excellent security. Perfect for students who value comfort and style.',
    type: 'apartment',
    status: 'available',
    price: {
      amount: 650000,
      currency: 'NGN',
      period: 'monthly'
    },
    location: {
      address: '23 Canaan Land, Ota',
      city: 'Ota',
      state: 'Ogun',
      coordinates: {
        latitude: 6.6731,
        longitude: 3.2267
      },
      nearbyUniversities: ['Covenant University'],
      distanceToUniversity: {
        'Covenant University': {
          distance: 0.5,
          unit: 'km',
          transportMethods: {
            walking: 6,
            driving: 2,
            publicTransport: 4
          }
        }
      }
    },
    details: {
      bedrooms: 2,
      bathrooms: 2,
      area: {
        value: 85,
        unit: 'sqm'
      },
      furnished: true,
      petsAllowed: false,
      smokingAllowed: false,
      availableFrom: '2024-04-01T00:00:00Z',
      leaseDuration: {
        min: 12,
        max: 24,
        unit: 'months'
      }
    },
    amenities: ['High-Speed WiFi', 'Air Conditioning', 'Modern Kitchen', 'Smart TV', 'Gym Access', 'Swimming Pool', '24/7 Security', 'Backup Generator', 'Laundry Service'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
        publicId: 'properties/property_4_living',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'Luxury living room'
      },
      {
        url: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop',
        publicId: 'properties/property_4_bedroom',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'Master bedroom'
      },
      {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        publicId: 'properties/property_4_kitchen',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'Modern kitchen'
      },
      {
        url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
        publicId: 'properties/property_4_pool',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'Swimming pool'
      }
    ],
    virtualTourUrl: 'https://my.matterport.com/show/?m=property_4_tour',
    utilities: {
      included: ['Water', 'High-Speed Internet', 'Security', 'Pool Access', 'Gym Access', 'Laundry'],
      excluded: ['Electricity', 'Cable TV', 'Meal Service']
    },
    rules: ['No smoking anywhere', 'No pets', 'Quiet hours 9 PM - 8 AM', 'Pool hours 6 AM - 10 PM', 'Guest registration required'],
    createdAt: '2024-02-20T14:45:00Z',
    updatedAt: '2024-03-28T16:15:00Z',
    viewCount: 567,
    saveCount: 89,
    applicationCount: 31
  },
  {
    id: 'property_5',
    agentId: 'agent_5',
    title: 'Shared Student House - UNN Campus',
    description: 'Large student house with multiple rooms available for sharing. Great community atmosphere and very close to University of Nigeria, Nsukka campus.',
    type: 'shared',
    status: 'available',
    price: {
      amount: 95000,
      currency: 'NGN',
      period: 'monthly'
    },
    location: {
      address: '156 University Road, Nsukka',
      city: 'Nsukka',
      state: 'Enugu',
      coordinates: {
        latitude: 6.8567,
        longitude: 7.3958
      },
      nearbyUniversities: ['University of Nigeria'],
      distanceToUniversity: {
        'University of Nigeria': {
          distance: 0.3,
          unit: 'km',
          transportMethods: {
            walking: 4,
            driving: 1,
            publicTransport: 2
          }
        }
      }
    },
    details: {
      bedrooms: 1,
      bathrooms: 0,
      area: {
        value: 15,
        unit: 'sqm'
      },
      furnished: true,
      petsAllowed: false,
      smokingAllowed: false,
      availableFrom: '2024-03-30T00:00:00Z',
      leaseDuration: {
        min: 4,
        max: 12,
        unit: 'months'
      }
    },
    amenities: ['WiFi', 'Study Area', 'Shared Kitchen', 'Shared Living Room', 'Wardrobe', 'Common Bathroom', 'Generator'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        publicId: 'properties/property_5_bedroom',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'Private bedroom'
      },
      {
        url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
        publicId: 'properties/property_5_common',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'Common area'
      },
      {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        publicId: 'properties/property_5_kitchen',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'Shared kitchen'
      }
    ],
    utilities: {
      included: ['Water', 'Security', 'Internet'],
      excluded: ['Electricity', 'Cable TV', 'Personal Cleaning']
    },
    rules: ['No smoking indoors', 'No pets', 'Clean up after yourself', 'Respect housemates', 'Overnight guests must be approved'],
    createdAt: '2024-03-10T11:20:00Z',
    updatedAt: '2024-03-26T09:30:00Z',
    viewCount: 298,
    saveCount: 52,
    applicationCount: 18
  },
  {
    id: 'property_6',
    agentId: 'agent_1',
    title: 'Cozy Studio Near Lagos Business School',
    description: 'Intimate studio apartment perfect for graduate students or working professionals. Modern amenities in a secure environment.',
    type: 'studio',
    status: 'available',
    price: {
      amount: 350000,
      currency: 'NGN',
      period: 'monthly'
    },
    location: {
      address: '89 Ajah Express Road, Lekki',
      city: 'Lagos',
      state: 'Lagos',
      coordinates: {
        latitude: 6.4698,
        longitude: 3.5852
      },
      nearbyUniversities: ['Lagos Business School', 'Pan-Atlantic University'],
      distanceToUniversity: {
        'Lagos Business School': {
          distance: 1.8,
          unit: 'km',
          transportMethods: {
            walking: 22,
            driving: 6,
            publicTransport: 12
          }
        }
      }
    },
    details: {
      bedrooms: 1,
      bathrooms: 1,
      area: {
        value: 40,
        unit: 'sqm'
      },
      furnished: true,
      petsAllowed: false,
      smokingAllowed: false,
      availableFrom: '2024-04-10T00:00:00Z',
      leaseDuration: {
        min: 6,
        max: 18,
        unit: 'months'
      }
    },
    amenities: ['High-Speed WiFi', 'Air Conditioning', 'Kitchenette', 'Work Desk', 'Wardrobe', 'DSTV', '24/7 Security'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
        publicId: 'properties/property_6_main',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'Studio apartment'
      },
      {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        publicId: 'properties/property_6_kitchen',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'Kitchenette'
      }
    ],
    utilities: {
      included: ['Water', 'Internet', 'Security', 'Cable TV'],
      excluded: ['Electricity', 'Cleaning Service']
    },
    rules: ['No smoking', 'No pets', 'Professional environment', 'Visitors must register'],
    createdAt: '2024-03-15T13:10:00Z',
    updatedAt: '2024-03-29T15:45:00Z',
    viewCount: 187,
    saveCount: 34,
    applicationCount: 9
  },
  {
    id: 'property_7',
    agentId: 'agent_2',
    title: '3-Bedroom House for Student Sharing',
    description: 'Spacious 3-bedroom house ideal for students who want to share accommodation. Large compound with parking space.',
    type: 'house',
    status: 'available',
    price: {
      amount: 750000,
      currency: 'NGN',
      period: 'monthly'
    },
    location: {
      address: '12 University Avenue, Ile-Ife',
      city: 'Ile-Ife',
      state: 'Osun',
      coordinates: {
        latitude: 7.4898,
        longitude: 4.5692
      },
      nearbyUniversities: ['Obafemi Awolowo University'],
      distanceToUniversity: {
        'Obafemi Awolowo University': {
          distance: 2.1,
          unit: 'km',
          transportMethods: {
            walking: 25,
            driving: 7,
            publicTransport: 15
          }
        }
      }
    },
    details: {
      bedrooms: 3,
      bathrooms: 2,
      area: {
        value: 120,
        unit: 'sqm'
      },
      furnished: true,
      petsAllowed: true,
      smokingAllowed: false,
      availableFrom: '2024-04-05T00:00:00Z',
      leaseDuration: {
        min: 12,
        max: 24,
        unit: 'months'
      }
    },
    amenities: ['WiFi', 'Air Conditioning', 'Full Kitchen', 'Living Room', 'Dining Area', 'Parking', 'Garden', 'Security', 'Generator'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
        publicId: 'properties/property_7_exterior',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'House exterior'
      },
      {
        url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
        publicId: 'properties/property_7_living',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'Living room'
      },
      {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        publicId: 'properties/property_7_kitchen',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'Kitchen'
      }
    ],
    utilities: {
      included: ['Water', 'Security', 'Waste Management'],
      excluded: ['Electricity', 'Internet', 'Cable TV']
    },
    rules: ['No smoking indoors', 'Pets allowed with deposit', 'Maintain cleanliness', 'Shared responsibility for utilities'],
    createdAt: '2024-02-25T10:30:00Z',
    updatedAt: '2024-03-30T12:20:00Z',
    viewCount: 445,
    saveCount: 78,
    applicationCount: 22
  },
  {
    id: 'property_8',
    agentId: 'agent_3',
    title: 'Budget Room with Study Space - UNIBEN',
    description: 'Affordable accommodation for University of Benin students. Clean, safe environment with dedicated study area.',
    type: 'room',
    status: 'rented',
    price: {
      amount: 110000,
      currency: 'NGN',
      period: 'monthly'
    },
    location: {
      address: '67 Ring Road, Benin City',
      city: 'Benin City',
      state: 'Edo',
      coordinates: {
        latitude: 6.3390,
        longitude: 5.6037
      },
      nearbyUniversities: ['University of Benin'],
      distanceToUniversity: {
        'University of Benin': {
          distance: 1.5,
          unit: 'km',
          transportMethods: {
            walking: 18,
            driving: 5,
            publicTransport: 10
          }
        }
      }
    },
    details: {
      bedrooms: 1,
      bathrooms: 0,
      area: {
        value: 18,
        unit: 'sqm'
      },
      furnished: true,
      petsAllowed: false,
      smokingAllowed: false,
      availableFrom: '2024-05-01T00:00:00Z',
      leaseDuration: {
        min: 4,
        max: 12,
        unit: 'months'
      }
    },
    amenities: ['WiFi', 'Study Desk', 'Wardrobe', 'Fan', 'Shared Kitchen', 'Shared Bathroom'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
        publicId: 'properties/property_8_room',
        width: 800,
        height: 600,
        format: 'jpg',
        caption: 'Study room'
      }
    ],
    utilities: {
      included: ['Water', 'Security'],
      excluded: ['Electricity', 'Internet', 'Cleaning']
    },
    rules: ['No smoking', 'No pets', 'Quiet study environment', 'Respect shared spaces'],
    createdAt: '2024-03-08T09:45:00Z',
    updatedAt: '2024-03-27T11:15:00Z',
    viewCount: 134,
    saveCount: 21,
    applicationCount: 6
  }
];