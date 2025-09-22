import { Application } from '../types';

export const applications: Application[] = [
  {
    id: 'application_1',
    propertyId: 'property_1',
    studentId: 'student_1',
    agentId: 'agent_1',
    status: 'pending',
    submittedAt: '2024-03-25T14:30:00Z',
    updatedAt: '2024-03-25T14:30:00Z',
    documents: [
      {
        id: 'doc_1',
        name: 'Student_ID.pdf',
        url: 'https://res.cloudinary.com/rentme/raw/upload/v1/documents/student_1_id.pdf',
        type: 'id',
        uploadedAt: '2024-03-25T14:25:00Z'
      },
      {
        id: 'doc_2',
        name: 'University_Verification.pdf',
        url: 'https://res.cloudinary.com/rentme/raw/upload/v1/documents/student_1_verification.pdf',
        type: 'student_verification',
        uploadedAt: '2024-03-25T14:27:00Z'
      }
    ],
    personalStatement: 'I am a dedicated Computer Science student looking for a quiet place to study and focus on my academics. I am responsible, clean, and respectful of others.',
    references: [
      {
        name: 'Dr. Adebayo Ogundimu',
        relationship: 'Academic Supervisor',
        email: 'a.ogundimu@unilag.edu.ng',
        phoneNumber: '+234-803-567-8901',
        organization: 'University of Lagos'
      },
      {
        name: 'Mr. Tunde Bakare',
        relationship: 'Family Friend',
        email: 'tunde.bakare@gmail.com',
        phoneNumber: '+234-805-123-4567'
      }
    ],
    preferredMoveInDate: '2024-04-01T00:00:00Z',
    additionalNotes: 'I am available for viewing at any time convenient for you. I can provide additional references if needed.'
  },
  {
    id: 'application_2',
    propertyId: 'property_2',
    studentId: 'student_2',
    agentId: 'agent_2',
    status: 'approved',
    submittedAt: '2024-03-20T10:15:00Z',
    updatedAt: '2024-03-22T16:30:00Z',
    documents: [
      {
        id: 'doc_3',
        name: 'Student_ID_Sarah.pdf',
        url: 'https://res.cloudinary.com/rentme/raw/upload/v1/documents/student_2_id.pdf',
        type: 'id',
        uploadedAt: '2024-03-20T10:10:00Z'
      },
      {
        id: 'doc_4',
        name: 'University_Letter.pdf',
        url: 'https://res.cloudinary.com/rentme/raw/upload/v1/documents/student_2_verification.pdf',
        type: 'student_verification',
        uploadedAt: '2024-03-20T10:12:00Z'
      },
      {
        id: 'doc_5',
        name: 'Parent_Income_Proof.pdf',
        url: 'https://res.cloudinary.com/rentme/raw/upload/v1/documents/student_2_income.pdf',
        type: 'income_proof',
        uploadedAt: '2024-03-20T10:14:00Z'
      }
    ],
    personalStatement: 'I am a third-year Business Administration student seeking accommodation to share with a compatible roommate. I am organized, social, and maintain a clean living environment.',
    references: [
      {
        name: 'Prof. Kemi Adeyemi',
        relationship: 'Course Lecturer',
        email: 'k.adeyemi@covenantuniversity.edu.ng',
        phoneNumber: '+234-807-234-5678',
        organization: 'Covenant University'
      }
    ],
    preferredMoveInDate: '2024-04-15T00:00:00Z',
    additionalNotes: 'I am looking for a female roommate to share the 2-bedroom apartment. I am a non-smoker and prefer a quiet environment for studying.',
    agentNotes: 'Great application with excellent references. Student has been approved and lease documents are being prepared.'
  },
  {
    id: 'application_3',
    propertyId: 'property_4',
    studentId: 'student_9',
    agentId: 'agent_4',
    status: 'pending',
    submittedAt: '2024-03-28T11:45:00Z',
    updatedAt: '2024-03-28T11:45:00Z',
    documents: [
      {
        id: 'doc_6',
        name: 'Emmanuel_ID.pdf',
        url: 'https://res.cloudinary.com/rentme/raw/upload/v1/documents/student_9_id.pdf',
        type: 'id',
        uploadedAt: '2024-03-28T11:40:00Z'
      },
      {
        id: 'doc_7',
        name: 'Architecture_Verification.pdf',
        url: 'https://res.cloudinary.com/rentme/raw/upload/v1/documents/student_9_verification.pdf',
        type: 'student_verification',
        uploadedAt: '2024-03-28T11:42:00Z'
      },
      {
        id: 'doc_8',
        name: 'Reference_Letter.pdf',
        url: 'https://res.cloudinary.com/rentme/raw/upload/v1/documents/student_9_reference.pdf',
        type: 'reference_letter',
        uploadedAt: '2024-03-28T11:44:00Z'
      }
    ],
    personalStatement: 'As a final year Architecture student, I need a space that can accommodate my design work and projects. I am looking for a premium accommodation that offers the comfort and facilities I need to complete my studies successfully.',
    references: [
      {
        name: 'Arch. Funmi Adebayo',
        relationship: 'Project Supervisor',
        email: 'f.adebayo@covenantuniversity.edu.ng',
        phoneNumber: '+234-809-345-6789',
        organization: 'Covenant University'
      },
      {
        name: 'Mr. Chidi Nwosu',
        relationship: 'Uncle',
        email: 'chidi.nwosu@gmail.com',
        phoneNumber: '+234-802-456-7890'
      }
    ],
    preferredMoveInDate: '2024-04-01T00:00:00Z',
    additionalNotes: 'I am willing to sign a 12-month lease and can provide additional security deposit if required. I need space for architectural drawings and models.'
  },
  {
    id: 'application_4',
    propertyId: 'property_3',
    studentId: 'student_6',
    agentId: 'agent_3',
    status: 'approved',
    submittedAt: '2024-03-22T15:20:00Z',
    updatedAt: '2024-03-24T09:15:00Z',
    documents: [
      {
        id: 'doc_9',
        name: 'Fatima_ID.pdf',
        url: 'https://res.cloudinary.com/rentme/raw/upload/v1/documents/student_6_id.pdf',
        type: 'id',
        uploadedAt: '2024-03-22T15:18:00Z'
      },
      {
        id: 'doc_10',
        name: 'ABU_Verification.pdf',
        url: 'https://res.cloudinary.com/rentme/raw/upload/v1/documents/student_6_verification.pdf',
        type: 'student_verification',
        uploadedAt: '2024-03-22T15:19:00Z'
      }
    ],
    personalStatement: 'I am a Psychology student who values creativity and needs an affordable, safe place to stay. I am quiet, studious, and respectful of shared spaces.',
    references: [
      {
        name: 'Dr. Amina Mohammed',
        relationship: 'Department Head',
        email: 'a.mohammed@abu.edu.ng',
        phoneNumber: '+234-806-123-4567',
        organization: 'Ahmadu Bello University'
      }
    ],
    preferredMoveInDate: '2024-03-25T00:00:00Z',
    agentNotes: 'Application approved. Student has been given keys and moved in successfully.'
  },
  {
    id: 'application_5',
    propertyId: 'property_5',
    studentId: 'student_8',
    agentId: 'agent_5',
    status: 'rejected',
    submittedAt: '2024-03-18T13:30:00Z',
    updatedAt: '2024-03-19T10:45:00Z',
    documents: [
      {
        id: 'doc_11',
        name: 'Blessing_ID.pdf',
        url: 'https://res.cloudinary.com/rentme/raw/upload/v1/documents/student_8_id.pdf',
        type: 'id',
        uploadedAt: '2024-03-18T13:28:00Z'
      }
    ],
    personalStatement: 'I am a Pharmacy student looking for affordable shared accommodation. I am clean, responsible, and focused on my studies.',
    references: [
      {
        name: 'Prof. Adebola Ogunbiyi',
        relationship: 'Course Lecturer',
        email: 'a.ogunbiyi@ui.edu.ng',
        phoneNumber: '+234-805-789-0123',
        organization: 'University of Ibadan'
      }
    ],
    preferredMoveInDate: '2024-04-01T00:00:00Z',
    additionalNotes: 'I can move in earlier if the room becomes available.',
    agentNotes: 'Application rejected due to incomplete documentation. Missing university verification letter and income proof.'
  },
  {
    id: 'application_6',
    propertyId: 'property_1',
    studentId: 'student_4',
    agentId: 'agent_1',
    status: 'pending',
    submittedAt: '2024-03-26T09:15:00Z',
    updatedAt: '2024-03-26T09:15:00Z',
    documents: [
      {
        id: 'doc_12',
        name: 'Grace_ID.pdf',
        url: 'https://res.cloudinary.com/rentme/raw/upload/v1/documents/student_4_id.pdf',
        type: 'id',
        uploadedAt: '2024-03-26T09:10:00Z'
      },
      {
        id: 'doc_13',
        name: 'Law_Student_Verification.pdf',
        url: 'https://res.cloudinary.com/rentme/raw/upload/v1/documents/student_4_verification.pdf',
        type: 'student_verification',
        uploadedAt: '2024-03-26T09:12:00Z'
      }
    ],
    personalStatement: 'I am a first-year Law student seeking a quiet, conducive environment for my studies. I am disciplined, focused, and maintain high standards of cleanliness.',
    references: [
      {
        name: 'Dr. Emeka Okafor',
        relationship: 'Academic Advisor',
        email: 'e.okafor@unilag.edu.ng',
        phoneNumber: '+234-804-678-9012',
        organization: 'University of Lagos'
      }
    ],
    preferredMoveInDate: '2024-04-05T00:00:00Z',
    additionalNotes: 'I am available for viewing and interview at your convenience. I can provide character references from my secondary school teachers if needed.'
  },
  {
    id: 'application_7',
    propertyId: 'property_7',
    studentId: 'student_7',
    agentId: 'agent_2',
    status: 'pending',
    submittedAt: '2024-03-29T16:45:00Z',
    updatedAt: '2024-03-29T16:45:00Z',
    documents: [
      {
        id: 'doc_14',
        name: 'Michael_ID.pdf',
        url: 'https://res.cloudinary.com/rentme/raw/upload/v1/documents/student_7_id.pdf',
        type: 'id',
        uploadedAt: '2024-03-29T16:40:00Z'
      },
      {
        id: 'doc_15',
        name: 'Economics_Verification.pdf',
        url: 'https://res.cloudinary.com/rentme/raw/upload/v1/documents/student_7_verification.pdf',
        type: 'student_verification',
        uploadedAt: '2024-03-29T16:42:00Z'
      },
      {
        id: 'doc_16',
        name: 'Financial_Support_Letter.pdf',
        url: 'https://res.cloudinary.com/rentme/raw/upload/v1/documents/student_7_income.pdf',
        type: 'income_proof',
        uploadedAt: '2024-03-29T16:44:00Z'
      }
    ],
    personalStatement: 'I am a final year Economics student looking for a house to share with 2 other serious students. I am social but respect study time and house rules.',
    references: [
      {
        name: 'Prof. Chinua Achebe Jr.',
        relationship: 'Thesis Supervisor',
        email: 'c.achebe@unn.edu.ng',
        phoneNumber: '+234-807-234-5678',
        organization: 'University of Nigeria'
      },
      {
        name: 'Mr. Ikechukwu Okafor',
        relationship: 'Family Friend',
        email: 'ike.okafor@yahoo.com',
        phoneNumber: '+234-803-567-8901'
      }
    ],
    preferredMoveInDate: '2024-04-05T00:00:00Z',
    additionalNotes: 'I am looking for 2 other students to share the house with. Preferably final year students who are serious about their studies.'
  },
  {
    id: 'application_8',
    propertyId: 'property_6',
    studentId: 'student_3',
    agentId: 'agent_1',
    status: 'withdrawn',
    submittedAt: '2024-03-23T12:20:00Z',
    updatedAt: '2024-03-27T14:10:00Z',
    documents: [
      {
        id: 'doc_17',
        name: 'Ahmed_ID.pdf',
        url: 'https://res.cloudinary.com/rentme/raw/upload/v1/documents/student_3_id.pdf',
        type: 'id',
        uploadedAt: '2024-03-23T12:18:00Z'
      },
      {
        id: 'doc_18',
        name: 'Medical_Student_Verification.pdf',
        url: 'https://res.cloudinary.com/rentme/raw/upload/v1/documents/student_3_verification.pdf',
        type: 'student_verification',
        uploadedAt: '2024-03-23T12:19:00Z'
      }
    ],
    personalStatement: 'I am a medical student requiring a quiet study environment. The studio apartment seems perfect for my needs.',
    references: [
      {
        name: 'Dr. Khadija Aliyu',
        relationship: 'Clinical Supervisor',
        email: 'k.aliyu@uniabuja.edu.ng',
        phoneNumber: '+234-805-456-7890',
        organization: 'University of Abuja'
      }
    ],
    preferredMoveInDate: '2024-04-10T00:00:00Z',
    additionalNotes: 'Application withdrawn - found alternative accommodation closer to hospital.',
    agentNotes: 'Student found alternative accommodation. Application withdrawn at student request.'
  }
];