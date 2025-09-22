# RentMe - University Accommodation Platform

A mobile-first platform connecting university students with accommodation agents around campus. Built with the native mobile app experience in mind, not just responsive web design.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS (LinkedIn-inspired UX patterns)
- **Animations**: Framer Motion
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Language**: TypeScript
- **Design Philosophy**: Mobile-first native app feel with web responsiveness

## User Types

### Students
- Primary users looking for accommodation near university
- Mobile-first experience for browsing and communication

### Agents
- Property managers, landlords, and accommodation providers
- Listing management and student communication tools

## Core Features

### Authentication & Onboarding
- **Firebase Authentication** with email/password and social login
- **User Type Selection** during registration (Student/Agent)
- **Profile Setup** with video uploads for students
- **LinkedIn-style onboarding** with progress indicators

### Student Features

#### Discovery & Search
- **Home Feed** with personalized accommodation recommendations
- **Map-based Search** with university proximity filters
- **Advanced Filters**: price range, room type, amenities, distance
- **Saved Properties** with wishlist functionality
- **Recent Searches** and search history

#### Property Interaction
- **Swipe-based Browsing** (Tinder-like interface for quick decisions)
- **Photo Gallery** with full-screen image viewing
- **360° Virtual Tours** support
- **Property Details** with comprehensive information
- **Amenities Checklist** with visual icons
- **Neighborhood Info** with nearby facilities

#### Communication
- **In-app Messaging** with agents (LinkedIn-style chat)
- **Quick Actions**: "Interested", "Request Tour", "Ask Question"
- **Group Chats** for students sharing accommodation
- **Read Receipts** and online status

#### Application Process
- **Digital Applications** with document upload
- **Application Tracking** with status updates
- **Document Management** (ID, student verification, references)
- **E-signatures** for lease agreements

### Agent Features

#### Property Management
- **Listing Creation** with drag-and-drop photo upload
- **Bulk Photo Upload** with automatic optimization
- **Property Analytics** (views, saves, applications)
- **Availability Calendar** with booking management
- **Pricing Tools** with market comparison

#### Lead Management
- **Student Inquiries Dashboard**
- **Application Management** with approval workflows
- **Communication Hub** with all student conversations
- **Lead Scoring** based on student activity
- **Automated Responses** for common questions

#### Business Tools
- **Revenue Dashboard** with earnings tracking
- **Performance Metrics** (conversion rates, response times)
- **Commission Tracking** for multi-agent properties
- **Client Testimonials** and review management

### Shared Features

#### Social Elements
- **User Profiles** with LinkedIn-style layouts
- **Reviews & Ratings** for properties and users
- **Agent Verification** with agent ID or NIN upload
- **Referral System** with rewards
- **Community Guidelines** and reporting

#### Mobile-Native UX
- **Bottom Navigation** with tab-based interface
- **Pull-to-Refresh** on feed and listings
- **Infinite Scroll** for property listings
- **Gesture Controls** (swipe, pinch-to-zoom)
- **Haptic Feedback** for interactions
- **Native-like Transitions** with Framer Motion

#### Search & Discovery
- **Smart Recommendations** based on preferences
- **Trending Properties** in specific areas
- **Recently Viewed** with quick access
- **Similar Properties** suggestions
- **Price Alerts** for budget matches

#### Communication Platform
- **Real-time Messaging** with typing indicators
- **Media Sharing** (photos, documents, videos)
- **Message Threading** for organized conversations
- **Push Notifications** for new messages and updates
- **Video Calls** for virtual property tours

## Mobile-First Design Principles

### Navigation Pattern
- **Bottom Tab Bar** as primary navigation (Home, Search, Messages, Profile)
- **Stack Navigation** within each tab
- **Modal Presentations** for forms and detailed views
- **Gesture-based Navigation** (swipe back, pull down)

### Interaction Design
- **Large Touch Targets** (minimum 44px)
- **Thumb-friendly Layout** with important actions at bottom
- **Card-based Interface** for easy scrolling
- **Progressive Disclosure** to reduce cognitive load

### Visual Hierarchy
- **LinkedIn-inspired Design Language**
- **Consistent Typography Scale**
- **Strategic Use of White Space**
- **Icon-driven Interface** with minimal text

### Performance Optimization
- **Lazy Loading** for images and content
- **Optimistic UI Updates** for instant feedback
- **Offline Capability** for viewed properties
- **Progressive Web App** features

## Firebase Integration

### Authentication
- Email/password and social providers
- Agent ID/NIN verification for agents
- Role-based access control

### Firestore Database
- Real-time messaging
- Property listings with geolocation
- User profiles and preferences
- Application and booking data

### Storage
- **Cloudinary** for image optimization and CDN
- Document storage for applications
- Profile photos and property images

### Realtime Database
- Real-time messaging and chat functionality
- Live updates for property availability
- Instant notifications

### Cloud Functions
- Notification triggers
- Data validation and security

## Additional Features

### Notifications
- **Push Notifications** for messages and updates
- **In-app Notifications** with action buttons
- **Email Notifications** for important updates

### Safety & Security
- **Secure Payments** integration
- **Report System** for inappropriate content
- **Block/Mute Features** for harassment prevention

### Analytics & Insights
- **User Behavior Tracking**
- **Property Performance Analytics**
- **Conversion Funnel Analysis**


## Development Approach

This platform prioritizes the mobile experience above all else, ensuring that every interaction feels native and intuitive on mobile devices while maintaining full functionality on desktop through progressive enhancement.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
# rentme-frontend
