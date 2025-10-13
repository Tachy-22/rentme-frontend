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
                {...register('occupation')}
                placeholder="Your current occupation"
              />
              {errors.occupation && (
                <p className="text-sm text-destructive">{errors.occupation?.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact.name">Name</Label>
                  <Input
                    id="emergencyContact.name"
                    {...register('emergencyContact.name')}
                    placeholder="Emergency contact name"
                  />
                  {errors.emergencyContact?.name && (
                    <p className="text-sm text-destructive">{errors.emergencyContact.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact.phone">Phone</Label>
                  <Input
                    id="emergencyContact.phone"
                    {...register('emergencyContact.phone')}
                    placeholder="Emergency contact phone"
                  />
                  {errors.emergencyContact?.phone && (
                    <p className="text-sm text-destructive">{errors.emergencyContact.phone.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact.relationship">Relationship</Label>
                  <Input
                    id="emergencyContact.relationship"
                    {...register('emergencyContact.relationship')}
                    placeholder="e.g., Parent, Spouse, Friend"
                  />
                  {errors.emergencyContact?.relationship && (
                    <p className="text-sm text-destructive">{errors.emergencyContact.relationship.message}</p>
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
                    {...register('preferences.budget.min', { valueAsNumber: true })}
                    placeholder="Minimum monthly budget"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferences.budget.max">Max Budget</Label>
                  <Input
                    id="preferences.budget.max"
                    type="number"
                    {...register('preferences.budget.max', { valueAsNumber: true })}
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
                {...register('licenseNumber')}
                placeholder="Real estate license number"
              />
              {errors.licenseNumber && (
                <p className="text-sm text-destructive">{errors.licenseNumber?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agencyName">Agency Name</Label>
              <Input
                id="agencyName"
                {...register('agencyName')}
                placeholder="Your real estate agency"
              />
              {errors.agencyName && (
                <p className="text-sm text-destructive">{errors.agencyName?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceYears">Years of Experience</Label>
              <Input
                id="experienceYears"
                type="number"
                {...register('experienceYears', { valueAsNumber: true })}
                placeholder="Years in real estate"
              />
              {errors.experienceYears && (
                <p className="text-sm text-destructive">{errors.experienceYears?.message}</p>
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
                {...register('department')}
                placeholder="Your department"
              />
              {errors.department && (
                <p className="text-sm text-destructive">{errors.department?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                {...register('employeeId')}
                placeholder="Your employee ID"
              />
              {errors.employeeId && (
                <p className="text-sm text-destructive">{errors.employeeId?.message}</p>
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
                    {...register('firstName')}
                    placeholder="Your first name"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    placeholder="Your last name"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    {...register('phoneNumber')}
                    placeholder="Your phone number"
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register('dateOfBirth')}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  {...register('bio')}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
                {errors.bio && (
                  <p className="text-sm text-destructive">{errors.bio.message}</p>
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