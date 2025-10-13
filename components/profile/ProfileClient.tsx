'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, UserRole, RenterProfile, AgentProfile, AdminProfile } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save } from 'lucide-react';

interface ProfileClientProps {
  user: User;
}

// Base profile schema
const baseProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  bio: z.string().optional(),
  profilePicture: z.string().optional(),
});

// Renter-specific fields
const renterProfileSchema = baseProfileSchema.extend({
  role: z.literal('renter'),
  occupation: z.string().min(1, 'Occupation is required'),
  emergencyContact: z.object({
    name: z.string().min(1, 'Emergency contact name is required'),
    phone: z.string().min(10, 'Emergency contact phone is required'),
    relationship: z.string().min(1, 'Relationship is required'),
  }),
  preferences: z.object({
    budget: z.object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
    }).optional(),
    propertyType: z.array(z.string()).optional(),
    bedrooms: z.object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
    }).optional(),
    bathrooms: z.object({
      min: z.number().min(0).optional(),
    }).optional(),
    petFriendly: z.boolean().optional(),
    smokingAllowed: z.boolean().optional(),
    furnished: z.boolean().optional(),
  }).optional(),
});

// Agent-specific fields
const agentProfileSchema = baseProfileSchema.extend({
  role: z.literal('agent'),
  licenseNumber: z.string().min(1, 'License number is required'),
  agencyName: z.string().min(1, 'Agency name is required'),
  experienceYears: z.number().min(0, 'Experience years must be positive'),
  specializations: z.array(z.string()).min(1, 'At least one specialization is required'),
  serviceAreas: z.array(z.string()).min(1, 'At least one service area is required'),
  rating: z.number().min(0).max(5).optional(),
  totalReviews: z.number().min(0).optional(),
  totalDeals: z.number().min(0).optional(),
  responseTime: z.number().min(0).optional(),
});

// Admin-specific fields
const adminProfileSchema = baseProfileSchema.extend({
  role: z.literal('admin'),
  department: z.string().min(1, 'Department is required'),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
  employeeId: z.string().min(1, 'Employee ID is required'),
});

// Super admin-specific fields
const superAdminProfileSchema = baseProfileSchema.extend({
  role: z.literal('super_admin'),
  department: z.string().min(1, 'Department is required'),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
  employeeId: z.string().min(1, 'Employee ID is required'),
});

// Union of all profile schemas
const profileSchema = z.discriminatedUnion('role', [
  renterProfileSchema,
  agentProfileSchema,
  adminProfileSchema,
  superAdminProfileSchema,
]);

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileClient({ user }: ProfileClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      role: user.role,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      phoneNumber: user.profile.phoneNumber || user.profile.phone || '',
      dateOfBirth: (user.profile as RenterProfile)?.dateOfBirth || '',
      bio: (user.profile as RenterProfile | AgentProfile)?.bio || '',
      profilePicture: user.profile.profilePicture || '',
      ...(user.role === 'renter' && {
        occupation: (user.profile as RenterProfile).occupation || '',
        emergencyContact: (user.profile as RenterProfile).emergencyContact || { name: '', phone: '', relationship: '' },
        preferences: (user.profile as RenterProfile).preferences || {},
      }),
      ...(user.role === 'agent' && {
        licenseNumber: (user.profile as AgentProfile).licenseNumber || '',
        agencyName: (user.profile as AgentProfile).company || '',
        experienceYears: 0, // Not in AgentProfile type, will be calculated
        specializations: (user.profile as AgentProfile).specialties || [],
        serviceAreas: (user.profile as AgentProfile).serviceAreas || [],
        rating: (user.profile as AgentProfile).rating || 0,
        totalReviews: (user.profile as AgentProfile).totalReviews || 0,
        totalDeals: (user.profile as AgentProfile).totalDeals || 0,
        responseTime: (user.profile as AgentProfile).responseTime || 0,
      }),
      ...(user.role === 'admin' && {
        department: (user.profile as AdminProfile).department || '',
        permissions: (user.profile as AdminProfile).permissions || [],
        employeeId: (user.profile as AdminProfile).employeeId || '',
      }),
      ...(user.role === 'super_admin' && {
        department: (user.profile as AdminProfile).department || '',
        permissions: (user.profile as AdminProfile).permissions || [],
        employeeId: (user.profile as AdminProfile).employeeId || '',
      }),
    } as ProfileFormData,
  });

  const role = watch('role') as UserRole;

  // Type-safe helpers for discriminated union form
  const safeRegister = register as unknown as (name: string) => Record<string, unknown>;
  const safeErrors = errors as unknown as Record<string, { message?: string }>;

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const { updateDocument } = await import('@/actions');
      const result = await updateDocument({
        collectionName: 'users',
        documentId: user.id,
        data: {
          profile: data,
          updatedAt: new Date().toISOString()
        }
      });

      if (result.success) {
        setSuccess('Profile updated successfully!');
        router.refresh();
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    switch (role) {
      case 'renter':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                {...safeRegister('occupation')}
                placeholder="Your current occupation"
              />
              {safeErrors.occupation && (
                <p className="text-sm text-destructive">{safeErrors.occupation?.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact.name">Name</Label>
                  <Input
                    id="emergencyContact.name"
                    {...safeRegister('emergencyContact.name')}
                    placeholder="Emergency contact name"
                  />
                  {safeErrors['emergencyContact.name'] && (
                    <p className="text-sm text-destructive">{safeErrors['emergencyContact.name']?.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact.phone">Phone</Label>
                  <Input
                    id="emergencyContact.phone"
                    {...safeRegister('emergencyContact.phone')}
                    placeholder="Emergency contact phone"
                  />
                  {safeErrors['emergencyContact.phone'] && (
                    <p className="text-sm text-destructive">{safeErrors['emergencyContact.phone']?.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact.relationship">Relationship</Label>
                  <Input
                    id="emergencyContact.relationship"
                    {...safeRegister('emergencyContact.relationship')}
                    placeholder="e.g., Parent, Spouse, Friend"
                  />
                  {safeErrors['emergencyContact.relationship'] && (
                    <p className="text-sm text-destructive">{safeErrors['emergencyContact.relationship']?.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Rental Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferences.budget.min">Min Budget</Label>
                  <Input
                    id="preferences.budget.min"
                    type="number"
                    {...safeRegister('preferences.budget.min')}
                    placeholder="Minimum monthly budget"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferences.budget.max">Max Budget</Label>
                  <Input
                    id="preferences.budget.max"
                    type="number"
                    {...safeRegister('preferences.budget.max')}
                    placeholder="Maximum monthly budget"
                  />
                </div>
              </div>
            </div>
          </>
        );

      case 'agent':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                {...safeRegister('licenseNumber')}
                placeholder="Real estate license number"
              />
              {safeErrors.licenseNumber && (
                <p className="text-sm text-destructive">{safeErrors.licenseNumber?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agencyName">Agency Name</Label>
              <Input
                id="agencyName"
                {...safeRegister('agencyName')}
                placeholder="Your real estate agency"
              />
              {safeErrors.agencyName && (
                <p className="text-sm text-destructive">{safeErrors.agencyName?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceYears">Years of Experience</Label>
              <Input
                id="experienceYears"
                type="number"
                {...safeRegister('experienceYears')}
                placeholder="Years in real estate"
              />
              {safeErrors.experienceYears && (
                <p className="text-sm text-destructive">{safeErrors.experienceYears?.message}</p>
              )}
            </div>
          </>
        );

      case 'admin':
      case 'super_admin':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                {...safeRegister('department')}
                placeholder="Your department"
              />
              {safeErrors.department && (
                <p className="text-sm text-destructive">{safeErrors.department?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                {...safeRegister('employeeId')}
                placeholder="Your employee ID"
              />
              {safeErrors.employeeId && (
                <p className="text-sm text-destructive">{safeErrors.employeeId?.message}</p>
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div> */}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update your basic profile information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...safeRegister('firstName')}
                    placeholder="Your first name"
                  />
                  {safeErrors.firstName && (
                    <p className="text-sm text-destructive">{safeErrors.firstName?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...safeRegister('lastName')}
                    placeholder="Your last name"
                  />
                  {safeErrors.lastName && (
                    <p className="text-sm text-destructive">{safeErrors.lastName?.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    {...safeRegister('phoneNumber')}
                    placeholder="Your phone number"
                  />
                  {safeErrors.phoneNumber && (
                    <p className="text-sm text-destructive">{safeErrors.phoneNumber?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...safeRegister('dateOfBirth')}
                  />
                  {safeErrors.dateOfBirth && (
                    <p className="text-sm text-destructive">{safeErrors.dateOfBirth?.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  {...safeRegister('bio')}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
                {safeErrors.bio && (
                  <p className="text-sm text-destructive">{safeErrors.bio?.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role-Specific Information</CardTitle>
              <CardDescription>
                Information specific to your role as a {role}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderRoleSpecificFields()}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}