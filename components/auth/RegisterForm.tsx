'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, User, Mail, Lock, Phone, Building, MapPin } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { UserRole, RenterProfile, AgentProfile } from '@/types';

const baseFields = {
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
};

const renterSchema = z.object({
  ...baseFields,
  role: z.literal('renter'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  occupation: z.string().min(1, 'Occupation is required'),
  employer: z.string().optional(),
  monthlyIncome: z.number().min(0, 'Monthly income must be positive'),
  budgetMin: z.number().min(0, 'Minimum budget must be positive'),
  budgetMax: z.number().min(0, 'Maximum budget must be positive'),
  emergencyContactName: z.string().min(1, 'Emergency contact name is required'),
  emergencyContactRelationship: z.string().min(1, 'Emergency contact relationship is required'),
  emergencyContactPhone: z.string().min(10, 'Emergency contact phone is required'),
  emergencyContactEmail: z.string().email('Valid emergency contact email is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => data.budgetMax >= data.budgetMin, {
  message: "Maximum budget must be greater than or equal to minimum budget",
  path: ["budgetMax"],
});

const agentSchema = z.object({
  ...baseFields,
  role: z.literal('agent'),
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  officeAddress: z.string().min(1, 'Office address is required'),
  website: z.string().url('Valid website URL is required').optional().or(z.literal('')),
  commissionRate: z.number().min(0).max(100, 'Commission rate must be between 0 and 100'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const registerSchema = z.discriminatedUnion('role', [renterSchema, agentSchema]);

type RegisterFormData = z.infer<typeof registerSchema>;
type RenterFormData = z.infer<typeof renterSchema>;
type AgentFormData = z.infer<typeof agentSchema>;

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<'renter' | 'agent'>('renter');
  const { signUp } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'renter',
    },
  });

  const watchedRole = watch('role');

  // Type-safe error accessor
  const getFieldError = (fieldName: string): string | undefined => {
    if (watchedRole === 'renter') {
      const renterErrors = errors as Partial<FieldErrors<RenterFormData>>;
      return (renterErrors as Record<string, { message?: string }>)[fieldName]?.message;
    } else {
      const agentErrors = errors as Partial<FieldErrors<AgentFormData>>;
      return (agentErrors as Record<string, { message?: string }>)[fieldName]?.message;
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');

    try {
      let profile: RenterProfile | AgentProfile;

      if (data.role === 'renter') {
        const renterData = data as z.infer<typeof renterSchema>;
        profile = {
          firstName: renterData.firstName,
          lastName: renterData.lastName,
          dateOfBirth: renterData.dateOfBirth,
          phoneNumber: renterData.phoneNumber,
          occupation: renterData.occupation,
          employer: renterData.employer || '',
          monthlyIncome: renterData.monthlyIncome,
          preferredBudget: {
            min: renterData.budgetMin,
            max: renterData.budgetMax,
          },
          preferredPropertyTypes: [],
          preferredLocations: [],
          bio: renterData.bio,
          profilePicture: '',
          identityVerified: false,
          incomeVerified: false,
          emergencyContact: {
            name: renterData.emergencyContactName,
            relationship: renterData.emergencyContactRelationship,
            phoneNumber: renterData.emergencyContactPhone,
            email: renterData.emergencyContactEmail,
          },
          preferences: {
            petsAllowed: false,
            smokingAllowed: false,
            furnished: false,
            maxCommute: 60,
          },
          savedSearches: [],
          viewedProperties: [],
        } as unknown as RenterProfile;
      } else {
        const agentData = data as z.infer<typeof agentSchema>;
        profile = {
          firstName: agentData.firstName,
          lastName: agentData.lastName,
          company: agentData.company,
          position: agentData.position,
          licenseNumber: agentData.licenseNumber,
          bio: agentData.bio,
          profilePicture: '',
          phoneNumber: agentData.phoneNumber,
          officeAddress: agentData.officeAddress,
          website: agentData.website || '',
          specialties: [],
          serviceAreas: [],
          languages: ['English'],
          rating: 0,
          totalReviews: 0,
          totalProperties: 0,
          totalDeals: 0,
          responseTime: 24,
          verificationStatus: 'pending',
          verificationDocuments: [],
          commissionRate: agentData.commissionRate,
          availabilitySchedule: {
            monday: { available: true, startTime: '09:00', endTime: '17:00' },
            tuesday: { available: true, startTime: '09:00', endTime: '17:00' },
            wednesday: { available: true, startTime: '09:00', endTime: '17:00' },
            thursday: { available: true, startTime: '09:00', endTime: '17:00' },
            friday: { available: true, startTime: '09:00', endTime: '17:00' },
            saturday: { available: false },
            sunday: { available: false },
          },
        } as unknown as AgentProfile;
      }

      const result = await signUp(data.email, data.password, {
        role: data.role as UserRole,
        profile,
      });

      if (result.success) {
        router.push('/auth/verification-pending');
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Account Type Selection */}
        <div className="space-y-3">
          <Label>Account Type</Label>
          <Select
            value={selectedRole}
            onValueChange={(value: 'renter' | 'agent') => {
              setSelectedRole(value);
              setValue('role', value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="renter">Renter - Looking for properties</SelectItem>
              <SelectItem value="agent">Agent - Managing properties</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="firstName"
                placeholder="Enter your first name"
                className="pl-10"
                {...register('firstName')}
              />
            </div>
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="lastName"
                placeholder="Enter your last name"
                className="pl-10"
                {...register('lastName')}
              />
            </div>
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                className="pl-10"
                {...register('phoneNumber')}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="pl-10"
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="pl-10"
                {...register('confirmPassword')}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {/* Role-specific fields */}
        {watchedRole === 'renter' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register('dateOfBirth')}
                />
                {getFieldError('dateOfBirth') && (
                  <p className="text-sm text-destructive">{getFieldError('dateOfBirth')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  placeholder="Enter your occupation"
                  {...register('occupation')}
                />
                {getFieldError('occupation') && (
                  <p className="text-sm text-destructive">{getFieldError('occupation')}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employer">Employer (Optional)</Label>
                <Input
                  id="employer"
                  placeholder="Enter your employer"
                  {...register('employer')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Income</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  placeholder="Enter monthly income"
                  {...register('monthlyIncome', { valueAsNumber: true })}
                />
                {getFieldError('monthlyIncome') && (
                  <p className="text-sm text-destructive">{getFieldError('monthlyIncome')}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetMin">Minimum Budget</Label>
                <Input
                  id="budgetMin"
                  type="number"
                  placeholder="Minimum budget"
                  {...register('budgetMin', { valueAsNumber: true })}
                />
                {getFieldError('budgetMin') && (
                  <p className="text-sm text-destructive">{getFieldError('budgetMin')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetMax">Maximum Budget</Label>
                <Input
                  id="budgetMax"
                  type="number"
                  placeholder="Maximum budget"
                  {...register('budgetMax', { valueAsNumber: true })}
                />
                {getFieldError('budgetMax') && (
                  <p className="text-sm text-destructive">{getFieldError('budgetMax')}</p>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Full Name</Label>
                  <Input
                    id="emergencyContactName"
                    placeholder="Emergency contact name"
                    {...register('emergencyContactName')}
                  />
                  {getFieldError('emergencyContactName') && (
                    <p className="text-sm text-destructive">{getFieldError('emergencyContactName')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                  <Input
                    id="emergencyContactRelationship"
                    placeholder="Relationship to you"
                    {...register('emergencyContactRelationship')}
                  />
                  {getFieldError('emergencyContactRelationship') && (
                    <p className="text-sm text-destructive">{getFieldError('emergencyContactRelationship')}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">Phone Number</Label>
                  <Input
                    id="emergencyContactPhone"
                    type="tel"
                    placeholder="Emergency contact phone"
                    {...register('emergencyContactPhone')}
                  />
                  {getFieldError('emergencyContactPhone') && (
                    <p className="text-sm text-destructive">{getFieldError('emergencyContactPhone')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContactEmail">Email</Label>
                  <Input
                    id="emergencyContactEmail"
                    type="email"
                    placeholder="Emergency contact email"
                    {...register('emergencyContactEmail')}
                  />
                  {getFieldError('emergencyContactEmail') && (
                    <p className="text-sm text-destructive">{getFieldError('emergencyContactEmail')}</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {watchedRole === 'agent' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="company"
                    placeholder="Enter your company"
                    className="pl-10"
                    {...register('company')}
                  />
                </div>
                {getFieldError('company') && (
                  <p className="text-sm text-destructive">{getFieldError('company')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  placeholder="Your position/title"
                  {...register('position')}
                />
                {getFieldError('position') && (
                  <p className="text-sm text-destructive">{getFieldError('position')}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  placeholder="Real estate license number"
                  {...register('licenseNumber')}
                />
                {getFieldError('licenseNumber') && (
                  <p className="text-sm text-destructive">{getFieldError('licenseNumber')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                <Input
                  id="commissionRate"
                  type="number"
                  step="0.1"
                  placeholder="Commission rate"
                  {...register('commissionRate', { valueAsNumber: true })}
                />
                {getFieldError('commissionRate') && (
                  <p className="text-sm text-destructive">{getFieldError('commissionRate')}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="officeAddress">Office Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="officeAddress"
                  placeholder="Enter your office address"
                  className="pl-10"
                  {...register('officeAddress')}
                />
              </div>
              {getFieldError('officeAddress') && (
                <p className="text-sm text-destructive">{getFieldError('officeAddress')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://your-website.com"
                {...register('website')}
              />
              {getFieldError('website') && (
                <p className="text-sm text-destructive">{getFieldError('website')}</p>
              )}
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself"
            rows={4}
            {...register('bio')}
          />
          {errors.bio && (
            <p className="text-sm text-destructive">{errors.bio.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </div>
  );
}